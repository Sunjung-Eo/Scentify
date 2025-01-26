import React, { useState } from "react";
import {
  APIResponse,
  Device,
  CustomSchedule,
  AutoSchedule,
} from "./DeviceTypes";
import deviceImg from "../../../assets/images/device.svg";
import leftarrow from "../../../assets/icons/leftarrow-icon.svg";
import rightarrow from "../../../assets/icons/rightarrow-icon.svg";
import { mapIntToFragrance } from "../../../utils/fragranceUtils";
import waterIcon from "../../../assets/icons/Water.png";
import temperatureIcon from "../../../assets/icons/Temperature.png";
import PlayBtn from "../../../assets/icons/PlayBtn.svg";
import modifyIcon from "../../../assets/icons/modify-icon.svg";
import subtract from "../../../assets/images/Subtract.png";
interface Props {
  data: APIResponse; // 부모 컴포넌트로부터 전달받는 props로, API 데이터 형식 정의
}

const DeviceCarousel: React.FC<Props> = ({ data }) => {
  const [currentIndex, setCurrentIndex] = useState(0); // 현재 표시 중인 기기의 인덱스를 관리
  const { main_device_id, devices, customSchedules, autoSchedules } = data; // API 데이터 구조 분해

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

  //현재시간과 예약정보를 비교해서 예약정보 불러오는 함수
  const getClosestSchedule = (): CustomSchedule | null => {
    if (!customSchedules || customSchedules.length === 0 || !currentDevice)
      return null; // 예약이 없거나 현재 기기가 없으면 null 반환
    const now = new Date();
    const today = now.getDay(); // 오늘 요일 (0: 일요일 ~ 6: 토요일)

    // 현재 기기에 해당하는 예약만 필터링
    const schedulesForDevice = customSchedules.filter(
      (schedule) =>
        schedule.deviceId === currentDevice.id && // 현재 기기와 연결된 예약만 포함
        schedule.day & (1 << (6 - today)) // 오늘 해당하는 예약만 포함
    );

    // 유효한 예약 중 가장 가까운 예약 찾기
    const validSchedules = schedulesForDevice
      .map((schedule) => {
        const [hours, minutes, seconds] = schedule.startTime.split(":");
        const startDate = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          parseInt(hours, 10),
          parseInt(minutes, 10),
          parseInt(seconds, 10)
        );
        return { ...schedule, startDate };
      })
      .filter((schedule) => schedule.startDate > now) // 현재 시간 이후 예약만 남김
      .sort((a, b) => a.startDate!.getTime() - b.startDate!.getTime()); // 가장 가까운 예약 정렬

    return validSchedules[0] || null; // 가장 가까운 예약 반환
  };

  // 현재 기기 ID에 해당하는 자동화 모드 필터링
  const getAutoSchedulesForDevice = (): AutoSchedule[] => {
    if (!autoSchedules || autoSchedules.length === 0 || !currentDevice)
      return [];
    return autoSchedules.filter(
      (schedule) => schedule.device_id === currentDevice.id // 현재 기기와 연결된 자동화 모드
    );
  };

  const closestSchedule = getClosestSchedule(); // 가장 가까운 예약 정보 가져오기
  const autoSchedulesForDevice = getAutoSchedulesForDevice(); // 현재 기기의 자동화 모드 예약 가져오기

  return (
    <>
      <div className="flex flex-col items-center justify-center">
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
            <div className="grid grid-cols-3 items-center w-[300px] mb-5">
              {/* 왼쪽 빈 공간 */}
              <div></div>
              {/* 가운데 정렬된 이름 */}
              <h2 className="text-[20px] font-pre-bold text-center">
                {currentDevice?.name}
              </h2>
              {/* 오른쪽 끝에 위치한 아이콘 */}
              <img
                src={modifyIcon}
                alt="modifyIcon"
                className="justify-self-end w-[24px] h-[24px]"
              />
            </div>
            <div className="ImgSlotRemainingGroup flex justify-between items-center w-full px-7">
              <div className="relative w-[72px] h-[120px]">
                {/* Main device이미지*/}
                <img
                  src={deviceImg}
                  alt="deviceImg"
                  className="w-full h-full"
                />

                {/* Play button이미지 */}
                <img
                  src={PlayBtn}
                  alt="btn"
                  className="absolute -bottom-4 -right-4 w-[50px] h-[50px]" // 우하단에 겹치도록 배치
                />
              </div>
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
                      <span className="text-pre-light text-[8px] mt-2 leading-snug text-center">
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
            {/* <>버튼 묶음*/}
            <div className="ArrowbtnGroup flex items-center justify-between w-full mt-5">
              {/* 왼쪽 버튼 */}
              <button onClick={handlePrev}>
                <img src={leftarrow} alt="Left Arrow" />
              </button>
              {/* 오른쪽 버튼 */}
              <button onClick={handleNext}>
                <img src={rightarrow} alt="Right Arrow" />
              </button>
            </div>

            {/* 상세정보 박스와 모드 박스 좌우로 정렬*/}
            <div className="flex items-start justify-between w-full mt-5 relative">
              {/* 상세정보박스 배경 이미지와 텍스트 콘텐츠 포함*/}
              <div className="relative w-[330px] h-[170px]">
                {/* 배경 이미지 */}
                <img
                  src={subtract}
                  alt="Background"
                  className="absolute inset-0 w-full h-full object-cover rounded-[20px]"
                />

                {/* 텍스트 콘텐츠 */}
                <div className="absolute inset-0 flex flex-col p-9 pl-10 ">
                  {currentDevice?.mode === 0 ? ( // 예약 모드
                    closestSchedule ? ( // 가장 가까운 예약이 있는 경우
                      <>
                        <p className="text-[16px] font-pre-bold mb-2">
                          {closestSchedule.name}
                        </p>
                        <p className="text-[10px] font-pre-regular">
                          {`${closestSchedule.startTime} ~ ${closestSchedule.endTime}`}
                        </p>
                        <p className="text-[10px] font-pre-regular">
                          {closestSchedule.combinationId}
                        </p>
                      </>
                    ) : (
                      <p className="text-[10px] font-pre-regular">
                        현재 예약이 없습니다.
                      </p> // 예약이 없는 경우
                    )
                  ) : autoSchedulesForDevice.length > 0 ? ( // 자동화 모드
                    autoSchedulesForDevice.map((schedule) => (
                      <p
                        key={schedule.id}
                        className="text-[10px] font-pre-regular"
                      >
                        {`${schedule.subMode}, 분사 주기 ${schedule.interval}분`}
                      </p>
                    ))
                  ) : (
                    <p className="text-[10px] font-pre-regular">
                      자동화 모드 예약이 없습니다.
                    </p>
                  )}

                  {/* 온도와 습도 표시 */}
                  <div className="flex items-center mt-auto">
                    <div className="flex items-center mr-6">
                      <img
                        src={temperatureIcon}
                        alt="Temperature Icon"
                        className="w-5 h-5"
                      />
                      <p className="text-[10px]">
                        {`${currentDevice?.temperature ?? "-"}`}°C
                      </p>
                    </div>
                    <div className="flex items-center">
                      <img
                        src={waterIcon}
                        alt="Humidity Icon"
                        className="w-5 h-5"
                      />
                      <p className="text-[10px]">
                        {`${currentDevice?.humidity ?? "-"}`}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 모드 정보박스  오른쪽 상단에 고정*/}
              <div className="absolute top-3 right-3 flex items-center justify-center w-[83px] h-[31px] rounded-[18px] bg-sub text-white text-[12px]">
                {currentDevice?.mode === 0 // 예약 모드인지 확인
                  ? closestSchedule // 예약 정보가 있는 경우
                    ? "예약 모드" // "예약 모드" 표시
                    : "-" // 예약 정보가 없으면 "-" 표시 (초록색 박스 유지)
                  : "자동 모드"}{" "}
                {/* 자동 모드가 활성화된 경우 */}
              </div>
            </div>
            {/* 현재 페이지 / 전체 페이지 */}
            <div className="mt-1">
              <p className="text-[10px]">
                {currentIndex + 1} / {deviceCount}
              </p>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default DeviceCarousel;
