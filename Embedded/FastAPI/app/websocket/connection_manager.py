from fastapi import WebSocket
from typing import Optional

# 웹소켓 초기 연결
class ConnectionManager:
    #초기 상태
    def __init__(self):
        self.active_connection: Optional[WebSocket] = None

    # 연결 수락
    async def connect(self, websocket: WebSocket):
        # await websocket.send_json({"status": 200, "message": "OK"})
        await websocket.accept()
        self.active_connection = websocket

    # 메세지 보내기 - 주로 상태코드
    async def send_message(self, message: dict):
        if self.active_connection:
            await self.active_connection.send_json(message)