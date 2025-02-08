import React, { useEffect, useState } from 'react';
import {
  CustomSchedule,
  AutoSchedule,
} from '../../../../types/SchedulesType.ts';
import { MainDeviceState } from '../../../../types/MainDeviceType.ts';
import leftarrow from '../../../../assets/icons/leftarrow-icon.svg';
import rightarrow from '../../../../assets/icons/rightarrow-icon.svg';
import DeviceInfo from './components/DeviceInfo.tsx';
import DeviceSchedule from './components/DeviceSchedule.tsx';
import { deviceInfo } from '../../../../apis/home/deviceInfo.ts';
import { useQuery } from '@tanstack/react-query';
import { useMainDeviceStore } from '../../../../stores/useDeviceStore.ts';

interface DeviceSlideProps {
  data: {
    mainDeviceId: number | null;
    deviceIds: number[];
    customSchedules: CustomSchedule[];
    autoSchedules: AutoSchedule[];
  };
}

const DeviceSlide: React.FC<DeviceSlideProps> = ({ data }) => {
  const { mainDeviceId, deviceIds, customSchedules, autoSchedules } = data;
  const { mainDevice } = useMainDeviceStore();
  const [currentIndex, setCurrentIndex] = useState(0);

  // 현재 선택된 기기 상태
  const [currentDevice, setCurrentDevice] = useState<MainDeviceState | null>(
    null
  );

  // ✅ React Query를 사용하여 현재 선택된 기기의 정보 가져오기
  const {
    data: deviceData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['deviceInfo', deviceIds[currentIndex]],
    //queryFn: () => deviceInfo(deviceIds[currentIndex]),

    queryFn: async () => {
      // deviceIds가 비어있거나 currentIndex가 유효하지 않은 경우
      if (!deviceIds.length || deviceIds[currentIndex] === undefined) {
        return { devices: [] };
      }
      try {
        const response = await deviceInfo(deviceIds[currentIndex]);
        return response;
      } catch (error) {
        console.log('디바이스 정보 조회 실패');
        return { devices: [] }; // 에러 발생시 빈 devices 배열 반환
      }
    },
    enabled: deviceIds.length > 0,
    staleTime: 0,
    refetchOnWindowFocus: false,
    retry: false, // 에러 발생 시 재시도하지 않음
  });

  // 기기 변경 감지
  useEffect(() => {
    if (mainDevice) {
      setCurrentDevice(mainDevice);
      refetch();
    }
  }, [mainDevice, refetch]);

  // ✅ 다음 기기로 변경
  const handleNext = () => {
    if (currentIndex < deviceIds.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  // ✅ 이전 기기로 변경
  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
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
          <DeviceInfo
            device={deviceData?.devices?.[0] || currentDevice}
            mainDeviceId={mainDeviceId}
          />
          <DeviceSchedule
            deviceId={currentDevice?.id || 0}
            customSchedules={customSchedules}
            autoSchedules={autoSchedules}
          />
          {/* 🔹 슬라이드 버튼 (기기가 2개 이상일 때만 활성화) */}
          {deviceIds.length > 1 && (
            <div className="absolute inset-y-1/2 left-0 right-0 flex justify-between transform -translate-y-1/2">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className={`${currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <img src={leftarrow} alt="Left Arrow" />
              </button>
              <button
                onClick={handleNext}
                disabled={currentIndex === deviceIds.length - 1}
                className={`${currentIndex === deviceIds.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <img src={rightarrow} alt="Right Arrow" />
              </button>
            </div>
          )}
          <div className="mt-2">
            <p className="text-[10px]">{`기기 ID: ${currentDevice?.id || '없음'} (슬라이드 ${currentIndex + 1}/${deviceIds.length})`}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default DeviceSlide;
