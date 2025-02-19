import React, { useState, useRef, useEffect, useCallback } from 'react';
import Capsule from './Capsule.tsx';
import deviceImg from '../../../assets/images/device.svg';
import { CreateCapsuleRequest } from './capsuletypes.ts';
import { useControlStore } from '../../../stores/useControlStore.ts';
import { useLocation, useNavigate } from 'react-router-dom';
import { registCapsule } from '../../../apis/home/registCapsule.ts';

interface Message {
  type: 'error' | 'success';
  text: string;
}

function RegistCapsule() {
  const location = useLocation(); // state로 전달한 데이터를 가져올 때`
  const navigate = useNavigate();
  const { id } = location.state || {};
  const [name, setName] = useState<string>('');
  const [message, setMessage] = useState<Message | null>(null);
  const capsuleDataRef = useRef<CreateCapsuleRequest | null>(null); // Capsule 컴포넌트에서 받은 데이터를 저장하는 참조값
  const { setCompleteHandler } = useControlStore(); // 완료 버튼 핸들러 설정

  // 기기명 입력 시 상태 업데이트
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (message) setMessage(null);
    if (capsuleDataRef.current) {
      capsuleDataRef.current.name = e.target.value; // Ref 최신 상태 유지
    }
  };

  // ✅ 캡슐 데이터 수신 (정확한 데이터 저장)
  const handleCapsuleData = (data: CreateCapsuleRequest) => {
    capsuleDataRef.current = { ...data, name };
  };

  // API 호출
  const handleSubmit = useCallback(async () => {
    if (!id) {
      setMessage({ type: 'error', text: '기기 정보가 없습니다.' });
      return;
    }

    const capsuleData = capsuleDataRef.current;
    if (!capsuleData) {
      setMessage({ type: 'error', text: '캡슐 데이터를 찾을 수 없습니다.' });
      return;
    }

    const { name, slot1, slot2, slot3, slot4 } = capsuleData;

    if (!name || slot1 === -1 || slot2 === -1 || slot3 === -1 || slot4 === -1) {
      setMessage({ type: 'error', text: '이름과 모든 슬롯을 선택해주세요.' });
      return;
    }

    try {
      await registCapsule(id, name, slot1, slot2, slot3, slot4);
      setMessage({ type: 'success', text: '캡슐 등록이 완료되었습니다.' });

      setTimeout(() => {
        navigate('/home/defaultscent', {
          state: { id, name, slot1, slot2, slot3, slot4 },
        });
      }, 1000);
    } catch (error) {
      console.error('캡슐 등록 실패:', error);
      setMessage({ type: 'error', text: '캡슐 등록 중 오류가 발생했습니다.' });
    }
  }, [id, navigate]);

  useEffect(() => {
    setCompleteHandler(handleSubmit);
    return () => setCompleteHandler(null);
  }, [handleSubmit, setCompleteHandler]);

  return (
    <div>
      <div className="content px-4 flex flex-col items-center">
        {/* 기기명 입력 필드 */}
        <input
          type="text"
          value={name}
          onChange={handleNameChange}
          placeholder="기기명을 입력하세요."
          className="w-[220px] h-[34px] p-2 mb-4 font-pre-light text-16 text-center rounded-[8px] bg-component focus:outline-none font-pre-light text-12 placeholder:font-pre-light placeholder:text-12"
        />
        {/* 기기 이미지 */}
        <img
          src={deviceImg}
          alt="device"
          className="w-32 h-32 mx-auto mt-5 mb-8"
        />

        {/* Capsule 컴포넌트 */}
        <Capsule name={name} onSubmit={handleCapsuleData} />

        {/* 메시지 표시 */}
        <div className="flex text-12 w-full px-4">
          {message && (
            <p
              className={`mt-2 text-12 font-pre-light ${
                message.type === 'error' ? 'text-red-500' : 'text-[#626D42]'
              }`}
            >
              {message.text}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default RegistCapsule;
