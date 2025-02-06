import React, { useEffect, useState } from 'react';
import {
  CustomSchedule,
  AutoSchedule,
} from '../../../../types/SchedulesType.ts';
import { DeviceState } from '../../../../types/DeviceType.ts';
import leftarrow from '../../../../assets/icons/leftarrow-icon.svg';
import rightarrow from '../../../../assets/icons/rightarrow-icon.svg';
import DeviceInfo from './components/DeviceInfo.tsx';
import DeviceSchedule from './components/DeviceSchedule.tsx';
import { deviceInfo } from '../../../../apis/home/deviceInfo.ts';
import { useQuery } from '@tanstack/react-query';
import { useDeviceStore } from '../../../../stores/useDeviceStore.ts';

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
  const { setDevices, devices: storeDevices } = useDeviceStore();

  // ✅ 슬라이드 순서와 id 매핑 과정
  // main_device_id 를 기준으로 첫 번째 기기 설정
  const mainDevice =
    storeDevices.find((device) => device.isRepresentative) ??
    devices.find((device) => device.id === main_device_id) ??
    devices[0];

  //  대표 기기가 없으면 기본 리스트에서 찾음
  const remainDevices = storeDevices.filter(
    (device) => device.id !== main_device_id
  );

  // deviceIds 순서대로 디바이스 정렬 (메인 기기 제외)
  const orderedDevices = mainDevice ? [mainDevice, ...remainDevices] : devices;

  // 슬라이드 인덱스 관리
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentDevice = orderedDevices[currentIndex];

  // console.log('현재 슬라이드 기기 : ', currentDevice);

  // ✅ React Query를 사용하여 현재 선택된 기기의 정보 가져오기
  const {
    data: deviceData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['deviceInfo', currentDevice?.id],
    queryFn: () => deviceInfo(currentDevice.id.toString()), // API 요청
    enabled: !!currentDevice, // currentDevice가 있을 때만 실행
    staleTime: 0,
    refetchOnWindowFocus: false, // 포커스 이동 시 자동 새로고침 방지
  });

  // 1) 슬라이드 변경 후 'deviceInfo' 요청 실행 => 기기 정보가 변경될 때 Zustand 상태 업데이트
  useEffect(() => {
    if (currentDevice) {
      refetch(); // currentDevice가 바뀌면 deviceInfo API 요청 실행
    }
  }, [currentDevice, refetch]);

  // ✅ 기기 정보가 변경될 때 Zustand 상태 업데이트
  useEffect(() => {
    if (!deviceData?.devices?.length) return; // 응답이 없으면 실행 안 함

    const newDevice = deviceData.devices[0]; // API에서 받아온 기기 정보
    const existingDevice = devices.find((d) => d.id === newDevice.id); // devices에서 동일한 id를 가진 기기가 있는 확인

    // ✅ 기존 상태와 다를 경우에만 업데이트
    if (
      !existingDevice ||
      existingDevice.slot1 !== newDevice.slot1 ||
      existingDevice.slot2 !== newDevice.slot2 ||
      existingDevice.slot3 !== newDevice.slot3 ||
      existingDevice.slot4 !== newDevice.slot4
    ) {
      setDevices(newDevice, storeDevices);

      setTimeout(() => {
        console.log(
          '✅ 업데이트 후 useDeviceStore 상태:',
          useDeviceStore.getState().devices
        );
      }, 100);
    }
  }, [deviceData, setDevices, storeDevices]);

  // console.log('deviceData 디바이스 데이터 :', deviceData);

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
      ) : isLoading ? (
        <p className="text-brand font-pre-regular text-xs mt-24">
          기기 정보를 불러오는 중...
        </p>
      ) : isError ? (
        <p className="text-red-500 text-xs mt-24">
          기기 정보를 불러오지 못했습니다.
        </p>
      ) : (
        <>
          {/* ✅ API에서 받아온 데이터를 DeviceInfo에 전달 */}
          <DeviceInfo device={deviceData?.devices?.[0] || currentDevice} />
          <DeviceSchedule
            deviceId={currentDevice.id}
            customSchedules={customSchedules}
            autoSchedules={autoSchedules}
          />
          {/* 🔹 슬라이드 버튼 정확한 중앙 배치 */}
          {orderedDevices.length > 1 && (
            <div className="absolute inset-y-1/2 left-0 right-0 flex justify-between transform -translate-y-1/2">
              <button onClick={handlePrev}>
                <img src={leftarrow} alt="Left Arrow" />
              </button>
              <button onClick={handleNext}>
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
