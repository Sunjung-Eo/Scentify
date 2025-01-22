import asyncio
import websockets
import hashlib
import base64

# 연결 테스트 코드
async def test_websocket_connection():
    # uri = "ws://localhost:8765/v1/ws/device"  # 서버의 주소와 포트로 수정
    uri = "ws://0.0.0.0:8765"

    # 인증을 위한 시리얼 넘버 해싱 (SHA-256)
    serial_number = "f5tH8jW9qA2D1Z7n"  # 실제 시리얼 넘버로 변경
    token = hashlib.sha256(serial_number.encode()).hexdigest()

    headers = {
        "Authorization": f"Bearer {token}"
    }

    async with websockets.connect(uri, extra_headers=headers) as websocket:
        print("웹소켓 연결 성공!")
        while True:
            response = await websocket.recv()
            print(f"서버로부터 받은 메시지: {response}")

# 비동기 이벤트 루프 실행
asyncio.run(test_websocket_connection())
