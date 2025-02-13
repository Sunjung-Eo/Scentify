import os, sys
import json
import asyncio, nest_asyncio
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

nest_asyncio.apply()

class SmartDiffuser:
    def __init__(self):
        self.print_log = True

        # AI 모델
        self.camera = Camera()
        self.yolo = SIMPLEYOLO()
        self.slowfast = SlowFast()
        # self.camera = None
        # self.yolo = None
        # self.slowfast = None

        self.slowfast.print_log = True

        # HW
        # 악취 감지 센서
        self.stink_sensor = StinkSensor()
        self.th_stink_value = 30

        # 무게 감지 센서
        # self.loadcell = LoadCell(pin_dt=31, pin_sck=33)
        # self.loadcell.window_size = 100
        # self.max_capsule_weight = 200.0
        # self.min_capsule_weight = 20.0
        # self.current_capsule_weight = [200.0, 200.0, 200.0, 200.0]
        # self.account_operation = 1.0
        # self.init_weight()

        # 모터
        self.soleniods = [
            Solenoid(13, 15),
            Solenoid(16, 18),
            Solenoid(29, 32),
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

        # 동작 우선 순위
        self.operation_priority = {
            self.mode_type.stink_detect : 0,
            self.mode_type.exercise_detect : 1,
            self.mode_type.relax_detect : 1,
            self.mode_type.simple_detect : 2,
            self.mode_type.no_running : 3
        }

        self.running_state = self.mode_type.no_running
        self.min_interval = 0.3

    def is_valid_key(self,key):
        return key in self.capsule_to_slot

    async def process_mqtt_message(self, topic, payload):
        topic = topic.value

        if topic == f"{self.mqtt_client.device_id}/Operation":
            # 모터 동작
            asyncio.create_task(self.operate_solenoid(payload))

        elif topic == f"{self.mqtt_client.device_id}/SetOperationMode":
            old_operation_mode = self.mode.operation_mode
            if self.print_log:
                print("================OperationMode================")
                print(self.mode.operation_mode)

            payload = json.loads(payload)
            self.mode.operation_mode = int(payload["mode"])

            if self.print_log:
                print("================Updated OperationMode================")
                print(self.mode.operation_mode)

            if old_operation_mode != 1 and self.mode.operation_mode == 1:
                # 자동화 모드 정보 요청
                await self.mqtt_client.publish(f"{self.mqtt_client.device_id}/Request/AutoModeInfo", "0")

        elif topic == f"{self.mqtt_client.device_id}/AutoModeInit":
            payload = json.loads(payload)
            modes = payload["schedules"]

            for mode in modes:
                id = mode["id"]
                self.mode.auto_operation_mode[id] = AutoDetectionMode(
                    combinationId = int(mode["combinationId"]),
                    interval = int(mode["interval"]) if mode["interval"] is not None else 0,
                    modeOn = bool(mode["modeOn"]),
                    operation_type = mode["type"],
                    sub_mode = int(mode["subMode"])
                )

            if self.mode.operation_mode == 1:
                for id, auto_mode in self.mode.auto_operation_mode.items():
                    if auto_mode.is_running or not auto_mode.modeOn:
                        continue
                    await self.run_auto_mode(id)
                    

            self.mapping_id_to_type()
            
        elif topic == f"{self.mqtt_client.device_id}/AutoModeChange":
            payload = json.loads(payload)
            id = payload["id"]
            del payload["id"]

            if id not in self.mode.auto_operation_mode:
                print("Not Exist Id for Auto Mode Operation")
                return

            if self.print_log:
                print("=====================Origin Auto Mode=====================")
                print(self.mode.auto_operation_mode[id])

            key = next(iter(payload))
            setattr(self.mode.auto_operation_mode[id], key, payload[key])

            # key가 modeOn을 수정하는 거라면, 해당하는 함수 호출
            if key == "modeOn":
                if bool(payload[key]) == True:
                    print("MESSAGE ------------------- MODE ON!!")
                    await self.run_auto_mode(id)
                else:
                    self.mode.auto_operation_mode[id].is_running = False

            if self.print_log:
                print("=====================Updated Auto Mode=====================")
                print(self.mode.auto_operation_mode[id])
            

        elif topic == f"{self.mqtt_client.device_id}/CapsuleInfo":
            # 캡슐 맵핑
            payload = json.loads(payload)
            self.capsule_to_slot = dict()

            for key in self.slot_to_capsule.keys():
                self.slot_to_capsule[key] = payload[key]
            
            for slot, capsule in self.slot_to_capsule.items():
                if capsule not in self.capsule_to_slot:
                    self.capsule_to_slot[capsule] = []
                slot_number = int(re.search(r'\d+', slot).group()) 
                self.capsule_to_slot[capsule].append(slot_number)

            await self.send_remainder()

    async def operate_solenoid(self, data):
        payload = json.loads(data)
        
        cap_cnt = []
        choices = ['choice1', 'choice2', 'choice3', 'choice4']
        counts = ['choice1Count', 'choice2Count', 'choice3Count', 'choice4Count']

        # 각 캡슐에 대한 분사 횟수 합계
        cap_cnt = dict()
        # 각 캡슐 index에 대해서 cap_cnt를 합계한다.
        for idx, cnt_key in enumerate(counts):
            if payload[choices[idx]] is None or  payload[counts[idx]] is None:
                continue
            if payload[choices[idx]] not in cap_cnt:
                cap_cnt[payload[choices[idx]]] = 0
            cap_cnt[payload[choices[idx]]] += payload[cnt_key]

        print(cap_cnt)

        # 슬롯 당 분사해야 하는 횟수
        num_operate_for_slot = [0] * 4

        # 캡슐 : 횟수 데이터에 대해서 순회
        for key, value in cap_cnt.items():
            # 특정 캡슐에 해당하는 슬롯 인덱스
            slot_idx = 0
            # 횟수 만큼 반복
            for _ in range(value):
                # index 예외 처리
                if key not in self.capsule_to_slot:
                    continue
                slot_idx %= len(self.capsule_to_slot[key])
                # 캡슐에 해당하는 슬롯에 count를 하나씩 증가
                num_operate_for_slot[self.capsule_to_slot[key][slot_idx] - 1] += 1
                slot_idx += 1

        # 잔여량 계산
        # self.update_remainder(num_operate_for_slot)

        while True:
            if num_operate_for_slot[0] == 0 and num_operate_for_slot[1] == 0 and\
            num_operate_for_slot[2] == 0 and num_operate_for_slot[3] == 0:
                break
            for i in range(4):
                if num_operate_for_slot[i] == 0:
                    continue
                num_operate_for_slot[i] -= 1
                self.soleniods[i].operate_on()
            time.sleep(0.2)
            for i in range(4):
                if num_operate_for_slot[i] == 0:
                    continue
                self.soleniods[i].operate_off()

            time.sleep(0.5)

        # 잔여량 표시
        await self.send_remainder()

    async def run_auto_mode(self, id):
        if self.type_to_id[self.mode_type.simple_detect] == id:
            if self.print_log:
                print("=================== Run Simple Detect ===================")
            asyncio.create_task(self.operate_simple_detect())

        elif self.type_to_id[self.mode_type.exercise_detect] == id:
            if self.print_log:
                print("=================== Run Exercise Detect ===================")
            asyncio.create_task(self.operate_action_detect())
        
        elif self.type_to_id[self.mode_type.relax_detect] == id:
            if self.print_log:
                print("=================== Run Relax Detect ===================")
            asyncio.create_task(self.operate_action_detect())
            
        elif self.type_to_id[self.mode_type.stink_detect] == id:
            if self.print_log:
                print("=================== Run Stink Detect ===================")
            asyncio.create_task(self.operate_stink_detect())

    def init_weight(self,):
        current_weight = self.loadcell.get_weight_avg()
        if current_weight < self.max_capsule_weight and current_weight > self.min_capsule_weight:
            self.capsule_remainder[0] = (current_weight - self.min_capsule_weight) / (self.max_capsule_weight - self.min_capsule_weight) * 100 
            self.current_capsule_weight[0] = current_weight

    def update_remainder(self, num_operation):
        # 현재 무게 계산하기
        current_weight = self.loadcell.get_weight_avg()
        for idx in range(4):
            # 변화된 무게 감지
            modified_weight = self.current_capsule_weight[idx] - num_operation[idx] * self.account_operation
            modified_weight = min(self.min_capsule_weight, modified_weight)
            if idx == 0:
                # 데이터 보장
                if modified_weight < current_weight:
                    modified_weight = current_weight
            remainder_id = ""
            for id in self.capsule_remainder:
                if str(idx + 1) in id:
                    remainder_id = id
                    break
            # remainder, weight 업데이트
            self.capsule_remainder[remainder_id] = \
                int((modified_weight - self.min_capsule_weight) / (self.max_capsule_weight - self.min_capsule_weight) * 100)
            self.current_capsule_weight[idx] = modified_weight
        

    def mapping_id_to_type(self,):
        for key, value in self.mode.auto_operation_mode.items():
            if value.sub_mode == 0:
                self.type_to_id[self.mode_type.simple_detect] = key
            elif value.sub_mode == 1:
                if value.operation_type == 1:
                    self.type_to_id[self.mode_type.exercise_detect] = key
                elif value.operation_type == 2:
                    self.type_to_id[self.mode_type.relax_detect] = key
            elif value.sub_mode == 2:
                self.type_to_id[self.mode_type.stink_detect] = key

    async def send_remainder(self):
        # 잔여량 전송
        msg = json.dumps(self.capsule_remainder)
        await self.mqtt_client.publish(f"{self.mqtt_client.device_id}/Status/Remainder", msg)

    async def process_detect_auto_mode(self, mode_type):
        if self.running_state == mode_type:
            return
        
        print(f"Mode Type: {mode_type} -- {self.running_state}")
        
        # 현재 작동중인 상태 업데이트
        self.running_state = mode_type

        if self.print_log:
            print(f"current running state is {mode_type}")
        
        msg = {"combinationId" : self.mode.auto_operation_mode[self.type_to_id[mode_type]].combinationId}
        await self.mqtt_client.publish(f"{self.mqtt_client.device_id}/Request/Combination", json.dumps(msg))
        if self.print_log:
            print("Sending Data!!!!!")
        interval = max(self.min_interval, self.mode.auto_operation_mode[self.type_to_id[mode_type]].interval)
        await asyncio.sleep(60 * interval)

        # 인터벌 후 상태 초기화
        self.running_state = self.mode_type.no_running

        # Mode On이 되어 있는 자동화 태스크 실행.
        if self.mode.auto_operation_mode[self.type_to_id[self.mode_type.simple_detect]].modeOn:
            asyncio.create_task(self.operate_simple_detect())
        if self.mode.auto_operation_mode[self.type_to_id[self.mode_type.exercise_detect]].modeOn or \
        self.mode.auto_operation_mode[self.type_to_id[self.mode_type.relax_detect]].modeOn:
            asyncio.create_task(self.operate_action_detect())
        if self.mode.auto_operation_mode[self.type_to_id[self.mode_type.stink_detect]].modeOn:
            asyncio.create_task(self.operate_stink_detect())

    async def operate_simple_detect(self):
        # 2번 실행 방지
        if self.mode.auto_operation_mode[self.type_to_id[self.mode_type.simple_detect]].is_running:
            return
        
        # 실행 정보 업데이트
        self.mode.auto_operation_mode[self.type_to_id[self.mode_type.simple_detect]].is_running = True
        while self.mode.auto_operation_mode[self.type_to_id[self.mode_type.simple_detect]].modeOn and \
        self.operation_priority[self.running_state] >= self.operation_priority[self.mode_type.simple_detect]:
            if self.mode.operation_mode == 0:
                break

            print("Operation Simple Detect")
            await asyncio.sleep(1)
            frame = await self.camera.get_one_frame()
            person_detect = self.yolo.person_detect(frame)
            if person_detect:
                if self.print_log:    
                    print("Person Detect!")
                await self.process_detect_auto_mode(self.mode_type.simple_detect)
            else:
                if self.print_log:
                    print("Person Not Detect!")
        self.mode.auto_operation_mode[self.type_to_id[self.mode_type.simple_detect]].is_running = False

    async def operate_action_detect(self):
        if self.mode.auto_operation_mode[self.type_to_id[self.mode_type.relax_detect]].is_running or \
        self.mode.auto_operation_mode[self.type_to_id[self.mode_type.exercise_detect]].is_running:
            return 
        
        if self.mode.auto_operation_mode[self.type_to_id[self.mode_type.relax_detect]].modeOn:
            self.mode.auto_operation_mode[self.type_to_id[self.mode_type.relax_detect]].is_running = True
        elif self.mode.auto_operation_mode[self.type_to_id[self.mode_type.exercise_detect]].modeOn:
            self.mode.auto_operation_mode[self.type_to_id[self.mode_type.exercise_detect]].is_running = True

        while (self.mode.auto_operation_mode[self.type_to_id[self.mode_type.relax_detect]].modeOn or \
            self.mode.auto_operation_mode[self.type_to_id[self.mode_type.exercise_detect]].modeOn) and \
             self.operation_priority[self.running_state] >= self.operation_priority[self.mode_type.exercise_detect]:
            if self.mode.operation_mode == 0:
                break

            print("Operation Action Detect")
            await asyncio.sleep(1)

            frame = await self.camera.get_one_frame()
            person_detect = self.yolo.person_detect(frame)
            if person_detect:
                frames = await self.camera.get_frames(self.slowfast.required_frames_num)
                ret = self.slowfast.analyze_action(frames)
                print(ret.value)
                if ret.value == 1 and self.mode.auto_operation_mode[self.type_to_id[self.mode_type.exercise_detect]].modeOn:
                    if self.print_log:
                        print("Exercise Detect!!")
                    await self.process_detect_auto_mode(self.mode_type.exercise_detect)

                elif ret.value == 2 and self.mode.auto_operation_mode[self.type_to_id[self.mode_type.relax_detect]].modeOn:
                    if self.print_log:
                        print("Relax Detect!!")
                    await self.process_detect_auto_mode(self.mode_type.relax_detect)

        self.mode.auto_operation_mode[self.type_to_id[self.mode_type.relax_detect]].is_running = False
        self.mode.auto_operation_mode[self.type_to_id[self.mode_type.exercise_detect]].is_running = False

    async def operate_stink_detect(self):
        if self.mode.auto_operation_mode[self.type_to_id[self.mode_type.stink_detect]].is_running:
            return
        self.mode.auto_operation_mode[self.type_to_id[self.mode_type.stink_detect]].is_running = True
        while self.mode.auto_operation_mode[self.type_to_id[self.mode_type.stink_detect]].modeOn and \
        self.operation_priority[self.running_state] >= self.operation_priority[self.mode_type.stink_detect]:
            if self.mode.operation_mode == 0:
                break

            print("Operation Stink Detect")
            await asyncio.sleep(1)
            value = self.stink_sensor.read_avg_data()
            if value > self.th_stink_value:
                await self.process_detect_auto_mode(self.mode_type.stink_detect)   
        self.mode.auto_operation_mode[self.type_to_id[self.mode_type.stink_detect]].is_running = False

async def main():
    smart_diffuser = SmartDiffuser()
    asyncio.create_task(smart_diffuser.mqtt_client.connect())
    while True:
        await asyncio.sleep(2)
        
        

asyncio.run(main())
    
