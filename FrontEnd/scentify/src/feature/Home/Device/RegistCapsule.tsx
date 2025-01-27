import React, { useState, useRef, useEffect, useCallback } from "react";
import Capsule from "./Capsule"; // Capsule 컴포넌트 임포트
import deviceImg from "../../../assets/images/device.svg";
import { CreateCapsuleRequest } from "./CapsuleType.ts";
import { useControlStore } from "../../../stores/useControlStore"; // Store 임포트

const RegistCapsule: React.FC = () => {
  const [name, setName] = useState<string>(""); // 기기명 상태(빈 문자열로 초기화)
  const [responseMessage, setResponseMessage] = useState<string>(""); // 서버 응답 메시지
  const capsuleDataRef = useRef<CreateCapsuleRequest | null>(null); // Capsule 데이터를 참조할 Ref

  // `useControlStore`로 completeHandler 설정해 완료 버튼 클릭 시 handleSubmit이 호출
  // useEffect로 컴포넌트 마운트 시 핸들러를 등록하고, 언마운트 시 핸들러를 초기화
  const { setCompleteHandler } = useControlStore();

  // 이름 입력 핸들러
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  // Capsule 컴포넌트에서 데이터를 저장하는 함수, Capsule 컴포넌트의 데이터를 수집하고, 이름과 슬롯 값이 유효할 때만 서버로 요청
  const handleCapsuleData = (data: CreateCapsuleRequest) => {
    capsuleDataRef.current = { ...data, name: name || "" }; // Ref에 캡슐 데이터를 저장
  };

  // 완료 버튼 클릭 시 호출 (useCallback으로 안정성 유지)
  const handleSubmit = useCallback(() => {
    console.log("handleSubmit 호출됨");
    console.log("현재 캡슐 데이터:", capsuleDataRef.current);
    // 이름과 슬롯 데이터 유효성 검사
    if (
      !name ||
      capsuleDataRef.current?.slot1 === undefined ||
      capsuleDataRef.current?.slot2 === undefined ||
      capsuleDataRef.current?.slot3 === undefined ||
      capsuleDataRef.current?.slot4 === undefined
    ) {
      alert("이름과 모든 슬롯을 선택해주세요.");
      return;
    }

    const finalRequestData = { ...capsuleDataRef.current, name };

    // 서버 요청 로직 (예: axios)
    console.log("등록 요청 데이터:", finalRequestData);
    setResponseMessage("캡슐 등록 요청이 전송되었습니다.");
  }, [name]); // `name`이 변경될 때만 함수 참조 변경

  // `useEffect`로 completeHandler를 설정
  useEffect(() => {
    setCompleteHandler(handleSubmit); // Header의 완료 버튼 클릭 시 handleSubmit 호출
    return () => {
      setCompleteHandler(null); // 컴포넌트 언마운트 시 핸들러 초기화
    };
  }, [setCompleteHandler, handleSubmit]); // `handleSubmit` 의존성 추가

  return (
    <div>
      <div>
        <div className="content px-4 flex flex-col items-center">
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            placeholder="기기명을 입력하세요."
            className="w-[220px] h-[34px] p-2 mb-4 text-lg text-center rounded bg-component focus:outline-none"
          />
          <img
            src={deviceImg}
            alt="device"
            className="w-32 h-32 mx-auto mt-5 mb-8"
          />

          {/* 캡슐 컴포넌트에 name 전달 */}
          <Capsule name={name} onSubmit={handleCapsuleData} />

          {/* 서버 응답 메시지 */}
          {responseMessage && (
            <p className="mt-4 text-center text-sm">{responseMessage}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegistCapsule;
