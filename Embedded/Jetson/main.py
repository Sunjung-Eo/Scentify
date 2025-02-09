import os, sys
import json
import asyncio
import re
import math

from mode import *
from mqtt_client import *

current_dir = os.path.dirname(__file__)  # 현재 파일의 디렉토리
parent_dir = os.path.abspath(os.path.join(current_dir, ".."))  # 상위 디렉토리

os.chdir(parent_dir)
sys.path.append(os.path.abspath("HW/modules"))

from Solenoid import *
from LoadCell import *
from GSAT_P110 import *

os.chdir(parent_dir)
sys.path.append(os.path.abspath("AI/modules"))

from camera import *
from slowfast import *
from yolo import *

class SmartDiffuser:
    def __init__(self):
        # AI 모델
        self.camera = Camera()
        self.yolo = SIMPLEYOLO()
        self.slowfast = SlowFast()

        # self.frame = None

        # HW
        # 악취 감지 센서
        # self.stink_sensor = StinkSensor()

        # 무게 감지 센서
        # self.loadcell = LoadCell(pin_dt=31, pin_sck=33)

        # 모터
        self.soleniods = [
            Solenoid(31, 33),
            Solenoid(16, 18),
            Solenoid(13, 15),
            Solenoid(35, 37),
        ] 

        # MQTT Client
        self.mqtt_client = MQTTClient(
            "192.168.137.127",
             process_message=self.process_mqtt_message,
        )

        # 디퓨저 정보
        self.slot_to_capsule = {
            "slot1" : 0,
            "slot2" : 1,
            "slot3" : 2,
            "slot4" : 3,
        }
        self.capsule_to_slot = dict()
        self.capsule_remainder = {
            "slot1RemainingRatio" : 100,
            "slot2RemainingRatio" : 100,
            "slot3RemainingRatio" : 100,
            "slot4RemainingRatio" : 100,
        }

        self.mode_type = AutoModeType()

        # 동작 모드
        self.mode = Mode()
        self.type_to_id = {
            self.mode_type.simple_detect : 0,
            self.mode_type.exercise_detect : 1,
            self.mode_type.relax_detect : 2,
            self.mode_type.stink_detect : 3,
        }
    
    def is_valid_key(self, payload, key):
        return payload[key] is not None

    async def process_mqtt_message(self, topic, payload):
        topic = topic.value

        if topic == f"{self.mqtt_client.device_id}/Operation":
            # 모터 동작
            payload = json.loads(payload)
            
            cap_slot, cap_cnt = [], []
            choices = ['choice1', 'choice2', 'choice3', 'choice4']
            counts = ['choice1Count', 'choice2Count', 'choice3Count', 'choice4Count']

            cap_slot = [self.capsule_to_slot[payload[ch]] for ch in choices if self.is_valid_key(payload, ch)]
            cap_cnt = [payload[cnt] for cnt in counts if self.is_valid_key(payload, cnt)]

            # choice가 동일한 것이 있다면 슬롯에 대해서 균일하게 분사.
            num_operate_for_slot = [0] * 4
    
            for (index, slot_num) in enumerate(cap_slot):
                cnt = cap_cnt[index]
                slot_idx = 0
                # cnt만큼 뿌릴 건데, 그 향에 해당하는 슬롯에 돌아가면서 cnt를 1씩 증가시켜준다.
                for _ in range(cnt):
                    slot_idx %= len(slot_num)
                    num_operate_for_slot[slot_num[slot_idx]] += 1
                    slot_idx += 1

            for (index, value) in enumerate(num_operate_for_slot):
                self.soleniods[index].operate_repeat(repeat_num=value, time_duration=1)

            # 잔여량 계산
            # self.update_ramainder()
            
            # 잔여량 표시
            await self.send_remainder()

        elif topic == f"{self.mqtt_client.device_id}/SetOperationMode":
            old_operation_mode = self.mode.operation_mode
            print("================OperationMode================")
            print(self.mode.operation_mode)

            payload = json.loads(payload)
            self.mode.operation_mode = int(payload["mode"])

            print("================Updated OperationMode================")
            print(self.mode.operation_mode)

            if old_operation_mode == 0 and self.mode.operation_mode == 1:
                # 자동화 모드 정보 요청
                await self.mqtt_client.publish(f"{self.mqtt_client.device_id}/Request/AutoModeInfo", "0")

        elif topic == f"{self.mqtt_client.device_id}/AutoModeInit":
            payload = json.loads(payload)
            modes = payload["schedules"]

            for mode in modes:
                id = mode["id"]
                self.mode.auto_operation_mode[id] = AutoDetectionMode(
                    combinationId = int(mode["combinationId"]),
                    interval = int(mode["interval"]),
                    modeOn = bool(mode["modeOn"]),
                    operation_type = mode["type"],
                    sub_mode = int(mode["subMode"])
                )
            self.mapping_id_to_type()

        elif topic == f"{self.mqtt_client.device_id}/AutoModeChange":
            payload = json.loads(payload)
            id = payload["id"]
            del payload["id"]

            if id in self.mode.auto_operation_mode:
                print("Not Exist Id for Auto Mode Operation")
                return

            print("=====================Origin Auto Mode=====================")
            print(self.mode.auto_operation_mode[id])

            key = next(iter(payload))
            setattr(self.mode.auto_operation_mode[id], key, payload[key])

            print("=====================Updated Auto Mode=====================")
            print(self.mode.auto_operation_mode[id])

        elif topic == f"{self.mqtt_client.device_id}/CapsuleInfo":
            # 캡슐 맵핑
            payload = json.loads(payload)

            for key in self.slot_to_capsule.keys():
                self.slot_to_capsule[key] = payload[key]
            
            for slot, capsule in self.slot_to_capsule.items():
                if capsule not in self.capsule_to_slot:
                    self.capsule_to_slot[capsule] = []
                slot_number = int(re.search(r'\d+', slot).group()) 
                self.capsule_to_slot[capsule].append(slot_number)

            await self.send_remainder()

    def mapping_id_to_type(self,):
        for value in self.mode.auto_operation_mode.values():
            if value.sub_mode == 0:
                self.type_to_id[self.mode_type.simple_detect] = value.id
            elif value.sub_mode == 1:
                if value.type == 1:
                    self.type_to_id[self.mode_type.exercise_detect] = value.id
                elif value.type == 2:
                    self.type_to_id[self.mode_type.relax_detect] = value.id
            elif value.sub_mode == 2:
                self.type_to_id[self.mode_type.stink_detect] = value.id

    async def send_remainder(self):
        # 잔여량 전송
        msg = json.dumps(self.capsule_remainder)
        await self.mqtt_client.publish(f"{self.mqtt_client.device_id}/Status/Remainder", msg)

    async def operate_simple_detect(self):
        while True:
            frame = await self.camera.get_one_frame()
            person_detect = self.yolo.person_detect(frame)
            if person_detect:
                # Operation
                msg = {
                    "combinationId" : self.mode.auto_operation_mode[self.type_to_id[self.mode_type.simple_detect]].combinationId
                }
                await self.mqtt_client.publish(f"{self.mqtt_client.device_id}/Request/Combination", json.dumps(msg))
                await asyncio.sleep(60 * self.mode.auto_operation_mode[self.type_to_id[self.mode_type.simple_detect]].interval)

    async def operate_action_detect(self):
        while (self.mode.auto_operation_mode[self.type_to_id[self.mode_type.relax_detect]].modeOn or
            self.mode.auto_operation_mode[self.type_to_id[self.mode_type.exercise_detect]].modeOn):
            
            frames = await self.camera.get_frames(self.slowfast.required_frames_num)
            ret = self.slowfast.analyze_action(frames)
            if ret == 1 and self.mode.auto_operation_mode[self.type_to_id[self.mode_type.exercise_detect]].modeOn:
                pass
            if ret == 2 and self.mode.auto_operation_mode[self.type_to_id[self.mode_type.relax_detect]].modeOn:
                pass

    async def operate_stink_detect(self):
        pass    


async def main():
    smart_diffuser = SmartDiffuser()
    asyncio.create_task(smart_diffuser.mqtt_client.connect())
    await asyncio.sleep(2)
    # asyncio.create_task(smart_diffuser.operate_simple_detect())
    while True:
        await asyncio.sleep(1)
        

asyncio.run(main())
    
