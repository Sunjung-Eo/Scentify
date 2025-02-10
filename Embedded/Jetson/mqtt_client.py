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
    
    def __init__(self, url, process_message):
        """초기화 (중복 실행 방지)"""
        if not self.__initialized:
            self.__initialized = True  
            self.__url = url
            self.device_id = 1
            self.client = None
            self.process_message = process_message

    async def connect(self):
        async with aiomqtt.Client(self.__url) as client:
            self.client = client
            await self.subscribe()

            asyncio.create_task(self.listen_message())
            asyncio.create_task(self.initial_request())
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

    async def subscribe(self):
        if self.client is not None:
            await self.client.subscribe(f"{self.device_id}/Operation")
            await self.client.subscribe(f"{self.device_id}/SetOperationMode")
            await self.client.subscribe(f"{self.device_id}/CapsuleInfo")
            await self.client.subscribe(f"{self.device_id}/AutoModeInit")
            await self.client.subscribe(f"{self.device_id}/AutoModeChange")
            print("Complete Subscribe!")

    async def publish(self, topic, payload):
        if self.client is None:
            print("MQTT 클라이언트가 연결되지 않았습니다!")
            return
        await self.client.publish(topic, payload)
        print(f"pub! topic : {topic}, payload : {payload}")

    async def initial_request(self):
        await self.client.publish(f"{self.device_id}/Request/AutoModeInfo", "0")
        await self.client.publish(f"{self.device_id}/Request/OperationModeInfo", "0")
        await self.client.publish(f"{self.device_id}/Request/Capsule/Info", "0")

    
# async def main():
#     mqtt_client = MQTTClient("192.168.137.127")
#     asyncio.create_task(mqtt_client.connect())
#     while True:
#         await asyncio.sleep(1)

# asyncio.run(main())