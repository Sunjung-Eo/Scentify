import asyncio
import websockets
import hashlib
import subprocess
import base64

class WebSocketClient:
    def __init__(self, uri, serial_number):
        # 서버의 주소와 포트로 수정
        # self.uri = "ws://0.0.0.0:8765"
        self.__uri = uri

        # 인증을 위한 시리얼 넘버 해싱 (SHA-256)
        # self.serial_number = "f5tH8jW9qA2D1Z7n"
        self.__serial_number = serial_number

    # 연결 테스트 코드
    async def test_websocket_connection(self, ):
        
        token = hashlib.sha256(self.__serial_number.encode()).hexdigest()

        headers = {
            "Authorization": f"Bearer {token}"
        }

        async with websockets.connect(self.__uri, extra_headers=headers) as websocket:
            print("웹소켓 연결 성공!")
            while True:
                response = await websocket.recv()
                print(f"서버로부터 받은 메시지: {response}")


if __name__ == '__main__':
    # 라즈베리파이 시리얼 넘버 파싱
    serial_number = subprocess.run(
        "cat /proc/cpuinfo | grep Serial | awk '{print $3}'",
        shell=True,
        capture_output=True,
        text=True
    ).stdout.strip()

    # 웹 소켓 객체 생성
    websocket_client = WebSocketClient("ws://0.0.0.0:8765", serial_number)

    # 비동기 이벤트 루프 실행
    asyncio.run(websocket_client.test_websocket_connection())
