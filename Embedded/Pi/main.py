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
        self.mqtt_client = MQTTClient(url=mqtt_url, work_queue=work_queue)
        self.websocket_response_handler = WebSocketResponseHandler(mqtt_client=self.mqtt_client).handlers
        self.websocket_client = WebSocketClient(
            uri=websocket_url,
            serial_number=serial_number,
            work_queue=work_queue,
            request_handler=None,
            response_handler=self.websocket_response_handler
        )


async def main():
    queue =asyncio.Queue()
    device_serial=get_serial_number()
    websocket_url=get_websocket_url()
    mqtt_url=get_mqtt_url()

    smart_hub = SmartHub(
        websocket_url=websocket_url,
        mqtt_url=mqtt_url,
        serial_number=device_serial,
        work_queue=queue
    )

    asyncio.create_task(smart_hub.mqtt_client.connect())
    await asyncio.sleep(2)
    # asyncio.create_task(smart_hub.websocket_client.connection())

    json_msg = json.dumps(msg)
    await smart_hub.mqtt_client.publish(f"{smart_hub.mqtt_client.device_id_list[0]}/AutoModeInit", json_msg)

    while True:
        await asyncio.sleep(1)

asyncio.run(main()) 
