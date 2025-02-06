import os, sys
import json
import asyncio
import re

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

os.chdir(parent_dir)

class SmartDiffuser:
    def __init__(self):
        # AI 모델

        # HW
        # 악취 감지 센서
        # self.stink_sensor = StinkSensor()

        # 무게 감지 센서
        # self.loadcell = LoadCell(pin_dt=31, pin_sck=33)

        # 모터
        self.soleniods = [
            Solenoid(16, 18),
            Solenoid(13, 15),
            Solenoid(35, 37),
            Solenoid(31, 33),
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

        # 동작 모드
        self.simple_detection_mode = AutoDetectionMode()
        self.exercise_detection_mode = AutoDetectionMode()
        self.relax_detection_mode = AutoDetectionMode()
        self.stink_detection_mode = AutoDetectionMode()

        self.mode = Mode()
    
    def is_valid_key(self, payload, key):
        return payload[key] is not None

    async def process_mqtt_message(self, topic, payload):
        message = dict()
        topic = topic.value

        if topic == f"{self.mqtt_client.device_id}/Operation":
            # 모터 동작
            payload = json.loads(payload)
            
            cap_slot, cap_cnt = [], []
            choices = ['choice1', 'choice2', 'choice3', 'choice4']
            counts = ['choice1Count', 'choice2Count', 'choice3Count', 'choice4Count']

            cap_slot = [self.capsule_to_slot[payload[ch]] for ch in choices if self.is_valid_key(payload, ch)]
            cap_cnt = [payload[cnt] for cnt in counts if self.is_valid_key(payload, cnt)]

            for (index, slot_num) in enumerate(cap_slot):
                print(index, slot_num[0])
                self.soleniods[slot_num[0] - 1].operate_repeat(repeat_num=cap_cnt[index], time_duration=1)

            # 잔여량 계산
            # self.update_ramainder()
            
            # 잔여량 표시
            await self.send_remainder()

        elif topic == f"{self.mqtt_client.device_id}/ModeInfo":
            payload = json.loads(payload)
            self.mode.operation_mode = int(payload["mode"])

        elif topic == f"{self.mqtt_client.device_id}/AutoModeInfo":
            payload = json.loads(payload)
            
            # print(payload)

            modes = payload["schedules"]

            for mode in modes:
                id = mode["id"]
                self.mode.auto_operation_mode[id] = AutoDetectionMode(
                    combination_id = int(mode["combinationId"]),
                    interval = int(mode["interval"]),
                    mode_on = bool(mode["modeOn"]),
                    operation_type = mode["type"],
                    sub_mode = int(mode["subMode"])
                )

                # print(self.mode.auto_operation_mode[id])

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

    async def send_remainder(self):
        # 잔여량 전송
        msg = json.dumps(self.capsule_remainder)
        await self.mqtt_client.publish(f"{self.mqtt_client.device_id}/Status/Remainder", msg)

async def main():
    smart_diffuser = SmartDiffuser()
    asyncio.create_task(smart_diffuser.mqtt_client.connect())
    while True:
        await asyncio.sleep(1)

asyncio.run(main())
    
