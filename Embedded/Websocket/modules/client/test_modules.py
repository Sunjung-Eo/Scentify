from websocket_client import *
from websocket_request_handler import *
import asyncio

if __name__ == "__main__":
    work_queue = asyncio.Queue()
    serial_number = get_serial_number()

    # 웹 소켓 객체 생성
    websocket_client = WebSocketClient("ws://localhost:8765", serial_number, work_queue=work_queue)
    websocket_handler = WebSocketRequestHandler(work_queue=work_queue)

    asyncio.run(websocket_handler.send_temp_hum())

    asyncio.run(websocket_client.test_websocket_connection())