import React, { useEffect, useState } from 'react';
import {
  CustomSchedule,
  AutoSchedule,
} from '../../../../types/SchedulesType.ts';
import leftarrow from '../../../../assets/icons/leftarrow-icon.svg';
import rightarrow from '../../../../assets/icons/rightarrow-icon.svg';
import DeviceInfo from './components/DeviceInfo.tsx';
import NoDeviceInfo from './components/NoDeviceInfo.tsx';
import DeviceSchedule from './components/DeviceSchedule.tsx';
import { deviceInfo } from '../../../../apis/home/deviceInfo.ts';
import { useQuery } from '@tanstack/react-query';
import { useMainDeviceStore } from '../../../../stores/useDeviceStore.ts';
import {
  fetchReservations,
  fetchAutomations,
} from '../../../../apis/control/getAllDevicesMode.ts';
import { useAuthStore } from '../../../../stores/useAuthStore.ts';
import { useScheduleStore } from '../../../../stores/useScheduleStore.ts';

interface DeviceSlideProps {
  data: {
    mainDeviceId: number | null;
    deviceIds: number[];
    autoSchedules: AutoSchedule[];
    customSchedules: CustomSchedule[];
  };
}

type ScheduleType = 0 | 1 | null;

interface ScheduleData {
  type: ScheduleType;
  schedules: CustomSchedule[] | AutoSchedule[] | null;
}

const DeviceSlide: React.FC<DeviceSlideProps> = ({ data }) => {
  const { mainDeviceId, deviceIds, autoSchedules, customSchedules } = data;
  const { mainDevice } = useMainDeviceStore();
  const setCustomSchedules = useScheduleStore(
    (state) => state.setCustomSchedules
  );
  const setAutoSchedules = useScheduleStore((state) => state.setAutoSchedules);

  // 현재 선택된 슬라이스 인덱스
  const [currentIndex, setCurrentIndex] = useState(0);

  // 기기별 스케줄 데이터 저장
  const [schedules, setSchedules] = useState<Record<number, ScheduleData>>({});

  // mainDeviceId 기준으로 정렬된 기기 ID 배열
  const sortedDeviceIds = React.useMemo(() => {
    if (!mainDeviceId || !deviceIds.length) return deviceIds;
    return [mainDeviceId, ...deviceIds.filter((id) => id !== mainDeviceId)];
  }, [deviceIds, mainDeviceId]);

  const accessToken = useAuthStore.getState().accessToken;

  useEffect(() => {
    const fetchModeAndSchedule = async () => {
      try {
        const currentDeviceId = sortedDeviceIds[currentIndex];
        if (!currentDeviceId) return;

        // Main Device인 경우
        if (currentDeviceId === mainDeviceId) {
          const mainModeOn = mainDevice?.mode;
          if (mainModeOn === 0) {
            setCustomSchedules(customSchedules);
            setSchedules((prev) => ({
              ...prev,
              [currentDeviceId]: {
                type: 0,
                schedules: customSchedules,
              },
            }));
          } else if (mainModeOn === 1) {
            setAutoSchedules(autoSchedules);
            setSchedules((prev) => ({
              ...prev,
              [currentDeviceId]: {
                type: 1,
                schedules: autoSchedules,
              },
            }));
          } else {
            setSchedules((prev) => ({
              ...prev,
              [currentDeviceId]: {
                type: null,
                schedules: null,
              },
            }));
          }
        } else {
          // 일반 기기인 경우
          const deviceInfoResponse = await deviceInfo(currentDeviceId);
          const modeOn: number = deviceInfoResponse.mode;

          let scheduleType: ScheduleType = null;
          let fetchedSchedules: CustomSchedule[] | AutoSchedule[] | null = null;

          if (modeOn === 0) {
            // Custom Schedules
            fetchedSchedules = await fetchReservations(
              currentDeviceId,
              accessToken
            );
            scheduleType = 0;
          } else if (modeOn === 1) {
            // Auto Schedules
            fetchedSchedules = await fetchAutomations(
              currentDeviceId,
              accessToken
            );
            scheduleType = 1;
          }

          setSchedules((prev) => ({
            ...prev,
            [currentDeviceId]: {
              type: scheduleType,
              schedules: fetchedSchedules,
            },
          }));
        }
      } catch (error) {
        console.error('스케줄 데이터 가져오기 실패:', error);
      }
    };

    fetchModeAndSchedule();
  }, [
    sortedDeviceIds,
    currentIndex,
    accessToken,
    mainDevice,
    mainDeviceId,
    autoSchedules,
    customSchedules,
    setAutoSchedules,
    setCustomSchedules,
  ]);

  // React Query 사용해서 현재 기기 정보 가져오기
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

  // 기기 변경되면 데이터 다시 가져오기
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

  console.log('1. schedules', schedules);

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
  const currentDeviceId = sortedDeviceIds[currentIndex];
  const currentScheduleData = schedules[currentDeviceId];

  console.log(
    ' 현재 디바이스: ',
    currentDeviceId,
    ' 스케줄 내용: ',
    currentScheduleData
  );

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
            deviceId={currentDeviceId}
            scheduleData={currentScheduleData}
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
            <p className="text-[10px]">{`기기 ID: ${currentDeviceId || '없음'} (슬라이드 ${currentIndex + 1}/${deviceIds.length})`}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default DeviceSlide;
