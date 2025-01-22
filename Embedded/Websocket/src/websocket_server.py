import asyncio
import websockets
import yaml
from .auth import AuthManager

class WebSocketServer:
    def __init__(self, config_path: str = 'config/config.yaml'):
        # YAML 설정 읽기
        with open(config_path, 'r') as file:
            config = yaml.safe_load(file)
            self.host = config['websocket']['host']
            self.port = config['websocket']['port']
        self.auth_manager = AuthManager()
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
                message = await websocket.recv()  # 클라이언트에서 메시지 수신
                print(f"Received message: {message}")
                # 클라이언트에게 응답 보내기 (예: "Hello")
                await websocket.send("Hello from server")
        except websockets.exceptions.ConnectionClosed:
            print("Connection closed")
        # # MQTT 클라이언트
        # self.mqtt_client = AsyncMQTTClient(config_path)
        # self.active_connections: Set[websockets.WebSocketServerProtocol] = set()  # WebSocket 클라이언트 목록

    # WebSocket 서버 실행
    async def start(self):
        server = await websockets.serve(
            self.handle_websocket,
            self.host,
            self.port
            )
        # 비동기 작업 실행 및 관리
        await asyncio.gather(
            await server.wait_closed()  # 웹소켓 계속 연결
        )