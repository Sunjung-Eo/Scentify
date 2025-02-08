import React, { useState, useRef, useEffect, useCallback } from 'react';
import Capsule from './Capsule.tsx';
import deviceImg from '../../../assets/images/device.svg';
import { CreateCapsuleRequest } from './capsuletypes.ts';
import { useControlStore } from '../../../stores/useControlStore.ts';
import { useLocation, useNavigate } from 'react-router-dom';
import { registCapsule } from '../../../apis/home/registCapsule.ts';

function RegistCapsule() {
  const location = useLocation(); // state로 전달한 데이터를 가져올 때`
  const navigate = useNavigate();
  const { id } = location.state || {};
  const [name, setName] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const capsuleDataRef = useRef<CreateCapsuleRequest | null>(null); // Capsule 컴포넌트에서 받은 데이터를 저장하는 참조값
  const { setCompleteHandler } = useControlStore(); // 완료 버튼 핸들러 설정

  // 기기명 입력 시 상태 업데이트
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value); // 입력된 값을 상태에 저장
    if (errorMessage) setErrorMessage('');
  };

  // 캡슐 데이터 수신 (Capsule 컴포넌트에서 전달된 데이터가 capsuleDataRef.current에 저장)
  const handleCapsuleData = (data: CreateCapsuleRequest) => {
    // 전달받은 데이터를 Ref에 저장하고, name도 포함(캡슐 데이터가 변경될때  Ref에 저장)
    capsuleDataRef.current = { ...data, name: name || '' };
  };

  // API 호출
  const handleSubmit = useCallback(async () => {
    console.log('handleSubmit 호출됨');
    console.log('현재 캡슐 데이터:', capsuleDataRef.current);

    if (!id) {
      setErrorMessage('기기 정보가 없습니다.');
      return;
    }

    const capsuleData = capsuleDataRef.current;
    if (!capsuleData) {
      setErrorMessage('캡슐 데이터를 찾을 수 없습니다.');
      return;
    }

    const { name, slot1, slot2, slot3, slot4 } = capsuleData;
    if (
      !name ||
      slot1 === undefined ||
      slot2 === undefined ||
      slot3 === undefined ||
      slot4 === undefined
    ) {
      setErrorMessage('이름과 모든 슬롯을 선택해주세요.');
      return;
    }

    try {
      await registCapsule(id, name, slot1, slot2, slot3, slot4);
      setSuccessMessage('캡슐 등록이 완료되었습니다.');

      setTimeout(() => {
        navigate('/home/defaultscent', {
          state: { id, name, slot1, slot2, slot3, slot4 },
        });
      }, 1000);
    } catch (error) {
      console.error('캡슐 등록 실패:', error);
      setErrorMessage('캡슐 등록 중 오류가 발생했습니다.');
    }
  }, [id, navigate]);

  useEffect(() => {
    setCompleteHandler(handleSubmit);
    return () => {
      setCompleteHandler(null);
    };
  }, [handleSubmit, setCompleteHandler]);

  // useEffect(() => {
  //   setCompleteHandler(() => handleSubmit);
  //   return () => setCompleteHandler(null);
  // }, [handleSubmit, setCompleteHandler]);

  return (
    <div>
      <div className="content px-4 flex flex-col items-center">
        {/* 기기명 입력 필드 */}
        <input
          type="text"
          value={name} // 상태로부터 기기명 가져오기
          onChange={handleNameChange} // 입력 변경 시 핸들러 호출
          placeholder="기기명을 입력하세요."
          className="w-[220px] h-[34px] p-2 mb-4 text-lg text-center rounded bg-component focus:outline-none"
        />
        {/* 기기 이미지 */}
        <img
          src={deviceImg}
          alt="device"
          className="w-32 h-32 mx-auto mt-5 mb-8"
        />

        {/* Capsule 컴포넌트 */}
        <Capsule name={name} onSubmit={handleCapsuleData} />

        {/* 에러 메시지 표시 */}
        {errorMessage && (
          <p className="mt-4 text-center text-sm text-red-500">
            {errorMessage}
          </p>
        )}

        {/* 성공 메시지 표시 */}
        {successMessage && (
          <p className="mt-4 text-center text-sm text-green-500">
            {successMessage}
          </p>
        )}
      </div>
    </div>
  );
}

export default RegistCapsule;
