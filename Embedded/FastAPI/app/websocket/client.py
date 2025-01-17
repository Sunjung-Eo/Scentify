# import websockets
# import asyncio
# import json

# class WebSocketClient:
#     def __init__(self):
#         self.uri = "ws://백엔드주소:8080/ws/device"
#         self.headers = {
#             "Host": "백엔드주소:8080",
#             "Upgrade": "websocket",
#             "Connection": "Upgrade",
#             "Sec-WebSocket-Version": "13",
#             "Authorization": "Bearer <serial token SHA-256>"
#         }

#     async def connect(self):
#         try:
#             async with websockets.connect(
#                 self.uri,
#                 extra_headers=self.headers
#             ) as websocket:
#                 print("Connected to WebSocket server")
#                 while True:
#                     response = await websocket.recv()
#                     print(f"Received message: {response}")
                    
#         except Exception as e:
#             print(f"Connection failed: {str(e)}")

#     async def send_message(self, websocket, message):
#         try:
#             await websocket.send(json.dumps(message))
#             print(f"Sent message: {message}")
#         except Exception as e:
#             print(f"Failed to send message: {str(e)}")

# async def main():
#     client = WebSocketClient()
#     await client.connect()

# if __name__ == "__main__":
#     asyncio.run(main())
