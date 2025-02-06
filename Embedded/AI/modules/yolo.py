from ultralytics import YOLO
import torch
import logging

logging.getLogger("ultralytics").setLevel(logging.CRITICAL)

class SIMPLEYOLO:
    def __init__(self):
        self.model = YOLO('yolov8s.pt', verbose=False)
        self.device = 'cuda' if torch.cuda.is_available() else 'cpu'
        self.model.to(self.device)
        self.th_conf_score = 0.7
        print("Load Yolo Model Module")

    def person_detect(self, frame):
        results = self.model(frame, device=self.device)

        # 감지된 객체들의 클래스 리스트
        detected_classes = results[0].boxes.cls.tolist()  
        # 감지된 객체들의 신뢰도 리스트
        confidence_scores = results[0].boxes.conf.tolist()  

        for cls, conf in zip(detected_classes, confidence_scores):
            if cls == 0 and conf >= self.th_conf_score:  # 클래스 ID 0 == 사람(person)
                return True

        return False 

