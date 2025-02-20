import cv2
import asyncio

# 카메라는 하나만 쓸 것이기 때문에 싱글턴으로 구현
class Camera:
    _instance = None
    
    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance.cap = cv2.VideoCapture(0)
            cls._instance.cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)
            cls._instance.lock = asyncio.Lock()
        print("Load Camera Module")
        return cls._instance
    
    async def get_one_frame(self):
        if self.cap.isOpened():
            async with self.lock:
                for _ in range(3):  # 최신 프레임을 위해 여러 번 grab()
                    self.cap.grab()
                success, frame = self.cap.read()
            if success:
                return frame
            else:
                raise RuntimeError("Can not Get Camera Frame")
            
    async def get_frames(self, num_frame):
        frames = []
        while len(frames) < num_frame:
            frames.append(await self.get_one_frame())
        return frames
        
    def change_cvtColor(self, frame):
        return cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    
    def __del__(self):
        if self.cap.isOpened():
            self.cap.release()
        cv2.destroyAllWindows()