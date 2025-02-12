import json
import asyncio
from datetime import datetime, time
from mqtt_client import *

class WebSocketResponseHandler:
    _instance = None  

    def __new__(cls, *args, **kwargs):
        """싱글톤 인스턴스를 생성 및 반환"""
        if cls._instance is None:
            cls._instance = super(WebSocketResponseHandler, cls).__new__(cls)
            cls._instance.__initialized = False  
        return cls._instance

    def __init__(self, mqtt_client):
        """초기화 (중복 실행 방지)"""
        if not self.__initialized:
            self.__initialized = True  
            self.mqtt_client = mqtt_client
            self.print_log = False
            self.operation_mode = -1

            self.handlers = {
                # 캡슐 관련
                "/topic/DeviceStatus/Capsule/Info/": self.handler_capsule_initial_info,

                # 분사 관련
                "/topic/Remote/Operation/" : self.handler_remote_operation,
                # 이거 상황 보고 handler 나눠야 할 수도 있음.
                "/topic/Auto/Operation/" : self.handler_auto_operation,

                # 모드 관리
                "/topic/Combination/Change/" : self.handler_automode_change,
                "/topic/Interval/Change/" : self.handler_automode_change,
                "/topic/Auto/Mode/Change/" : self.handler_automode_change,
                "/topic/Mode/" : self.handler_set_operation_mode,
                "/topic/Mode/Change/" : self.handler_set_operation_mode,

                # 스케줄 관리
                "/topic/Auto/Schedule/Initial/" : self.handler_automode_init,
                "/topic/Schedule/Initial/" : self.handler_schedule_init,
                "/topic/Schedule/Change/" : self.handler_schedule_change,
                "/topic/Schedule/Delete/" : self.handler_schedule_delete,
                "/topic/Schedule/Add/" : self.handler_schedule_add,
                
                # 디폴트
                "default": self.default_hanlder
            }

            self.schedules = dict()
            self.schedule_running = False

    async def handler_capsule_initial_info(self, message):
        await self.mqtt_client.publish(
            f"{self.mqtt_client.device_id_list[0]}/CapsuleInfo",
            message
        )
        if self.print_log:
            print("Handling Capsule Initial Info")

    async def handler_remote_operation(self, message):
        await self.mqtt_client.publish(
            f"{self.mqtt_client.device_id_list[0]}/Operation",
            message
        )
        if self.print_log:
            print("Handling Remote Operation Motor")

    async def handler_auto_operation(self, message):
        payload = json.loads(message)
        combination = payload["combination"]

        print("handler combination : ", combination)
        
        payload = json.dumps(combination)

        print("handler combination payload : ", payload)
        await self.mqtt_client.publish(
            f"{self.mqtt_client.device_id_list[0]}/Operation",
            payload
        )
        if self.print_log:
            print("Handling Remote Operation Motor")

    async def handler_automode_init(self, message):
        await self.mqtt_client.publish(
            f"{self.mqtt_client.device_id_list[0]}/AutoModeInit",
            message
        )
        if self.print_log:
            print("Handling Auto Mode Init")

    async def handler_automode_change(self, message):
        await self.mqtt_client.publish(
            f"{self.mqtt_client.device_id_list[0]}/AutoModeChange",
            message
        )
        if self.print_log:
            print("Handling Auto Mode Change ")

    async def handler_set_operation_mode(self, message):
        # TODO
        # Backend에서 Operation Mode 수신 안되는 문제 체크

        msg = json.loads(message)
        if self.operation_mode == msg['mode']:
            return

        self.operation_mode = msg['mode']

        if int(self.operation_mode) == 0:
            asyncio.create_task(self.handler_schedule())
            queue_msg = dict()
            queue_msg["type"] = "Schedule/Initial"
            self.schedule_running = True
            await self.mqtt_client.work_queue.put(queue_msg)

        else:
            self.schedules = dict()
            self.schedule_running = False
        
        await self.mqtt_client.publish(
            f"{self.mqtt_client.device_id_list[0]}/SetOperationMode",
            message
        )
        if self.print_log:
            print("Handling Set Operation Mode")


    async def handler_schedule_init(self, message): 
        payload = json.loads(message)
        list_schedules = payload["schedules"]
        self.schedules = dict()
        for value in list_schedules:
            value["startTime"] = datetime.strptime(value["startTime"], "%H:%M:%S").time()
            value["endTime"] = datetime.strptime(value["endTime"], "%H:%M:%S").time()
            value["is_running"] = False
            self.schedules[value["id"]] = value
        
        if self.print_log:
            print("Handling Schedule Initial Operation")

    async def handler_schedule_change(self, message):
        payload = json.loads(message)
        schedule = payload["schedule"]
        if schedule["id"] not in self.schedules:
            print("Schedule Change Error! -- Not Exist ID")
            return

        schedule["startTime"] = datetime.strptime(schedule["startTime"], "%H:%M:%S").time()
        schedule["endTime"] = datetime.strptime(schedule["endTime"], "%H:%M:%S").time()
        schedule["is_running"] = self.schedules[schedule["id"]]["is_running"]
        self.schedules[schedule["id"]] = schedule

    async def handler_schedule_delete(self, message):
        payload = json.loads(message)
        schedule_id = payload["scheduleId"]

        if schedule_id in self.schedules:
            del self.schedules[schedule_id]
        else:
            print("Schedule Delete Error! -- Not Exist ID")

    async def handler_schedule_add(self, message): 
        payload = json.loads(message)
        schedule = payload["schedules"]
        
        schedule["startTime"] = datetime.strptime(schedule["startTime"], "%H:%M:%S").time()
        schedule["endTime"] = datetime.strptime(schedule["endTime"], "%H:%M:%S").time()
        schedule["is_running"] = False
        self.schedules[schedule["id"]] = schedule
        
        if self.print_log:
            print("Handling Schedule Initial Operation")

    async def schedule_operation_loop(self, schedule_id):
        if schedule_id not in self.schedules or not self.schedules[schedule_id]["modeOn"]:
            return

        # 동작 모드일 때에만 수행
        while True:
            # 스케줄이 삭제되면 break
            if schedule_id not in self.schedules:
                break

            if not self.schedules[schedule_id]["modeOn"]:
                break

            now = datetime.now().strftime("%H:%M:%S")
            now_time = datetime.strptime(now, "%H:%M:%S").time()

            print(self.schedules[schedule_id]["startTime"], now_time, self.schedules[schedule_id]["endTime"])

            # 수행 시간이 끝나면 break
            if now_time > self.schedules[schedule_id]["endTime"] or now_time < self.schedules[schedule_id]["startTime"]:
                break

            print(f"{schedule_id} Operation from Schedule!!")
            json_combination = json.dumps(self.schedules[schedule_id]["combination"])
            # combination에 해당하는 조합 분사
            await self.handler_remote_operation(json_combination)
            self.schedules[schedule_id]["is_running"] = True
            await asyncio.sleep(60 * self.schedules[schedule_id]["interval"])

        print(f"{schedule_id} Operation Finish!")

        if schedule_id in self.schedules:
            self.schedules[schedule_id]["is_running"] = False

    async def handler_schedule(self):
        self.schedule_running = True
        while not self.operation_mode:
            now = datetime.now().strftime("%H:%M:%S")
            now_time = datetime.strptime(now, "%H:%M:%S").time()

            print(now_time)

            for (key, value) in self.schedules.items():
                if value["startTime"] < now_time and value["endTime"] > now_time and not value["is_running"]:
                    asyncio.create_task(self.schedule_operation_loop(key))

            await asyncio.sleep(10)
        self.schedule_running = False
            

    async def default_hanlder(self):
        print("There isn't type!!")
        return 400


# async def main():
#     work_queue = asyncio.Queue()
#     mqtt_client = MQTTClient(url="192.168.137.127", work_queue=work_queue)
#     asyncio.create_task(mqtt_client.connect())
#     await asyncio.sleep(2)

#     handler = WebSocketResponseHandler(mqtt_client=mqtt_client)
#     capsule_data = {
#             "slot1" : 4,
#             "slot2" : 2,
#             "slot3" : 5,
#             "slot4" : 3,
#     }

#     json_capsule_msg = json.dumps(capsule_data)
#     await handler.handler_capsule_initial_info(json_capsule_msg)

#     schedule_data = {
#         "schedules": [
#             {
#                 "id": "1",
#                 "deviceId": "A1",
#                 "combination": {
#                     "choice1": 1, "choice1Count": 3,
#                     "choice2": 2, "choice2Count": 2,
#                     "choice3": None, "choice3Count": None,
#                     "choice4": None, "choice4Count": None
#                 },
#                 "startTime": "18:00:00",
#                 "endTime": "18:30:00",
#                 "interval": 15,
#                 "modeOn": True
#             },
#             {
#                 "id": "2",
#                 "deviceId": "B2",
#                 "combination": {
#                     "choice1": 2, "choice1Count": 2,
#                     "choice2": 1, "choice2Count": 3,
#                     "choice3": None, "choice3Count": None,
#                     "choice4": None, "choice4Count": None
#                 },
#                 "startTime": "17:13:00",
#                 "endTime": "18:20:40",
#                 "interval": 0.3,
#                 "modeOn": True
#             },
#             {
#                 "id": "3",
#                 "deviceId": "C3",
#                 "combination": {
#                     "choice1": 2, "choice1Count": 5,
#                     "choice2": 5, "choice2Count": 2,
#                     "choice3": 4, "choice3Count": 5,
#                     "choice4": 3, "choice4Count": 4
#                 },
#                 "startTime": "17:02:10",
#                 "endTime": "17:03:00",
#                 "interval": 0.1,
#                 "modeOn": True
#             }
#         ]
#     }

#     json_msg = json.dumps(schedule_data)
#     handler.handler_schedule_init(json_msg)

#     mode_msg = {
#         "mode" : 0,
#     }
#     json_mode_msg = json.dumps(mode_msg)
#     asyncio.create_task(handler.handler_set_operation_mode(json_mode_msg))

#     await asyncio.sleep(20)
#     print("request add")

#     add_schedule_msg = {
#         "schedules" : [
#             {
#                 "id": "3",
#                 "deviceId": "C3",
#                 "combination": {
#                     "choice1": 2, "choice1Count": 5,
#                     "choice2": 5, "choice2Count": 2,
#                     "choice3": 4, "choice3Count": 5,
#                     "choice4": 3, "choice4Count": 4
#                 },
#                 "startTime": "17:02:10",
#                 "endTime": "17:50:00",
#                 "interval": 0.1,
#                 "modeOn": True
#             }
#         ]
#     }
#     json_add_schedule_msg = json.dumps(add_schedule_msg)
#     asyncio.create_task(handler.handler_schedule_add(json_add_schedule_msg))
    

#     # print(handler.schedules)
#     while True:
#         await asyncio.sleep(2)
