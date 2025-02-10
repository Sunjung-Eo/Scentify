import json
import asyncio
from datetime import datetime, time

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
            self.operation_mode = 0

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
                
                # 디폴트
                "default": self.default_hanlder
            }

            self.schedules = dict()

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
        msg = json.loads(message)
        self.opeation_mode = msg["mode"]

        if self.operation_mode == 0:
            asyncio.create_task(self.handler_schedule())
        elif self.operation_mode:
            self.schedules = dict()
        
        await self.mqtt_client.publish(
            f"{self.mqtt_client.device_id_list[0]}/SetOperationMode",
            message
        )
        if self.print_log:
            print("Handling Set Operation Mode")

    def handler_schedule_init(self, message): 
        payload = json.loads(message)
        list_schedules = payload["schedules"]
        for value in list_schedules:
            value["startTime"] = datetime.strptime(value["startTime"], "%H:%M:%S").time()
            value["endTime"] = datetime.strptime(value["endTime"], "%H:%M:%S").time()
            self.schedules[value["id"]] = value
        
        if self.print_log:
            print("Handling Schedule Initial Operation")

    def handler_schedule_change(self, message):
        payload = json.loads(message)
        schedule = payload["schedule"]
        schedule["startTime"] = datetime.strptime(schedule["startTime"], "%H:%M:%S").time()
        schedule["endTime"] = datetime.strptime(schedule["endTime"], "%H:%M:%S").time()
        self.schedules[schedule["id"]] = schedule

    def handler_schedule_delete(self, message):
        payload = json.loads(message)
        schedule_id = payload["scheduleId"]

        if schedule_id in self.schedules:
            del self.schedules[schedule_id]

    async def schedule_operation_loop(self, schedule_id):
        if schedule_id not in self.schedules:
            return

        # 동작 모드일 때에만 수행
        while self.schedules[schedule_id]["modeOn"]:
            now = datetime.now().strftime("%H:%M:%S")
            # 수행 시간이 끝나면 break
            if now > self.schedules[schedule_id]["endTime"] or now < self.schedules[schedule_id]["startTime"]:
                break

            # 스케줄이 삭제되면 break
            if schedule_id not in self.schedules:
                break

            # combination에 해당하는 조합 분사
            self.handler_remote_operation(self.schedules[schedule_id]["combination"])
            await asyncio.sleep(60 * self.schedules[schedule_id]["interval"])

    async def handler_schedule(self):
        while not self.operation_mode:
            now = datetime.now().strftime("%H:%M:%S")

            for (key, value) in self.schedules.items():
                if value["startTime"] > now and value["endTime"] < now:
                    asyncio.create_task(self.schedule_operation_loop(key))

            await asyncio.sleep(10)
            

    def default_hanlder(self):
        print("There isn't type!!")
        return 400

