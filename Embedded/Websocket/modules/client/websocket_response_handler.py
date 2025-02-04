import json
import asyncio

class WebSocketResponseHandler:
    _instance = None  

    def __new__(cls, *args, **kwargs):
        """싱글톤 인스턴스를 생성 및 반환"""
        if cls._instance is None:
            cls._instance = super(WebSocketResponseHandler, cls).__new__(cls)
            cls._instance.__initialized = False  
        return cls._instance

    def __init__(self, mqtt_client):
        """초기화 (중복 실행 방지)"""
        if not self.__initialized:
            self.__initialized = True  
            self.mqtt_client = mqtt_client

            self.handlers = {
                "/topic/DeviceStatus/Sensor/TempHum/": self.hanlder_response_temphum,
                "/topic/DeviceStatus/Capsule/Info/": self.handler_capsule_initial_info,
                "/topic/Remote/Operation/" : self.handler_remote_operation,
                "default": self.default_hanlder
            }

    async def hanlder_response_temphum(self):
        pass
        print("Handling Temperature & Humidity data")

    async def handler_capsule_initial_info(self, message):
        await self.mqtt_client.publish(
            f"{self.mqtt_client.device_id_list[0]}/CapsuleInfo",
            json.dumps(message)
        )
        print("Handling Capsule Initial Info")

    async def handler_remote_operation(self):
        # TODO: 모터 제어를 위한 MQTT Pub 코드 작성
        pass
        print("Handling Remote Operation Motor")

    def default_hanlder(self):
        print("There isn't type!!")
        return 400
