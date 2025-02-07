import json
import asyncio

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
                "/topic/Auto/Schedule/Initial/" : self.handler_request_mode_info,
                "/topic/Schedule/Initial/" : self.handler_schedule_init,
                
                # 디폴트
                "default": self.default_hanlder
            }

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
        
        payload = json.dumps(combination)
        await self.mqtt_client.publish(
            f"{self.mqtt_client.device_id_list[0]}/Operation",
            combination
        )
        if self.print_log:
            print("Handling Remote Operation Motor")

    async def handler_request_mode_info(self, message):
        await self.mqtt_client.publish(
            f"{self.mqtt_client.device_id_list[0]}/AutoModeInit",
            message
        )
        if self.print_log:
            print("Handling Request Mode Info")

    async def handler_automode_change(self, message):
        await self.mqtt_client.publish(
            f"{self.mqtt_client.device_id_list[0]}/AutoModeChange",
            message
        )

    async def handler_set_operation_mode(self, message):
        await self.mqtt_client.publish(
            f"{self.mqtt_client.device_id_list[0]}/SetOperationMode",
            message
        )

    async def handler_schedule_init(self, message):
        print("Handling Schedule Init")
        pass

    def default_hanlder(self):
        print("There isn't type!!")
        return 400
