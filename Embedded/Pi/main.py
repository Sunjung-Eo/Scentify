import os, sys
import asyncio
from mqtt_client import *

current_dir = os.path.dirname(__file__)  # 현재 파일의 디렉토리
parent_dir = os.path.abspath(os.path.join(current_dir, ".."))  # 상위 디렉토리

os.chdir(parent_dir)
sys.path.append(os.path.abspath("Websocket/modules/client"))

from websocket_client import *
from websocket_request_handler import *
from websocket_response_handler import *

class SmartHub():
    def __init__(self, websocket_url, mqtt_url, serial_number, work_queue):
        self.websocket_client = WebSocketClient(
            uri=websocket_url,
            serial_number=serial_number,
            work_queue=work_queue
        )

        self.mqtt_client = MQTTClient(url="localhost", work_queue=work_queue)


async def main():
    device_serial=get_serial_number()
    websocket_url=get_websocket_url()
    mqtt_url=get_mqtt_url()

    print(device_serial, websocket_url, mqtt_url)

asyncio.run(main()) 
