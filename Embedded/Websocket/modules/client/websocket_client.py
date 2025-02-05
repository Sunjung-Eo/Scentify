import asyncio
import websockets
import hashlib
import json
import stomper
import os, sys
import ast

from pydantic import BaseModel
from websocket_response_handler import WebSocketResponseHandler
from websocket_request_handler import WebSocketRequestHandler

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from stomp import *
from utils import*

class DeviceIDDataDTO(BaseModel):
    id: int


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
                "/topic/DeviceStatus/Capsule/Info/",
                "/topic/Remote/Operation/",
                "/topic/DeviceInfo/Id/"
            ]
            self.message_queue = work_queue
            self.websocket_response_hanlder = response_handler
            self.device_id = None

    # 연결 테스트 코드
    async def connection(self, ):
        while True:
            token = get_access_token(self.__serial_number)
            
            headers = {
                "Authorization": f"Bearer {token}"
            }

            try:
                # TODO: 재 연결 시 NoneType Error 확인하기!
                print("Try Web Socket Connection..")
                async with websockets.connect(self.__uri, extra_headers=headers) as websocket:
                    print("Complete HandShaking")

                    self.websocket = websocket
                    await self.init_websocket()

                    # 초기 디바이스 serial_number <-> device_id 교환
                    await self.set_device_id()

                    await self.subcribe_websocket()

                    # websocket response handler 키 업데이트 (맨 뒤에 id 추가)
                    original_key = {}
                    for key, value in self.websocket_response_hanlder.items():
                        if key == "default":
                            original_key[key] = value
                        original_key[f'{key}{self.device_id}'] = value
                    self.websocket_response_hanlder = {}
                    self.websocket_response_hanlder = original_key

                    receive_task = asyncio.create_task(self.receive_messages())
                    send_task = asyncio.create_task(self.send_message())
                    
                    await asyncio.gather(receive_task, send_task)

            except websockets.exceptions.ConnectionClosed:
                self.websocket = None
                print("Disconnected Websocket..")
                await asyncio.sleep(3)
            
            except Exception as e:
                self.websocket = None
                print(f"Exception for Websocket Connection.. : {e}")
                await asyncio.sleep(3)

    async def set_device_id(self):
        subscribe_frame = get_subscribe_frame(0, f"/topic/DeviceInfo/Id/{self.__serial_number}")
        await self.websocket.send(subscribe_frame)

        serial_msg = json.dumps({'token' : get_access_token(self.__serial_number)})
        send_frame = stomper.send('/app/DeviceInfo/Id', serial_msg, content_type='application/json')                    
        await self.websocket.send(send_frame)      

        while True:
            res = await self.websocket.recv()
            header, body = parse_stomp_message(res)
            if len(body) <= 1:
                continue
            
            message = ast.literal_eval(body)
            if "id" in message:
                self.device_id = message["id"]

            if self.device_id == None:
                raise Exception("Can not Receive Device Id")
            break

    async def init_websocket(self):
        connect_frame = get_connect_frame(self.__uri)
        await self.websocket.send(connect_frame)

    async def subcribe_websocket(self):
        for (idx, topic) in enumerate(self.subscribe_list):
            subscribe_frame = get_subscribe_frame(idx + 1, topic + f"{self.device_id}")
            print(subscribe_frame)
            await self.websocket.send(subscribe_frame)

    async def receive_messages(self):
        while self.websocket is not None:
            try:
                message = {}
                while True:
                    res = await self.websocket.recv()
                    header, body = parse_stomp_message(res)
                    if len(body) <= 1:
                        continue

                    message = json.loads(body)
                    """
                    print(header, message)
                    {'destination': '/topic/Remote/Operation/1903711731', 'content-type': 'application/json', 'subscription': '3', 'message-id': 'da2278bd-9287-3a42-0f78-21edd7c285d6-11', 'content-length': '145'} {'id': 1296837941, 'name': None, 'choice1': 0, 'choice1Count': 3, 'choice2': 0, 'choice2Count': 0, 'choice3': 0, 'choice3Count': 0, 'choice4': 0, 'choice4Count': 0}
                    pub! topic : 1/CapsuleInfo, payload : 
                    """
                    print(header, message)
                    break

                # TODO: Header에서 Type 갖고 오는 코드 작성하기!
                # msg_type = message.get("type")
                msg_type = "/topic/DeviceStatus/Capsule/Info/1903711731"
                handler = self.websocket_response_hanlder.get(msg_type, self.websocket_response_hanlder.get("default"))
                await handler(message)

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
            send_frame = stomper.send(f'/app/{topic}', json_msg, content_type='application/json')
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
