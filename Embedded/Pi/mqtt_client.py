import asyncio
import aiomqtt
import time
import json

class MQTTClient:
    _instance = None  

    def __new__(cls, *args, **kwargs):
        """싱글톤 인스턴스를 생성 및 반환"""
        if cls._instance is None:
            cls._instance = super(MQTTClient, cls).__new__(cls)
            cls._instance.__initialized = False  
        return cls._instance
    
    def __init__(self, url, work_queue):
        """초기화 (중복 실행 방지)"""
        if not self.__initialized:
            self.__initialized = True  
            self.__url = url
            self.device_id_list = [1]
            self.client = None
            self.work_queue = work_queue

    async def connect(self):
        async with aiomqtt.Client(self.__url) as client:
            self.client = client
            await self.subscribe()

            asyncio.create_task(self.listen_message())
            print("Complete Connect!")
            while True:
                await asyncio.sleep(1)
    
    async def listen_message(self):
        async for message in self.client.messages:
            await self.on_message(message)

    async def on_message(self, message):
        topic = message.topic
        payload = message.payload.decode()

        print(f"메시지 수신: {topic} -> {payload}")

        await self.process_message(topic, payload)

    async def process_message(self, topic, payload):
        message = dict()
        topic = topic.value

        if topic == f"{self.device_id_list[0]}/Status/Remainder":
            message["type"] = "DeviceStatus/Capsule/Remainder"
            data = json.loads(payload)
            
            for key, value in data.items():
                key = key.strip()
                message[key] = value

        elif topic == f"{self.device_id_list[0]}/Request/AutoModeInfo":
            message["type"] = "Auto/Schedule/Initial"
        
        elif topic == f"{self.device_id_list[0]}/Request/Combination":
            data = json.loads(payload)
            message["type"] = "DeviceStatus/Sensor"
            message["combinationId"] = data["combinationId"]
            print(message)
        
        elif topic == f"{self.device_id_list[0]}/Request/OperationModeInfo":
            message["type"] = "Mode"

        elif topic == f"{self.device_id_list[0]}/Request/Capsule/Info":
            message["type"] = "DeviceStatus/Capsule/Info"
        

        # elif topic == f"{self.device_id_list[0]}/Status/DetectionResult":
        #     # 사람 단순 감지
        #     if payload == '1':
        #         message["type"] = "DeviceStatus/Camera/SimpleDetection"
        #     # 운동 중
        #     elif payload == '2': 
        #         message["type"] = "DeviceStatus/Camera/UserAction/Exercise"
        #     # 휴식 중
        #     elif payload == '3':
        #         message["type"] = "DeviceStatus/Camera/UserAction/Focus" 

        # elif topic == f"{self.device_id_list[0]}/Status/Stink":
        #     message["type"] = "DeviceStatus/Sensor/Stink"
        # elif topic == f"{self.device_id_list[0]}/Setting":
        #     pass
        
        await self.work_queue.put(message)

    async def subscribe(self):
        if self.client is not None:
            # 캡슐 잔여량
            await self.client.subscribe(f"{self.device_id_list[0]}/Status/Remainder")

            # 자동화 모드 세부 정보
            await self.client.subscribe(f"{self.device_id_list[0]}/Request/AutoModeInfo")

            # 자동화 모드 결과에 따른 CombinationId에 대응하는 향 조합 요청
            await self.client.subscribe(f"{self.device_id_list[0]}/Request/Combination")

            # 스케줄 or 자동화 모드 요청
            await self.client.subscribe(f"{self.device_id_list[0]}/Request/OperationModeInfo")

            # 캡슐 정보 요청
            await self.client.subscribe(f"{self.device_id_list[0]}/Request/Capsule/Info")

            
            print("Complete Subscribe!")

    async def publish(self, topic, payload):
        if self.client is None:
            print("MQTT 클라이언트가 연결되지 않았습니다!")
            return
        await self.client.publish(topic, payload)
        print(f"pub! topic : {topic}, payload : {payload}")

    
# async def main():
#     queue = asyncio.Queue()
#     mqtt_client = MQTTClient("localhost", queue)
#     asyncio.create_task(mqtt_client.connect())
#     await asyncio.sleep(2)

#     # Test Code
#     test_capusle_data = {
#         "slot1" : 1,
#         "slot2" : 2,
#         "slot3" : 4,
#         "slot4" : 3,    
#     }
#     msg = json.dumps(test_capusle_data)
#     await mqtt_client.publish(f"{mqtt_client.device_id_list[0]}/CapsuleInfo", msg)

#     while True:
#         data = await queue.get()
#         print(f"Data is {data}!!\n")
#         await asyncio.sleep(1)

# asyncio.run(main())
