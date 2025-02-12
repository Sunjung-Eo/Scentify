import React, { useState, useEffect, useCallback } from 'react';
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

interface InitialData {
  name: string;
  slot1: number;
  slot2: number;
  slot3: number;
  slot4: number;
  slot1RemainingRatio: number;
  slot2RemainingRatio: number;
  slot3RemainingRatio: number;
  slot4RemainingRatio: number;
}

function EditCapsule() {
  const navigate = useNavigate();
  const location = useLocation();
  const { deviceId, initialData } = location.state || {};
  const { setCompleteHandler } = useControlStore();
  const [message, setMessage] = useState<Message | null>(null);

  const [formData, setFormData] = useState<{
    name: string;
    capsuleData: CreateCapsuleRequest | null;
  }>(() => ({
    name: initialData?.name || '',
    capsuleData: initialData
      ? {
          name: initialData.name || '',
          slot1: initialData.slot1,
          slot2: initialData.slot2,
          slot3: initialData.slot3,
          slot4: initialData.slot4,
        }
      : null,
  }));

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

  // ✅ 초기 데이터 설정 (불필요한 렌더링 방지)
  useEffect(() => {
    if (!deviceId || initialData || !deviceData) return;

    setFormData((prev) => ({
      ...prev,
      name: deviceData.name || prev.name,
      capsuleData: {
        name: deviceData.name || prev.name,
        slot1: deviceData.slot1,
        slot2: deviceData.slot2,
        slot3: deviceData.slot3,
        slot4: deviceData.slot4,
      },
    }));
  }, [deviceId, deviceData]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;

    setFormData((prev) => {
      if (prev.name === newName) return prev; // ✅ 중복 업데이트 방지
      return {
        ...prev,
        name: newName,
        capsuleData: prev.capsuleData
          ? {
              ...prev.capsuleData,
              name: newName,
            }
          : null,
      };
    });

    if (message) setMessage(null);
  };

  // ✅ 중복 업데이트 방지
  const handleCapsuleData = (data: CreateCapsuleRequest) => {
    setFormData((prev) => {
      if (
        prev.capsuleData &&
        prev.capsuleData.slot1 === data.slot1 &&
        prev.capsuleData.slot2 === data.slot2 &&
        prev.capsuleData.slot3 === data.slot3 &&
        prev.capsuleData.slot4 === data.slot4
      ) {
        return prev;
      }
      return { ...prev, capsuleData: data };
    });
  };

  const handleSubmit = useCallback(async () => {
    if (!deviceId) {
      setMessage({ type: 'error', text: '기기 정보가 없습니다.' });
      return;
    }

    if (!formData.capsuleData) {
      setMessage({ type: 'error', text: '캡슐 데이터를 찾을 수 없습니다.' });
      return;
    }

    navigate('/home/devicesetting/defaultscent', {
      state: {
        name: formData.name,
        deviceId,
        capsuleData: formData.capsuleData,
        defaultCombination: deviceData?.defaultCombination,
      },
    });
  }, [deviceId, formData, deviceData?.defaultCombination, navigate]);

  useEffect(() => {
    if (!deviceId) return;

    setCompleteHandler(handleSubmit);

    return () => {
      setCompleteHandler(null);
    };
  }, [deviceId]);

  if (!initialData && !deviceData) {
    return <div className="content">로딩 중...</div>;
  }

  return (
    <div className="content px-4 flex flex-col items-center">
      <input
        type="text"
        value={formData.name}
        onChange={handleNameChange}
        className="w-[220px] h-[34px] p-2 mb-4 rounded-[8px] bg-component focus:outline-none"
      />
      <img
        src={deviceImg}
        alt="device"
        className="w-32 h-32 mx-auto mt-5 mb-8"
      />
      <Capsule
        name={formData.name}
        onSubmit={handleCapsuleData}
        initialData={formData.capsuleData || undefined}
      />
      {message && (
        <p
          className={`mt-4 text-12 ${message.type === 'error' ? 'text-red-500' : 'text-green-500'}`}
        >
          {message.text}
        </p>
      )}
    </div>
  );
}

export default EditCapsule;
