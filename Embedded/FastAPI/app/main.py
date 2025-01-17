from fastapi import FastAPI, WebSocket, HTTPException
from websocket.connection_manager import ConnectionManager
from mqtt.client import mqtt_client # MQTT에서 fastapi로 연결 시도하면 자동으로 연결

# 앱 인스턴스 생성
app = FastAPI()

# 웹소켓 연결 관리
manager = ConnectionManager()

# 웹소켓 엔드포인트 정의
@app.websocket("/ws/device")
async def websocket_endpoint(websocket: WebSocket):
    try:
        # 인증
        headers = websocket.headers
        auth_header = headers.get("Authorization")
        
        # 실패 시 연결 종료
        if not auth_header or not auth_header.startswith("Bearer "):
            # await websocket.send_json({"status": 403, "message": "Forbidden"})
            await websocket.close(code=403)
            return
        
        # 성공 시 웹소켓 연결
        print("Connection Success")
        await manager.connect(websocket) 
        
        while True:
            # type을 통해 수신한 json 데이터 분류
            data = await websocket.receive_json()
            message_type = data.get("type")

            if message_type:
                pass
            #웹서버로 메세지 보내기
            # await manager.send_message(message_dict)

    #예외 처리  
    except Exception as e:
        # if manager.active_connection:
        #     await manager.active_connection.close(code=4003)
        print(f"Connection error: {str(e)}")
        