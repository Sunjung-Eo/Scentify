import React, { useState, useRef, useEffect, useCallback } from "react";
import Capsule from "./Capsule";
import deviceImg from "../../../assets/images/device.svg";
import { CreateCapsuleRequest } from "./CapsuleType.ts";
import { useControlStore } from "../../../stores/useControlStore";

const RegistCapsule: React.FC = () => {
  const [name, setName] = useState<string>(""); // 입력된 기기명을 저장하는 상태 초기값은 빈 문자열
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const capsuleDataRef = useRef<CreateCapsuleRequest | null>(null); // Capsule 컴포넌트에서 전달받은 데이터를 저장하는 참조값

  // 전역 상태 관리에서 제공하는 핸들러 설정 메서드
  const { setCompleteHandler } = useControlStore(); // 완료 버튼의 동작을 정의할 수 있도록 설정

  // 기기명 입력 변경 시 호출되는 함수
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value); // 입력된 값을 상태에 저장
    setErrorMessage(""); // 에러 메시지를 초기화
  };

  // Capsule 컴포넌트에서 데이터를 받아오는 함수
  const handleCapsuleData = (data: CreateCapsuleRequest) => {
    // 전달받은 데이터를 Ref에 저장하고, name도 포함
    capsuleDataRef.current = { ...data, name: name || "" };
  };

  // 완료 버튼 클릭 시 호출되는 함수
  const handleSubmit = useCallback(async () => {
    console.log("handleSubmit 호출됨");
    console.log("현재 캡슐 데이터:", capsuleDataRef.current);

    // 입력 데이터 유효성 검사
    if (
      !name ||
      capsuleDataRef.current?.slot1 === undefined ||
      capsuleDataRef.current?.slot2 === undefined ||
      capsuleDataRef.current?.slot3 === undefined ||
      capsuleDataRef.current?.slot4 === undefined
    ) {
      setErrorMessage("이름과 모든 슬롯을 선택해주세요."); // 에러 메시지 설정
      return;
    }

    // 서버로 전송할 최종 데이터 생성
    const finalRequestData = { ...capsuleDataRef.current, name };

    // 서버 요청 로직 (주석 처리 - 서버 연결 시 활성화)
    /*
    try {
      const response = await fetch("/v1/device/capsules", {
        method: "POST", 
        headers: {
          "Content-Type": "application/json",  // JSON 형식으로 데이터 전송
        },
        body: JSON.stringify(finalRequestData), // JSON 형식으로 직렬화
      });

         // 응답 상태에 따른 처리
    if (response.ok) {
      setSuccessMessage("캡슐 등록이 완료되었습니다."); // 성공 메시지 설정
    } else {
      setErrorMessage("캡슐 등록에 실패했습니다."); // 실패 메시지 설정
    }
  } catch (error) {
    // 네트워크 오류 처리
    setErrorMessage("네트워크 오류가 발생했습니다.");
  }
}, [name]);
    */
  }, [name]); // name이 변경될 때만 새로 정의

  // 완료 버튼에 handleSubmit을 연결
  useEffect(() => {
    setCompleteHandler(handleSubmit); // Header의 완료 버튼 클릭 시 handleSubmit 호출
    return () => {
      setCompleteHandler(null); // 언마운트 시 핸들러 초기화
    };
  }, [setCompleteHandler, handleSubmit]); // 의존성 배열에 핸들러와 설정 메서드를 추가

  return (
    <div>
      <div className="content px-4 flex flex-col items-center">
        {/* 기기명 입력 필드 */}
        <input
          type="text"
          value={name} // 입력된 이름 값을 상태에서 가져옴
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
};

export default RegistCapsule;
