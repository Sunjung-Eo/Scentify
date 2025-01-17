# Scentify AI
스마트 디퓨저 프로젝트 "Scentify"의 AI 모델

Jetson Nano의 카메라 프레임을 기반으로 사용자를 감지하거나 사용자의 행동을 감지하는 것을 AI로 진행합니다.

## 방안 1 : Yolo Pose Estimation + LSTM
- Yolo Pose Estimation으로 사용자의 키 포인트 좌표를 구합니다.
- LSTM에서는 시간에 따른 이 키 포인트 좌표들을 분석하여 특정 시간동안 사용자가 어떤 행동을 하고 있는지 분석합니다.

## 방안 2 : Slow Fast Model
- CVPR 2019 : https://arxiv.org/abs/1812.03982
- 요약 : 고속 프레임의 CNN + 저속 프레임의 CNN 
- 하나의 모델로 사용자의 행동을 분석할 수 있습니다.
