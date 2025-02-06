from camera import Camera
from yolo import SIMPLEYOLO
from slowfast import *

import time

if __name__ == "__main__":
    camera = Camera()
    slowfast = SlowFast()
    yolo_model = SIMPLEYOLO()
    slowfast.print_log = True
    while True:
        frame = camera.get_one_frame()
        person_detect = yolo_model.person_detect(frame)
        print("-------------")
        if person_detect:
            print("Person Detected")
            frames = camera.get_frames(num_frame=slowfast.required_frames_num)
            ret = slowfast.analyze_action(frames)
            print(f"Classed Action: {ret}")
        else:
            print("Person Not Detected")

        print("-------------")

        time.sleep(1)
