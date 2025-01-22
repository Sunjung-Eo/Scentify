import asyncio
from aiomqtt import Client, MqttError
import yaml
import json
import logging

logger = logging.getLogger(__name__)

class AsyncMQTTClient:
    def __init__(self, config_path: str = 'config/config.yaml'):
        with open(config_path, 'r', encoding='utf-8') as file:
            config = yaml.safe_load(file)
            self.broker = config['mqtt']['broker']
            self.port = config['mqtt']['port']
        self.client = None
    # MQTT 브로커 연결
    async def connect(self):
        while True:
            try:
                self.client = Client(self.broker, self.port)
                async with self.client:
                    logger.info(f"Connected to MQTT Broker: {self.broker}:{self.port}")

                    # MQTT 메시지 수신
                    async for message in self.client.messages:
                        await self.handle_mqtt_message(message)
                    
                    await asyncio.Future()  # 연결 유지

            except MqttError as e:
                logger.error(f"Failed to connect to MQTT broker: {e}")
                await asyncio.sleep(5)  # 5초 후 재연결 시도
    
    # MQTT로부터 수신한 메시지 변환 후 WebSocket으로 전달
    async def handle_mqtt_message(self, message):
        try:
            message_data = json.loads(message.payload)
            message_type = message_data.get("type")
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

        except Exception as e:
            logger.error(f"Error handling MQTT message: {e}")