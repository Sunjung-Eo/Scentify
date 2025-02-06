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

    asyncio.create_task(smart_hub.websocket_client.connection())

    await asyncio.sleep(2)

    dummy_data = dict()
    dummy_data = {
        "mode" : 0,    
    }
    json_data = json.dumps(dummy_data)
    await smart_hub.mqtt_client.publish(
        f"{smart_hub.mqtt_client.device_id_list[0]}/SetOperationMode", json_data
    )

    await asyncio.sleep(2)

    dummy_data = dict()
    dummy_data = {
        "mode" : 1,    
    }
    json_data = json.dumps(dummy_data)
    await smart_hub.mqtt_client.publish(
        f"{smart_hub.mqtt_client.device_id_list[0]}/SetOperationMode", json_data
    )

    # dummy_data = {
    #     "id" : 12,
    #     "combinationId" : 100,    
    # }

    # json_data = json.dumps(dummy_data)
    # await smart_hub.mqtt_client.publish(
    #     f"{smart_hub.mqtt_client.device_id_list[0]}/AutoModeChange", json_data
    # )

    # dummy_data = {
    #     "id" : 12,
    #     "interval" : 100,    
    # }

    # json_data = json.dumps(dummy_data)
    # await smart_hub.mqtt_client.publish(
    #     f"{smart_hub.mqtt_client.device_id_list[0]}/AutoModeChange", json_data
    # )

    # dummy_data = {
    #     "id" : 12,
    #     "modeOn" :1,    
    # }

    # json_data = json.dumps(dummy_data)
    # await smart_hub.mqtt_client.publish(
    #     f"{smart_hub.mqtt_client.device_id_list[0]}/AutoModeChange", json_data
    # )



    while True:
        await asyncio.sleep(1)

asyncio.run(main()) 
