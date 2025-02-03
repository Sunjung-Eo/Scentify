import os, sys
import json
import asyncio
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
            Solenoid(7, 11),
            Solenoid(16, 18),
            Solenoid(13, 15),
            Solenoid(35, 37)
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
    
    async def process_mqtt_message(self, topic, payload):
        message = dict()
        topic = topic.value

        if topic == f"{self.mqtt_client.device_id_list[0]}/Operation":
            pass
            # 모터 동작
            # soleniods[0].operate_once()

            # 잔여량 표시

        elif topic == f"{self.mqtt_client.device_id_list[0]}/ModeInfo":
            pass
            # 내부  모드 설정

        elif topic == f"{self.mqtt_client.device_id_list[0]}/CapsuleInfo":
            # 캡슐 맵핑
            payload = json.loads(payload)


            for key in self.slot_to_capsule.keys():
                self.slot_to_capsule[key] = payload[key]
            
            for slot, capsule in self.slot_to_capsule.items():
                if capsule not in self.capsule_to_slot:
                    self.capsule_to_slot[capsule] = []
                self.capsule_to_slot[capsule].append(slot)

            # 잔여량 전송
            msg = json.dumps(self.capsule_remainder)
            await self.mqtt_client.publish(f"{self.mqtt_client.device_id_list[0]}/Status/Remainder", msg)

async def main():
    smart_diffuser = SmartDiffuser()
    asyncio.create_task(smart_diffuser.mqtt_client.connect())
    while True:
        await asyncio.sleep(1)

asyncio.run(main())
    
