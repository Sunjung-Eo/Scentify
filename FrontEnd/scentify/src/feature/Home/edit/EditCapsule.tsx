import React, { useState, useEffect, useCallback, useRef } from 'react';
import Capsule from '../capsule/Capsule';
import deviceImg from '../../../assets/images/device.svg';
import { useControlStore } from '../../../stores/useControlStore';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { deviceInfo } from '../../../apis/home/deviceInfo';
import { CreateCapsuleRequest } from '../capsule/capsuletypes';

interface Message {
  type: 'error' | 'success';
  text: string;
}

function EditCapsule() {
  const navigate = useNavigate();
  const location = useLocation();
  const { deviceId, initialData } = location.state || {};
  const { setCompleteHandler } = useControlStore();
  const [message, setMessage] = useState<Message | null>(null);

  // ✅ 이전 상태 저장 (useRef 활용해서 리렌더링 방지)
  const prevDeviceData = useRef<CreateCapsuleRequest | null>(null);

  // ✅ `deviceData` 로드되면 채움
  const [formData, setFormData] = useState<{
    capsuleData: CreateCapsuleRequest | null;
  }>({
    capsuleData: initialData
      ? {
          name: initialData.name || '',
          slot1: initialData.slot1,
          slot2: initialData.slot2,
          slot3: initialData.slot3,
          slot4: initialData.slot4,
        }
      : null,
  });

  const { data: deviceData } = useQuery({
    queryKey: ['deviceInfo', deviceId],
    queryFn: async () => {
      try {
        const response = await deviceInfo(deviceId);
        return response.devices?.[0] || null;
      } catch (error) {
        console.error('디바이스 정보 조회 실패:', error);
        return null;
      }
    },
    enabled: !!deviceId,
    staleTime: 0,
    refetchOnWindowFocus: false,
    retry: false,
  });

  // ✅ `useEffect`에서 `setFormData` 실행 시 이전 값과 비교 후 업데이트
  useEffect(() => {
    if (!deviceData) return;

    const newCapsuleData: CreateCapsuleRequest = {
      name: deviceData.name || '',
      slot1: deviceData.slot1,
      slot2: deviceData.slot2,
      slot3: deviceData.slot3,
      slot4: deviceData.slot4,
    };

    // ✅ 기존 값과 비교 후 변경이 있을 때만 `setFormData` 실행
    if (
      JSON.stringify(prevDeviceData.current) !== JSON.stringify(newCapsuleData)
    ) {
      setFormData({ capsuleData: newCapsuleData });
      prevDeviceData.current = newCapsuleData; // 🔥 이전 값 저장하여 변경 감지
    }
  }, [deviceData]);

  console.log(
    '🫢🫢 formData: ',
    formData.capsuleData,
    ' deviceId: ',
    deviceId,
    ' defaultCombination: ',
    deviceData?.defaultCombination
  );

  // ✅ `handleSubmit`을 `useCallback`으로 감싸기 (메모이제이션)
  const handleSubmit = useCallback(() => {
    console.log('🔥 handleSubmit 실행됨!');

    if (!deviceId || !formData.capsuleData) {
      setMessage({ type: 'error', text: '필요한 데이터가 없습니다.' });
      return;
    }

    const navigationState = {
      name: formData.capsuleData.name || '',
      deviceId,
      capsuleData: formData.capsuleData,
      defaultCombination: deviceData?.defaultCombination,
    };

    console.log('🚀 Navigating with state:', navigationState);
    navigate('/home/devicesetting/defaultscent', { state: navigationState });
  }, [deviceId, formData.capsuleData, navigate]);

  // ✅ `useEffect`에서 `setCompleteHandler(handleSubmit)`을 실행하지만, `handleSubmit`이 변경될 때만 업데이트
  useEffect(() => {
    if (!deviceId) return;

    console.log('✅ setCompleteHandler 등록됨! handleSubmit:', handleSubmit);
    setCompleteHandler(handleSubmit);

    return () => {
      setCompleteHandler(null);
    };
  }, [handleSubmit, setCompleteHandler]);

  if (!deviceData) {
    return <div className="content">로딩 중...</div>;
  }

  return (
    <div className="content px-4 flex flex-col items-center">
      <input
        type="text"
        value={formData.capsuleData?.name || ''}
        onChange={(e) =>
          setFormData((prev) => {
            const newName = e.target.value;
            if (prev.capsuleData?.name === newName) return prev; // 🔥 변경 없으면 상태 업데이트 안 함
            return {
              capsuleData: prev.capsuleData
                ? { ...prev.capsuleData, name: newName }
                : null,
            };
          })
        }
        className="w-[220px] h-[34px] p-2 mb-4 rounded-[8px] bg-component focus:outline-none"
      />
      <img
        src={deviceImg}
        alt="device"
        className="w-32 h-32 mx-auto mt-5 mb-8"
      />
      <Capsule
        name={formData.capsuleData?.name || ''}
        onSubmit={(data) =>
          setFormData((prev) => {
            if (JSON.stringify(prev.capsuleData) === JSON.stringify(data))
              return prev; // 🔥 변경 없으면 상태 업데이트 안 함
            return { capsuleData: data };
          })
        }
        initialData={formData.capsuleData || undefined}
      />
      {message && (
        <p
          className={`mt-4 text-12 ${
            message.type === 'error' ? 'text-red-500' : 'text-green-500'
          }`}
        >
          {message.text}
        </p>
      )}
    </div>
  );
}
export default EditCapsule;
