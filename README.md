# 💜 Scentify : 스마트 디퓨저 프로젝트 💜

## 📌 프로젝트 기획 요약

1. **주변 환경 또는 사용자 행동 기반 자동화 모드을 제공합니다.**
    - 악취 탐지될 시, 사용자 설정 간격으로 기본 조합을 분사합니다.
   - 카메라 센서를 통해 인식된 사용자 행동을 분석하여 운동, 집중 모드에 해당할 경우 추천 조합을 분사합니다.
   - 카메라 센서에 사용자 감지 시, 기본 조합을 분사합니다.
 
2. **예약 시간을 설정할 수 있는 스케줄 모드를 제공합니다.**
    - 사용자가 시작/ 종료시간, 분사 간격, 향 조합을 설정하면 해당 시간에 분사합니다.

3. **찜한 향기 조합 페이지 저장 및 공유 기능합니다.**
    - 찜한 향기 조합에 대한 설명 페이지를 이미지로 저장 가능합니다.
    - 또한 향기 조합을 링크로 공유 및 링크를 받은 사용자가 향기 조합 등록 가능합니다.

<br>

## 📌 브랜치 설명
- **task** : 과제 수행 및 관련 README.md가 작성되어 있습니다.
    - 과제 1 프로젝트 위치 : S12P11A205/ Sub_PJT/ Sub_PJT1

- **master** : Scentify 프로젝트 관련 README.md가 작성되어 있습니다.
    - **FE/ Develop** : FrontEnd 개발 브랜치 입니다.
        - 프로젝트 위치 : S12P11A205/ FrontEnd
    - **BE/ Develop** : BackEnd 개발 브랜치 입니다.
        - 프로젝트 위치 : S12P11A205/ BackEnd
    - **EM / Develop** : Embedded 개발 브랜치 입니다.
        - 프로젝트 위치 : S12P11A205/ Embedded

<br>

## 📌 기획서 및 요구사항 분석
### 1️⃣ 기획서
![image](/uploads/6c83953a8e0fc12d0d145f7576724bc4/image.png){width=434 height=162}
![image](/uploads/661ca29ea486c53180be1e4e48ca9276/image.png){width=434 height=162}
![image](/uploads/e7e18582a2f99835c172c14f1284b7e7/image.png){width=434 height=162}

---

### 2️⃣ 요구사항 분석
### **[기능 명세서]**
![image](/uploads/706bddf2796238e110e9fa15bdf2f22b/image.png){width=434 height=513}
![image](/uploads/6583f0713f3e4133c8c43b71d55e08b8/image.png){width=434 height=440}

### **[비기능 명세서]**
![image](/uploads/1d4daef782b7037dc4d44817a698de3f/image.png){width=434 height=449}

<br>

## 📌 시퀀스 다이어그램
![플로우차트__1_](/uploads/3b851b6ce0faef01896a6dfe439e99f0/플로우차트__1_.png)

<br>

## 📌 아키텍처 다이어그램
![제목을-입력해주세요_-002](/uploads/77893ad96877a18c95373934d64eb897/제목을-입력해주세요_-002.png){width=1440 height=810}

<br>

## 📌 UI 기획
![1__1_](/uploads/9e62a0fdb450fdd06c0943cc12b2662b/1__1_.png)
![2__1_](/uploads/e29f79ab3518faab66d5e7b66c0ba148/2__1_.png)
![3__1_](/uploads/f932b93a63f39811609a3ea44cd901f5/3__1_.png)

<br>

## 📌 ERD 다이어그램
![Untitled](/uploads/6969039fd2a703988aaabf8f21dac0ec/Untitled.png)

<br>

## 📌 API 명세서
### 1️⃣ [BE] API 명세서
![image](/uploads/55f0a4241db1e1e68b27249bf1380626/image.png){width=871 height=516}
![image](/uploads/9e8285c8c12bd44908c172cc899e5b29/image.png){width=871 height=461}
![image](/uploads/afa29cc78f5b4d2309a22e24f365746e/image.png){width=871 height=504}
![image](/uploads/9e87ca1ec81f7841f5fe248ea7e36e0d/image.png){width=871 height=473}
![image](/uploads/aba6ed9ed7fbf69a96947d8ddd10cc77/image.png){width=871 height=409}
![image](/uploads/105ceebbb5038f1effef40638fb3253d/image.png){width=871 height=518}
![image](/uploads/d7f7bab0ce1abaa9cf23b70c24f99906/image.png){width=871 height=517}
![image](/uploads/f5e0d2a4e7d6639cd93a33b7bb519736/image.png){width=871 height=387}
![image](/uploads/b966e56b277b55a7d635fff204e2cf74/image.png){width=871 height=500}
![image](/uploads/d65367e2033991d5d4e72242b049e265/image.png){width=871 height=51}

### 2️⃣ [EM] API 명세서
![image](/uploads/e0379c5597eef0e6a6f388f9ba7d312e/image.png){width=871 height=496}
![image](/uploads/98f19db8cbff61d0fb2b758dd7e3ea64/image.png){width=871 height=444}
![image](/uploads/6d63f3b437c153b553121de808f229eb/image.png){width=871 height=244}