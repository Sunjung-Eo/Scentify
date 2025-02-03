import sys
from websocket_client import *

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from utils import*

class WebSocketRequestHandler:
    _instance = None  
    def __new__(cls, *args, **kwargs):
        """싱글톤 인스턴스를 생성 및 반환"""
        if cls._instance is None:
            cls._instance = super(WebSocketRequestHandler, cls).__new__(cls)
            cls._instance.__initialized = False  
        return cls._instance

    def __init__(self, work_queue):
        """초기화 (중복 실행 방지)"""
        if not self.__initialized:
            self.__initialized = True  
            self.message_queue = work_queue

    async def send_temp_hum(self):
        print("Send Temperature & Humidity data")
        temp, hum = get_temp_and_hum()
        ret_msg = {
            "topic" : "/app/DeviceStatus/Sensor/TempHum",
            "payload": {
                "temperature" : temp,
                "humidity" : hum,
            },
        }

        await self.message_queue.put(ret_msg)
        