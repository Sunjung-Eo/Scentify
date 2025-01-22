import asyncio
import websockets
import yaml
import json
import logging
from .auth import AuthManager
from .mqtt_client import AsyncMQTTClient

logger = logging.getLogger(__name__)

class WebSocketServer:
    def __init__(self, config_path: str = 'config/config.yaml'):
        # YAML 설정 읽기
        with open(config_path, 'r', encoding='utf-8') as file:
            config = yaml.safe_load(file)
            self.host = config['websocket']['host']
            self.port = config['websocket']['port']
        self.auth_manager = AuthManager()
        self.mqtt_client = AsyncMQTTClient(config_path)
        self.websocket = None


    # WebSocket 연결 처리 로직
    async def handle_websocket(self, websocket, path):
        # 헤더에서 token 추출
        auth_header = websocket.request_headers.get("Authorization", "").replace("Bearer ", "", 1).strip()
        # 인증 실패 시 연결 종료
        if not auth_header or not self.auth_manager.verify_handshake(auth_header, self.auth_manager.DEVICE_SERIAL):
            await websocket.close(code=403)
            return

        # 인증 성공 시 메시지 핸들링
        self.websocket = websocket
        try:
            while True:
                # WebSocket에서 받은 메시지 처리리
                message = await websocket.recv()
                message_data = json.loads(message)
                await self.handle_message(message_data)
                # print(f"Received message: {message}")
                # # 클라이언트에게 응답 보내기 (예: "Hello")
                # await websocket.send("Hello from server")
        except websockets.exceptions.ConnectionClosed:
            logger.error("WebSocket connection closed.")
            
            # WebSocket 연결 끊어졌을 때 재연결 시도
            # logger.info(f"Reconnecting to WebSocket in {retry_delay} seconds...")
            # await asyncio.sleep(retry_delay)
            # retry_delay = min(retry_delay * 2, 60)  # 지수 백오프 (최대 60초)
            # await self.reconnect_websocket()  # 재연결 시도

    # 메시지 type에 따른 분기
    async def handle_message(self, message_data):
        message_type = message_data.get('type')
        # type == "A"라 했을 때 특정 로직 실행
        # if message_type == "A":
                # 만약 보낼 메시지 수정이 필요할 경우
                # modified_message = {
                #     "status" : 200,
                #     "type" : "A"
                #     ...
                # }
                # modified_message(메세지 수정정)  / message_data(그대로 전달달)
        
            # # 1. 웹소켓 -> 웹서버 처리
            # try:
            #     if self.websocket and self.websocket.open:
            #         await self.websocket.send(json.dumps(modified_message))
            #     else:
            #         print("WebSocket is not connected.")
            # except Exception as e:
            #     print(f"Error sending WebSocket message: {e}")
            # # 2. 웹소켓 -> mqtt 처리
            # try:
            #     await self.mqtt_client.publish(json.dumps(modified_message))
            # except Exception as e:
            #     print(f"Error sending MQTT message: {e}")
    

    async def start(self):
        # WebSocket 서버 실행
        server = await websockets.serve(
            self.handle_websocket,
            self.host,
            self.port
        )

        mqtt_task = asyncio.create_task(self.mqtt_client.connect())
        await asyncio.gather(server.wait_closed(), mqtt_task)

        
