import requests
import cv2
import torch
import numpy as np
from pytorchvideo.models.hub import slowfast_r50
from torchvision.transforms import Compose, Lambda, Normalize, Resize

# SlowFast 모델 로드 (Kinetics-400으로 pre-trained)
model = slowfast_r50(pretrained=True)
model.eval()

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
model.to(device)

# Kinetics-400 클래스 레이블 로드
KINETICS_CLASSES_URL = "https://raw.githubusercontent.com/deepmind/kinetics-i3d/master/data/label_map.txt"

# 클래스 레이블 다운로드
response = requests.get(KINETICS_CLASSES_URL)
if response.status_code == 200:
    classes = response.text.splitlines()
else:
    raise ValueError("Failed to download Kinetics-400 class labels.")

# OpenCV 비디오 캡처 초기화
cap = cv2.VideoCapture(0)  # 웹캠 사용 (0번 장치)

# 입력 프레임 전처리 함수 정의
def preprocess_frames(frames):
    # [T, H, W, C] → [T, C, H, W]
    frames = np.stack(frames, axis=0)  # [T, H, W, C]
    frames = torch.tensor(frames).permute(0, 3, 1, 2).float()  # [T, C, H, W]

    # Normalize와 Resize는 각 프레임에 개별적으로 적용
    transform = Compose([
        Lambda(lambda x: x / 255.0),  # 픽셀 값을 [0, 1] 범위로 정규화
        Resize((224, 224)),          # 입력 크기 조정
        Normalize(mean=[0.45, 0.45, 0.45], std=[0.225, 0.225, 0.225])  # Kinetics 표준화
    ])
    frames = torch.stack([transform(frame) for frame in frames])  # 각 프레임에 전처리 적용

    # Slow Path와 Fast Path 생성
    slow_path = frames[::4]  # Slow Path: 프레임의 1/4 샘플링
    fast_path = frames  # Fast Path: 모든 프레임 사용

    # [T, C, H, W] → [C, T, H, W]
    slow_path = slow_path.permute(1, 0, 2, 3)  # [C, T, H, W]
    fast_path = fast_path.permute(1, 0, 2, 3)  # [C, T, H, W]

    # 리스트로 반환 (SlowFast 모델 요구사항)
    return [slow_path.unsqueeze(0).to(device), fast_path.unsqueeze(0).to(device)]  # [B, C, T, H, W]


# 실시간 프레임 버퍼
frame_buffer = []
buffer_size = 32  # SlowFast는 최소 32 프레임 필요

print("Press 'q' to exit.")

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    # 프레임 추가 (최대 buffer_size 유지)
    resized_frame = cv2.resize(frame, (224, 224))  # 크기 조정
    frame_buffer.append(resized_frame)
    if len(frame_buffer) > buffer_size:
        frame_buffer.pop(0)

    # 버퍼가 충분히 채워졌을 때 행동 분석
    if len(frame_buffer) == buffer_size:
        input_tensor = preprocess_frames(frame_buffer)  # 전처리

        with torch.no_grad():
            outputs = model(input_tensor)  # 예측
            probabilities = torch.nn.functional.softmax(outputs, dim=-1)  # Softmax 계산
            
            # 상위 5개의 클래스 인덱스와 확률 가져오기
            top5_prob, top5_idx = torch.topk(probabilities, 5, dim=-1)  # 값과 인덱스를 함께 반환
            top5_idx = top5_idx[0].tolist()  # 텐서를 리스트로 변환
            top5_prob = top5_prob[0].tolist()  # 확률 값도 리스트로 변환

        # 상위 5개의 행동 출력
        predictions = [(classes[idx], prob) for idx, prob in zip(top5_idx, top5_prob)]
        for i, (label, prob) in enumerate(predictions):
            text = f"{i + 1}. {label} ({prob:.2f})"
            cv2.putText(frame, text, (10, 30 + i * 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)

    # 출력 화면 표시
    cv2.imshow("SlowFast Action Recognition", frame)

    # 'q'를 누르면 종료
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# 자원 해제
cap.release()
cv2.destroyAllWindows()
