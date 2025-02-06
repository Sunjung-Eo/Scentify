from camera import *
from slowfast import *
from yolo import *

import threading
import time

class AutoMode:
    def __init__(self):
        self.yolo_model = SIMPLEYOLO()
        self.camera = Camera()
        self.slowfast = SlowFast()

        self.print_log = False
        self.analyze_time = 30
        self.active_relax_mode = True
        self.active_exercise_mode = True
        self.is_person_detected = False
        self.action_count = [0, 0, 0]
        self.running = False

        self.index_to_class = ["nothing", "exercise", "relax"]
    
    def stop(self):
        print("Timer 30sec Start!")
        self.running = False
        if self.print_log:
            print("Timer 30sec End!")
        

    def run(self):
        self.action_count[0] = 0
        self.action_count[1] = 0
        self.action_count[2] = 0

        self.running = True
        timer = threading.Timer(self.analyze_time, self.stop)
        timer.start()
        
        while self.running:
            try:
                frame = self.camera.get_one_frame()
                person_detect = self.yolo_model.person_detect(frame)
                if not person_detect:
                    continue

                frames = self.camera.get_frames(self.slowfast.required_frames_num)
                ret = self.slowfast.analyze_action(frames)

                if ret.value == 1 and not self.active_exercise_mode:
                    continue
                if ret.value == 2 and not self.active_relax_mode:
                    continue

                if self.print_log:
                    print(f"Count {self.index_to_class[ret.value]}")
                self.action_count[ret.value] += 1

                time.sleep(1)
            except Exception as E:
                print(f"Error Occur : {E}")

        # 가장 많이 카운팅 된 카테고리 찾기
        max_index = self.action_count.index(max(self.action_count))

        return self.index_to_class[max_index]
        

if __name__ == '__main__':
    automode = AutoMode()
    # automode.print_log = True
    # automode.slowfast.print_log = True
    while True:
        print(automode.run())
        time.sleep(2)