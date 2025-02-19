import React, { useEffect, useState } from 'react';
import deviceImg from '../../../assets/images/device.svg';
import crownIcon from '../../../assets/icons/crown-icon.svg';
import { useUserStore } from '../../../stores/useUserStore';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deviceInfo } from '../../../apis/home/deviceInfo';
import { deleteDevice } from '../../../apis/home/deleteDevice';
import { fragranceMap } from '../capsule/utils/fragranceMap';
import { setMainDevice } from '../../../apis/home/setMainDevice';
import NoDeviceCard from './components/NoDeviceCard';
import { homeInfo } from '../../../apis/home/homeInfo';
interface Device {
  id: number;
  name: string;
  slot1: string;
  slot2: string;
  slot3: string;
  slot4: string;
  isRepresentative?: boolean;
}

const DeviceCard = () => {
  const { deviceIdsAndNames, mainDeviceId } = useUserStore();
  const queryClient = useQueryClient();
  const [currentMainDeviceId, setCurrentMainDeviceId] = useState<number | null>(
    mainDeviceId
  );

  const deviceIds = deviceIdsAndNames
    ? Object.keys(deviceIdsAndNames).map(Number)
    : [];

  // mainDeviceId가 변경될 때마다 내부 상태 업데이트
  useEffect(() => {
    setCurrentMainDeviceId(mainDeviceId);
  }, [mainDeviceId]);

  const validDeviceIds = deviceIds ?? []; // 가능한 deviceIds

  // validDeviceIds가 비어있을 때 NoDeviceCard 표시
  if (validDeviceIds.length === 0) {
    return <NoDeviceCard />;
  }

  // ✅ React Query를 사용하여 현재 선택된 기기의 정보 가져오기
  const {
    data, // 빈 배열 선언해서 오류 방지
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['deviceInfo', validDeviceIds],
    queryFn: () => deviceInfo(validDeviceIds),
    enabled: validDeviceIds.length > 0, // 기기가 있을 때만 API 호출
    staleTime: 0,
    refetchOnWindowFocus: false,
  });

  const devices = data?.devices ?? [];

  // 기기 정렬 함수 추가
  const sortedDevices = [...devices].sort((a: Device, b: Device) => {
    // null 체크 추가
    if (!currentMainDeviceId) return 0;
    if (Number(a.id) === currentMainDeviceId) return -1;
    if (Number(b.id) === currentMainDeviceId) return 1;
    return 0;
  });

  // 삭제 뮤테이션
  const deleteMutation = useMutation({
    mutationFn: deleteDevice,
    onSuccess: async (_, deviceId) => {
      try {
        // 🔥 기존 캐시 무효화
        await queryClient.invalidateQueries({ queryKey: ['deviceInfo'] });
        await queryClient.invalidateQueries({ queryKey: ['homeInfo'] });

        // 기기가 남아있는지 확인
        const remainingDeviceIds = validDeviceIds.filter(
          (id) => id !== deviceId
        );

        if (remainingDeviceIds.length === 0) {
          // 마지막 기기가 삭제된 경우
          setCurrentMainDeviceId(null);
          return;
        }

        // 기기가 남아있는 경우에만 새로운 데이터 fetch (fetchQuery 사용)
        const [updatedHomeInfo] = await Promise.all([
          queryClient.fetchQuery({
            queryKey: ['homeInfo'],
            queryFn: () => homeInfo(),
          }),
        ]);

        // homeInfo에서 mainDeviceId 가져오기
        const newMainDeviceId = updatedHomeInfo?.user?.mainDeviceId ?? null;
        setCurrentMainDeviceId(newMainDeviceId);
      } catch (error) {
        console.error('데이터 업데이트 실패:', error);
      }
    },
    onError: (error: any) => {
      console.error('디바이스 삭제 실패:', error);
      if (error.status === 401) {
        alert('관리자가 아니므로 기기를 삭제할 수 없습니다.');
      } else {
        alert('디바이스 삭제에 실패했습니다.');
      }
    },
  });

  // 대표기기설정 뮤테이션 추가
  const setMainDeviceMutation = useMutation({
    mutationFn: setMainDevice,
    onSuccess: (_, deviceId) => {
      // 내부 상태 업데이트
      setCurrentMainDeviceId(deviceId);

      // API 호출 성공 시 캐시 업데이트
      queryClient.setQueryData(
        ['deviceInfo', validDeviceIds],
        (oldData: any) => {
          if (!oldData) return { devices: [] };
          return {
            ...oldData,
            devices: oldData.devices.map((d: any) => ({
              ...d,
              isRepresentative: d.id === deviceId,
            })),
          };
        }
      );
      // 성공 메시지 표시
      alert('대표기기가 설정되었습니다.');
    },
    onError: (error) => {
      console.error('대표기기 설정 실패:', error);
      alert('대표기기 설정에 실패했습니다.');
    },
  });

  if (isLoading) {
    return <p className="text-brand">기기 정보를 불러오는 중...</p>;
  }

  if (isError || !devices || devices.length === 0) {
    // isError의 경우에도 일단 NoDeviceCard 표시
    return <NoDeviceCard />;
  }

  // devices가 있을 때
  // device는 devices 랑 데이터 같음 [{...}, {...}, {...}]
  return (
    <div className="cards w-full space-y-4">
      {sortedDevices.map((device: any, index: number) => (
        <div
          key={device.id || index}
          className="font-pre-medium flex justify-center transition-all duration-700 ease-in-out"
          style={{
            transform: `translateY(${device.id === currentMainDeviceId ? '0' : '0'}px)`,
            opacity:
              deleteMutation.isPending && deleteMutation.variables === device.id
                ? 0
                : 1,
          }}
        >
          <div
            className={`relative flex h-[110px] w-full flex-col justify-center rounded-3xl bg-brand p-4 shadow-md transition-all duration-500 ${
              device.id === currentMainDeviceId ? 'ring-2 ring-brand' : ''
            }`}
          >
            <img
              src={deviceImg}
              alt="Device Icon"
              className="absolute -left-2 bottom-0 w-30 h-30"
            />

            {/* 텍스트 내용 */}
            <div className="ml-24 flex flex-col gap-1">
              {/* 디바이스 이름 + 왕관 아이콘 */}
              <div className="text-pre-bold text-sm flex items-center gap-1 text-white">
                {device.name}
                {device.id === currentMainDeviceId && (
                  <img
                    src={crownIcon}
                    alt="Crown Icon"
                    className="ml-1 h-4 w-4"
                  />
                )}
              </div>

              {/* 장착된 향 표시 */}
              <div className="font-pre-light text-[10px] text-bg">
                <p>
                  {[device.slot1, device.slot2, device.slot3, device.slot4]
                    .map((slot) => fragranceMap[slot])
                    .join(', ')}
                </p>
              </div>
            </div>

            {/* 버튼 영역 */}
            <div className="mt-auto flex justify-end gap-2">
              <button
                onClick={() => setMainDeviceMutation.mutate(device.id)}
                disabled={device.id === currentMainDeviceId}
                className={`text-pre-medium rounded-lg px-2 py-1 text-[10px] transition-colors ${
                  device.id === currentMainDeviceId
                    ? 'bg-gray-400 text-white cursor-not-allowed opacity-50'
                    : 'border border-brand bg-component text-sub hover:bg-brand hover:text-white'
                }`}
              >
                대표기기로 설정
              </button>
              <button
                onClick={() => deleteMutation.mutate(device.id)}
                className="text-pre-medium rounded-lg bg-component px-2 py-1 text-[10px] text-sub"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DeviceCard;
