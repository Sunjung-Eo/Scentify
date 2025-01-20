import cv2
from ultralytics import YOLO
import torch
import numpy as np

# CUDA 사용 가능 여부 확인
device = 'cuda' if torch.cuda.is_available() else 'cpu'
print(f"Using device: {device}")

# YOLO 모델 로드 및 GPU/CPU로 이동
yolo_model = YOLO('yolov8l-pose.pt')
yolo_model.to(device)

# 학습된 LSTM 모델 로드
class LSTMModel(torch.nn.Module):
    def __init__(self, input_size, hidden_size, output_size, num_layers, dropout):
        super(LSTMModel, self).__init__()
        self.lstm = torch.nn.LSTM(input_size, hidden_size, num_layers, batch_first=True, dropout=dropout)
        self.fc = torch.nn.Linear(hidden_size, output_size)

    def forward(self, x):
        _, (hidden, _) = self.lstm(x)
        hidden = hidden[-1]  # 마지막 LSTM 층의 출력
        out = self.fc(hidden)
        return out

# LSTM 모델 초기화
input_size = 34  # Keypoint 차원 수
hidden_size = 64
output_size = 3  # 레이블 클래스 수
num_layers = 2
dropout = 0.3
lstm_model = LSTMModel(input_size, hidden_size, output_size, num_layers, dropout)
lstm_model.load_state_dict(torch.load("best_lstm_model.pth", map_location=device))
lstm_model.to(device)
lstm_model.eval()

# 클래스 레이블 정의
class_labels = ["push_up", "use_phone", "yoga"]

# 카메라 캡처 객체 생성
cap = cv2.VideoCapture(0)
cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

# 시퀀스 버퍼 초기화
sequence_length = 30
keypoint_buffer = []

while cap.isOpened():
    success, frame = cap.read()
    if not success:
        break

    # YOLO로 프레임 분석
    results = yolo_model(frame, device=device)

    if results[0].keypoints is not None:
        # Keypoints 추출 (17개 좌표 (x, y))
        keypoints = results[0].keypoints.xy.cpu().numpy()
        flattened_keypoints = keypoints.flatten()  # (34,)
    else:
        # Keypoints가 없으면 0으로 채움
        flattened_keypoints = np.zeros(34)

    if flattened_keypoints.shape[0] != 34:
        continue
    # 시퀀스 버퍼에 추가
    keypoint_buffer.append(flattened_keypoints)

    # 시퀀스 길이 유지
    if len(keypoint_buffer) > sequence_length:
        keypoint_buffer.pop(0)

    # 시퀀스가 준비되었을 때 행동 예측
    if len(keypoint_buffer) == sequence_length:
        sequence_tensor = torch.tensor([keypoint_buffer], dtype=torch.float32).to(device)  # (1, sequence_length, 34)
        with torch.no_grad():
            output = lstm_model(sequence_tensor)  # LSTM 예측
            probabilities = torch.softmax(output, dim=1).cpu().numpy()[0]  # 확률 계산
            predicted_label = class_labels[np.argmax(probabilities)]  # 가장 높은 확률의 레이블

        # 예측 결과 출력
        print(f"Predicted: {predicted_label}, Probabilities: {probabilities}")

        # 결과를 프레임에 시각화
        cv2.putText(frame, f"Action: {predicted_label}", (10, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
        for i, label in enumerate(class_labels):
            cv2.putText(frame, f"{label}: {probabilities[i]:.2f}", (10, 80 + i * 30), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 1)

    # 결과 시각화
    annotated_frame = results[0].plot()
    cv2.imshow("YOLOv8 Pose Detection with LSTM", annotated_frame)

    # 'q' 키로 종료
    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

cap.release()
cv2.destroyAllWindows()
