import React, { useState } from 'react';
import cuttingdeviceImg from '../../../assets/images/cuttingdevice2.svg';
import crownIcon from '../../../assets/icons/crown-icon.svg';
import { useUserStore } from '../../../stores/useUserStore';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { deviceInfo } from '../../../apis/home/deviceInfo';

const DeviceCard = () => {
  const { deviceIds } = useUserStore();
  const queryClient = useQueryClient();

  const validDeviceIds = deviceIds ?? []; // 가능한 deviceIds

  // ✅ React Query를 사용하여 현재 선택된 기기의 정보 가져오기
  const {
    data, // 빈 배열 선언해서 오류 방지
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['deviceInfo', validDeviceIds],
    queryFn: () => deviceInfo(validDeviceIds),
    enabled: validDeviceIds.length > 0,
    staleTime: 0,
    refetchOnWindowFocus: false,
  });

  const devices = data?.devices ?? [];

  // 🔹 삭제 버튼 클릭 핸들러 (React Query 캐시 업데이트)
  const handleDelete = (deviceId: number) => {
    queryClient.setQueryData(['deviceInfo', validDeviceIds], (oldData: any) => {
      if (!oldData) return [];
      return oldData.filter((d: any) => d.deviceId !== deviceId);
    });
  };

  // 🔹 대표기기 설정 핸들러 (React Query 캐시 업데이트)
  const handleSetRepresentative = (deviceId: number) => {
    queryClient.setQueryData(['deviceInfo', validDeviceIds], (oldData: any) => {
      if (!oldData) return [];
      return oldData.map((d: any) =>
        d.deviceId === deviceId
          ? { ...d, isRepresentative: true }
          : { ...d, isRepresentative: false }
      );
    });
  };

  if (isLoading)
    return <p className="text-brand">기기 정보를 불러오는 중...</p>;
  if (isError)
    return <p className="text-red-500">기기 정보를 불러오지 못했습니다.</p>;

  return (
    <div className="cards space-y-4">
      {devices.map((device: any, index: number) => (
        <div
          key={device.id || index}
          className="relative mt-4 flex justify-end"
        >
          <div className="card relative flex h-[120px] w-[290px] flex-col rounded-3xl bg-sub px-4 py-2 shadow-md">
            {/* 디바이스 사진 */}
            <img
              src={cuttingdeviceImg}
              alt="Device Icon"
              className="absolute -left-11 bottom-0"
            />

            {/* 텍스트 내용 */}
            <div className="ml-12 flex flex-col gap-1">
              {/* 디바이스 이름 + 왕관 아이콘 */}
              <div className="text-pre-bold text-sm flex items-center gap-1 text-white">
                {device.name}
                {device.id === validDeviceIds[0] && (
                  <img
                    src={crownIcon}
                    alt="Crown Icon"
                    className="ml-1 h-4 w-4"
                  />
                )}
              </div>

              {/* 장착된 향 표시 */}
              <div className="text-pre-regular text-[9px] text-gray">
                <p>
                  {device.slot1}, {device.slot2}, {device.slot3}, {device.slot4}
                </p>
              </div>

              {/* 예약 모드 표시 */}
              <div className="flex items-center">
                <div className="border flex items-center rounded-full border-component px-3 py-0.5 text-[8px] text-component">
                  예약 모드
                  <span className="ml-1 h-1 w-1 rounded-full bg-green-500"></span>
                </div>
              </div>
            </div>

            {/* 버튼 영역 */}
            <div className="mt-auto flex justify-end gap-2">
              <button
                onClick={() => {
                  queryClient.setQueryData(
                    ['deviceInfo', validDeviceIds],
                    (oldData: any) => {
                      if (!oldData) return { devices: [] };
                      return {
                        ...oldData,
                        devices: oldData.devices.map((d: any) =>
                          d.id === device.id
                            ? { ...d, isRepresentative: true }
                            : { ...d, isRepresentative: false }
                        ),
                      };
                    }
                  );
                }}
                className={`text-pre-medium rounded-lg px-2 py-1 text-[10px] ${
                  device.isRepresentative
                    ? 'bg-brand text-white'
                    : 'border border-brand bg-component text-sub'
                }`}
              >
                대표기기로 설정
              </button>
              <button
                onClick={() => {
                  queryClient.setQueryData(
                    ['deviceInfo', validDeviceIds],
                    (oldData: any) => {
                      if (!oldData) return { devices: [] };
                      return {
                        ...oldData,
                        devices: oldData.devices.filter(
                          (d: any) => d.id !== device.id
                        ),
                      };
                    }
                  );
                }}
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
