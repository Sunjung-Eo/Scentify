import React, { useState } from "react";
import { APIResponse, Device } from "./DeviceTypes";
import deviceImg from "../../../assets/images/device.svg";
import leftarrow from "../../../assets/icons/leftarrow-icon.svg";
import rightarrow from "../../../assets/icons/rightarrow-icon.svg";
import { mapIntToFragrance } from "../../../utils/fragranceUtils";

interface Props {
  data: APIResponse; // 부모 컴포넌트로부터 전달받는 props로, API 데이터 형식 정의
}

const DeviceCarousel: React.FC<Props> = ({ data }) => {
  const [currentIndex, setCurrentIndex] = useState(0); // 현재 표시 중인 기기의 인덱스를 관리
  const { main_device_id, devices } = data; // API로부터 전달받은 데이터 구조 분해

  const deviceCount = main_device_id.length; // 연결된 기기의 개수
  const currentDevice: Device | undefined =
    deviceCount > 0
      ? devices.find((device) => device.id === main_device_id[currentIndex]) // 현재 인덱스에 해당하는 기기 데이터 가져오기
      : undefined;

  // 다음 버튼 클릭 시 인덱스를 증가시키고, 마지막 인덱스라면 처음으로 돌아감
  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % deviceCount);
  };

  // 이전 버튼 클릭 시 인덱스를 감소시키고, 첫 번째 인덱스라면 마지막으로 이동
  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + deviceCount) % deviceCount);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {/* 연결된 기기가 없는 경우 */}
      {deviceCount === 0 ? (
        <div className="flex  justify-center h-full">
          <p className="text-brand font-pre-regular text-xs mt-24">
            현재 연결된 기기가 없습니다.
          </p>
        </div>
      ) : (
        // 연결된 기기가 있는 경우 캐러셀 표시
        <>
          <h2 className="text-xl font-pre-bold">
            {currentDevice?.name || "기기 이름 없음"}
          </h2>
          <div className="ImgSlotRemainingGroup flex justify-between items-center w-full px-7">
            <img
              src={deviceImg}
              alt="diviceImg"
              className="w-[72px] h-[120px]"
            />
            {/* 슬롯 상태 막대 표시 */}
            <div className="flex justify-around gap-2.5">
              {[1, 2, 3, 4].map((slot) => {
                const remainingRatio =
                  currentDevice?.[
                    `slot${slot}RemainingRatio` as keyof Device
                  ] ?? 0; // 남은 비율

                const fragranceInt = currentDevice?.[
                  `slot${slot}` as keyof Device
                ] as number | null; // fragranceInt 변수에 할당된 값(number나 null값만 들어올 수 있음)

                const fragranceName =
                  typeof fragranceInt === "number" && fragranceInt !== null
                    ? mapIntToFragrance(fragranceInt)
                    : "미설정"; // fragranceInt를 매핑함수 통해 향으로 변환

                return (
                  <div key={slot} className="flex flex-col items-center">
                    {/* 기본적으로 #EBEAE5로 채워진 막대 */}
                    <div className="relative w-6 h-20 bg-[#EBEAE5] rounded overflow-hidden">
                      {/* remainingRatio만큼 bg-brand로 채움 */}
                      <div
                        className="absolute bottom-0 w-full bg-brand"
                        style={{ height: `${remainingRatio}%` }}
                      />
                    </div>
                    {/* 향이 5글자 이상일 경우 3글자출력후 줄바꿈 아니면 그대로 출력 */}
                    <span className="text-pre-light text-[10px] mt-2 leading-snug text-center">
                      {fragranceName.length > 5 ? (
                        <>
                          {fragranceName.slice(0, 3)}
                          <br />
                          {fragranceName.slice(3)}
                        </>
                      ) : (
                        fragranceName
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* <>버튼과 모드정보를 묶음*/}
          <div className="ArrowbtnModeGroup flex items-center justify-between w-full mt-5">
            {/* 왼쪽 버튼 */}
            <button onClick={handlePrev}>
              <img src={leftarrow} alt="Left Arrow" />
            </button>
            {/* 가운데 모드 정보 */}
            <div className="flex items-center justify-center w-[66px] h-[22px] rounded-[18px] border border-brand text-xs">
              {currentDevice?.mode ? "자동 모드" : "예약 모드"}
            </div>
            {/* 오른쪽 버튼 */}
            <button onClick={handleNext}>
              <img src={rightarrow} alt="Right Arrow" />
            </button>
          </div>

          {/* 모드 및 기기 정보 */}
          <div className="bg-white rounded-lg w-[258px] h-[160px] mt-5">
            <div className="mt-4">
              <p>온도: {currentDevice?.temperature || 0}°C</p> {/* 현재 온도 */}
              <p>습도: {currentDevice?.humidity || 0}%</p> {/* 현재 습도 */}
            </div>
          </div>

          {/* 하단 페이지 네비게이션 */}
          <div className="mt-6">
            <p>
              {currentIndex + 1} / {deviceCount}{" "}
              {/* 현재 페이지 / 전체 페이지 */}
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default DeviceCarousel;
