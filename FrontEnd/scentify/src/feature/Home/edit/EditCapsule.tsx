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
  const { deviceId } = location.state || {};
  const { setCompleteHandler } = useControlStore();
  const [message, setMessage] = useState<Message | null>(null);
  const capsuleDataRef = useRef<CreateCapsuleRequest | null>(null); // 최신 `Capsule` 데이터 저장용 `useRef`
  const [name, setName] = useState<string>(''); // 캡슐 이름 저장
  const [capsuleState, setCapsuleState] = useState<CreateCapsuleRequest | null>(
    null
  );

  // deviceId가 존재하면 해당 디바이스 정보 가져옴
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
    refetchOnWindowFocus: false, // 창을 다시 포커스 할때 리패치 안함
    retry: false, // 실패시 재시도 안함
  });

  console.log('🔥🔥🔥 deviceData', deviceData);
  // 디바이스 데이터 변경 시 `formData` 업데이트 (이전 값과 다를 때만 실행)
  useEffect(() => {
    if (!deviceData) return;

    const initialCapsuleData: CreateCapsuleRequest = {
      name: deviceData.name || '',
      slot1: deviceData.slot1,
      slot2: deviceData.slot2,
      slot3: deviceData.slot3,
      slot4: deviceData.slot4,
    };

    capsuleDataRef.current = initialCapsuleData; // 여기가 캡슐 업데이트
    setName(deviceData.name || ''); // 이름 업데이트
    setCapsuleState(initialCapsuleData);

    console.log('🔥🔥🔥 initialCapsuleData', initialCapsuleData);
  }, [deviceData]);

  // ✅ `Capsule` 컴포넌트에서 데이터를 받아 최신 상태 유지
  const handleCapsuleData = (data: CreateCapsuleRequest) => {
    capsuleDataRef.current = { ...data, name };
  };

  // ✅ `handleSubmit`을 `useCallback`으로 감싸기 (메모이제이션)
  const handleSubmit = useCallback(() => {
    if (!deviceId || !capsuleDataRef.current) {
      setMessage({ type: 'error', text: '필요한 데이터가 없습니다.' });
      return;
    }

    const { name, slot1, slot2, slot3, slot4 } = capsuleDataRef.current;

    if (
      !name ||
      slot1 === undefined ||
      slot2 === undefined ||
      slot3 === undefined ||
      slot4 === undefined
    ) {
      setMessage({ type: 'error', text: '이름과 모든 슬롯을 선택해주세요.' });
      return;
    }

    const navigationState = {
      name,
      deviceId,
      capsuleData: capsuleDataRef.current,
      defaultCombination: deviceData?.defaultCombination || {},
    };
    navigate('/home/edit/capsule/defaultscent', { state: navigationState });
  }, [deviceId, navigate, deviceData]);

  useEffect(() => {
    setCompleteHandler(handleSubmit);
    return () => setCompleteHandler(null);
  }, [handleSubmit, setCompleteHandler]);

  if (!deviceData) {
    return <div className="content">로딩 중...</div>;
  }

  return (
    <div className="content px-4 flex flex-col items-center">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-[220px] h-[34px] p-2 mb-4 rounded-[8px] bg-component focus:outline-none"
      />
      <img
        src={deviceImg}
        alt="device"
        className="w-32 h-32 mx-auto mt-5 mb-8"
      />
      <Capsule
        name={name}
        onSubmit={handleCapsuleData}
        initialData={capsuleState}
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
