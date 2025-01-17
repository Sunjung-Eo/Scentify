import cv2
from ultralytics import YOLO
import torch
import time

# CUDA 사용 가능 여부 확인
device = 'cuda' if torch.cuda.is_available() else 'cpu'
print(f"Using device: {device}")

# YOLO 모델 로드 및 GPU로 이동
model = YOLO('yolov8l-pose.pt')
model.to(device)

# 카메라 캡처 객체 생성
cap = cv2.VideoCapture(0)

cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

while cap.isOpened():
    success, frame = cap.read()
    
    if success:
        # YOLO로 프레임 분석 (GPU 사용)
        results = model(frame, device=device)

        # 결과 시각화
        annotated_frame = results[0].plot()
        
        cv2.imshow("YOLOv8 Pose Detection", annotated_frame)
        
        if cv2.waitKey(1) & 0xFF == ord("q"):
            break
    else:
        break

cap.release()
cv2.destroyAllWindows()
