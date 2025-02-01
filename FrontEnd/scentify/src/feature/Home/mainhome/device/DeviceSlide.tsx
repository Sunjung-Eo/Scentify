import React, { useState } from 'react';
import {
  CustomSchedule,
  AutoSchedule,
} from '../../../../types/SchedulesType.ts';
import { DeviceState } from '../../../../types/DeviceType.ts';
import leftarrow from '../../../../assets/icons/leftarrow-icon.svg';
import rightarrow from '../../../../assets/icons/rightarrow-icon.svg';
import DeviceInfo from './components/DeviceInfo.tsx';
import DeviceSchedule from './components/DeviceSchedule.tsx';

interface DeviceSlideProps {
  data: {
    main_device_id: number | null;
    deviceIds: number[];
    devices: DeviceState[]; // 기기 정보 리스트
    customSchedules: CustomSchedule[]; // 커스텀 스케줄
    autoSchedules: AutoSchedule[]; // 자동 스케줄
  };
}

const DeviceSlide: React.FC<DeviceSlideProps> = ({ data }) => {
  const { main_device_id, deviceIds, devices, customSchedules, autoSchedules } =
    data;

  const deviceCount = deviceIds.length > 0 ? deviceIds?.length : null;

  // main_device_id 를 기준으로 첫 번째 기기 설정
  const mainDevice =
    devices.find((device) => device.deviceId === main_device_id) ?? devices[0];

  // deviceIds 에서 main_device_id를 제외한 나머지 기기 리스트
  const remainDevices = devices.filter(
    (device) => device.deviceId !== main_device_id
  );

  // deviceIds 순서대로 디바이스 정렬 (메인 기기 제외)
  const orderedDevices = mainDevice ? [mainDevice, ...remainDevices] : devices;

  // ✅ 슬라이드 인덱스 관리
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentDevice = orderedDevices[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % orderedDevices.length);
  };

  const handlePrev = () => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + orderedDevices.length) % orderedDevices.length
    );
  };

  return (
    <div className="relative flex flex-col items-center h-[460px] justify-between">
      {deviceIds.length === 0 ? (
        <p className="text-brand font-pre-regular text-xs mt-24">
          현재 등록된 기기가 없습니다.
        </p>
      ) : (
        <>
          <DeviceInfo device={currentDevice} />
          <DeviceSchedule
            deviceId={currentDevice.deviceId}
            customSchedules={customSchedules}
            autoSchedules={autoSchedules}
          />
          {/* 🔹 슬라이드 버튼 정확한 중앙 배치 */}
          {orderedDevices.length > 1 && (
            <div className="absolute inset-y-1/2 left-0 right-0 flex justify-between transform -translate-y-1/2">
              <button onClick={handlePrev} className="">
                <img src={leftarrow} alt="Left Arrow" />
              </button>
              <button onClick={handleNext} className="">
                <img src={rightarrow} alt="Right Arrow" />
              </button>
            </div>
          )}

          <div className="mt-2">
            <p className="text-[10px]">
              {currentIndex + 1} / {orderedDevices.length}
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default DeviceSlide;
