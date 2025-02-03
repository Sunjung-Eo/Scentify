class WebSocketHandler:
    _instance = None  

    def __new__(cls, *args, **kwargs):
        """싱글톤 인스턴스를 생성 및 반환"""
        if cls._instance is None:
            cls._instance = super(WebSocketHandler, cls).__new__(cls)
            cls._instance.__initialized = False  
        return cls._instance

    def __init__(self):
        """초기화 (중복 실행 방지)"""
        if not self.__initialized:
            self.__initialized = True  

            self.handlers = {
                "/topic/DeviceStatus/Sensor/TempHum": self.hanlder_response_temphum,
                "/topic/DeviceStatus/Capsule/Info": self.handler_capsule_initial_info,
                "default": self.default_hanlder
            }

    def hanlder_response_temphum(self):
        print("Handling Temperature & Humidity data")

    def handler_capsule_initial_info(self):
        print("Handling Capsule Initial Info")

    def default_hanlder(self):
        print("There isn't type!!")
        return 400
