import asyncio
import websockets
import hashlib
import json
import stomper
import os, sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from stomp import *
from utils import*


class WebSocketClient:
    def __init__(self, uri, serial_number):
        # 서버의 주소와 포트로 수정
        self.__uri = uri

        # 인증을 위한 시리얼 넘버 해싱 (SHA-256)
        self.__serial_number = serial_number

        self.isConnected = False

    

    # 연결 테스트 코드
    async def test_websocket_connection(self, ):
        token = hashlib.sha256(self.__serial_number.encode()).hexdigest()

        headers = {
            "Authorization": f"Bearer {token}"
        }

        async with websockets.connect(self.__uri, extra_headers=headers) as websocket:
            self.isConnected = True

            connect_frame = get_connect_frame(self.__uri)
            print(connect_frame)
            await websocket.send(connect_frame)

            subscribe_frame = get_subscribe_frame(1, "/topic/DeviceStatus/Sensor/TempHum")
            print(subscribe_frame)
            await websocket.send(subscribe_frame)

            json_msg = json.dumps(msg)
            send_frame = stomper.send("/app/DeviceStatus/Sensor/TempHum", json_msg, content_type='application/json')
            await websocket.send(send_frame)

            asyncio.create_task(self.send_message(websocket))

            while True:
                response = await websocket.recv()
                print(f"서버로부터 받은 메시지: {response}")


    def make_message(self, dict_data):
        merge_dict = dict_data.copy()
        dict_token = {"token" : get_access_token(self.__serial_number)}
        merge_dict.update(dict_token)

        return merge_dict



if __name__ == '__main__':
    # 라즈베리파이 시리얼 넘버 파싱
    serial_number = get_serial_number()

    # 웹 소켓 객체 생성
    websocket_client = WebSocketClient("ws://70.12.246.113:8080/v1/ws/device", serial_number)
    # websocket_client = WebSocketClient("ws://0.0.0.0:8765", serial_number)

    # 비동기 이벤트 루프 실행
    asyncio.run(websocket_client.test_websocket_connection())
