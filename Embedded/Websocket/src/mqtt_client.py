import asyncio
from aiomqtt import Client, MqttError
import yaml
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
                    await asyncio.Future()  # 연결 유지
            except MqttError as e:
                logger.error(f"Failed to connect to MQTT broker: {e}")
                # await asyncio.sleep(self.reconnect_delay)  # 재시도 대기