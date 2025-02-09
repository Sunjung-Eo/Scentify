import React, { useEffect, useState } from 'react';
import {
  CustomSchedule,
  AutoSchedule,
} from '../../../../types/SchedulesType.ts';
import { MainDeviceState } from '../../../../types/MainDeviceType.ts';
import leftarrow from '../../../../assets/icons/leftarrow-icon.svg';
import rightarrow from '../../../../assets/icons/rightarrow-icon.svg';
import DeviceInfo from './components/DeviceInfo.tsx';
import NoDeviceInfo from './components/NoDeviceInfo.tsx';
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

  // deviceIds 배열을 정렬하여 mainDeviceId가 첫 번째로 오도록 함
  const sortedDeviceIds = React.useMemo(() => {
    if (!mainDeviceId || !deviceIds.length) return deviceIds;
    return [mainDeviceId, ...deviceIds.filter((id) => id !== mainDeviceId)];
  }, [deviceIds, mainDeviceId]);

  const [currentIndex, setCurrentIndex] = useState(0);

  // React Query 사용 시 정렬된 deviceIds 사용
  const {
    data: deviceData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['deviceInfo', sortedDeviceIds[currentIndex]],
    queryFn: async () => {
      if (
        !sortedDeviceIds.length ||
        sortedDeviceIds[currentIndex] === undefined
      ) {
        return { devices: [] };
      }
      try {
        const response = await deviceInfo(sortedDeviceIds[currentIndex]);
        return response;
      } catch (error) {
        console.log('디바이스 정보 조회 실패');
        return { devices: [] };
      }
    },
    enabled: sortedDeviceIds.length > 0,
    staleTime: 0,
    refetchOnWindowFocus: false,
    retry: false,
  });

  // 기기 변경 감지
  useEffect(() => {
    if (mainDevice) {
      refetch();
    }
  }, [mainDevice, refetch]);

  // 다음 기기로 변경
  const handleNext = () => {
    if (currentIndex < sortedDeviceIds.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  // 이전 기기로 변경
  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };

  if (isLoading) return <div>로딩 중...</div>;
  if (isError) return <div>에러가 발생했습니다.</div>;

  if (!sortedDeviceIds.length) {
    return <NoDeviceInfo />;
  }

  const device = deviceData?.devices?.[0];

  return (
    <div className="relative flex flex-col items-center h-[460px] justify-between">
      {deviceIds.length === 0 ? (
        <NoDeviceInfo />
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
          <DeviceInfo device={device} mainDeviceId={mainDeviceId} />
          <DeviceSchedule
            deviceId={sortedDeviceIds[currentIndex]}
            customSchedules={customSchedules}
            autoSchedules={autoSchedules}
          />
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
            <p className="text-[10px]">{`기기 ID: ${sortedDeviceIds[currentIndex] || '없음'} (슬라이드 ${currentIndex + 1}/${deviceIds.length})`}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default DeviceSlide;
