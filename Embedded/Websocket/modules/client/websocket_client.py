import asyncio
import websockets
import hashlib
import json
import stomper
import os, sys

from websocket_response_handler import WebSocketResponseHandler
from websocket_request_handler import WebSocketRequestHandler

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from stomp import *
from utils import*


class WebSocketClient:
    _instance = None  

    def __new__(cls, *args, **kwargs):
        """싱글톤 인스턴스를 생성 및 반환"""
        if cls._instance is None:
            cls._instance = super(WebSocketClient, cls).__new__(cls)
            cls._instance.__initialized = False  
        return cls._instance
    
    def __init__(self, uri, serial_number, work_queue, request_handler, response_handler):
        """초기화 (중복 실행 방지)"""
        if not self.__initialized:
            self.__initialized = True  

            # 서버의 주소와 포트로 수정
            self.__uri = uri
            # 인증을 위한 시리얼 넘버 해싱 (SHA-256)
            self.__serial_number = serial_number

            self.websocket = None
            self.subscribe_list = [
                "/topic/DeviceStatus/Sensor/TempHum/",
                "/topic/DeviceStatus/Capsule/Info/"
            ]
            self.message_queue = work_queue
            self.websocket_response_hanlder = response_handler
            self.device_id = None

    # 연결 테스트 코드
    async def connection(self, ):
        token = hashlib.sha256(self.__serial_number.encode()).hexdigest()

        headers = {
            "Authorization": f"Bearer {token}"
        }
        try:
            async with websockets.connect(self.__uri, extra_headers=headers) as websocket:
                response_header = websocket.response_headers  
                self.device_id = response_header.get("Sec-WebSocket-Protocol")

                self.websocket = websocket
                await self.init_websocket()

                receive_task = asyncio.create_task(self.receive_messages())
                send_task = asyncio.create_task(self.send_message())
                
                await asyncio.gather(receive_task, send_task)

        except websockets.exceptions.ConnectionClosed:
            self.websocket = None
            print("Disconnected Websocket..")
            await asyncio.sleep(5)

        except Exception as e:
            self.websocket = None
            print(f"Exception for Websocket Connection.. : {e}")
            await asyncio.sleep(5)

    async def init_websocket(self):
        connect_frame = get_connect_frame(self.__uri)
        await self.websocket.send(connect_frame)

        for (idx, topic) in enumerate(self.subscribe_list):
            subscribe_frame = get_subscribe_frame(idx + 1, topic + f"{self.device_id}")
            await self.websocket.send(subscribe_frame)

    async def receive_messages(self):
        while self.websocket is not None:
            try:
                req = await self.websocket.recv()
                message = json.loads(req)
                msg_type = message.get("type")

                handler = self.websocket_response_hanlder.get(msg_type, self.websocket_response_hanlder.get("default"))
                await handler(message)
                # res = await handler(message)
                
                # await self.message_queue.put(res)
                # await asyncio.sleep(0.5)

            except websockets.exceptions.ConnectionClosed:
                self.websocket = None

    async def send_message(self):
        while self.websocket is not None:
            if self.message_queue.empty():
                await asyncio.sleep(0.5)
                continue

            # message는 항상 type과 payload 키를 가지는 딕셔너리 형태!
            message = await self.message_queue.get()
            topic = message['type']
            del message['type']
            payload = message

            message = self.make_message(dict_data=payload)
            
            json_msg = json.dumps(message)
            send_frame = stomper.send(topic, json_msg, content_type='application/json')
            print(send_frame)
            await self.websocket.send(send_frame)       
        

    def make_message(self, dict_data):
        merge_dict = dict_data.copy()
        dict_token = {'token' : get_access_token(self.device_id)}
        merge_dict.update(dict_token)
        return merge_dict



# if __name__ == '__main__':
#     # 라즈베리파이 시리얼 넘버 파싱
#     serial_number = get_serial_number()

#     # 웹 소켓 객체 생성
#     # websocket_client = WebSocketClient("ws://70.12.246.113:8080/v1/ws/device", serial_number)
#     websocket_client = WebSocketClient("ws://localhost:8765", serial_number)

#     # 비동기 이벤트 루프 실행
#     asyncio.run(websocket_client.test_websocket_connection())
