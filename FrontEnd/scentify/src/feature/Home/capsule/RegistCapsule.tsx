import React, { useState, useRef, useEffect, useCallback } from "react";
import Capsule from "./Capsule.tsx";
import deviceImg from "../../../assets/images/device.svg";
import { CreateCapsuleRequest } from "./capsuletypes.ts";
import { useControlStore } from "../../../stores/useControlStore.ts";
import { useCapsuleAndDefaultScentStore } from "../../../stores/useCapsuleAndDefaultScentStore.ts";
import { useNavigate } from "react-router-dom";

// 로직: 완료 버튼을 누르면 handleSubmit이 호출
// handleSubmit은 useEffect를 통해 완료 버튼의 동작(핸들러)으로 연결
// handleSubmit 내부에서 입력된 데이터(name과 capsuleDataRef.current)가 유효한지 검사.
// 유효성 검사가 통과되면 useCapsuleStore의 updateRecentCapsule 함수를 호출하여 기기명,캡슐 데이터를 저장(useCapsuleStore를 통해 상태 업데이트)
// 성공메시지 표시

function RegistCapsule() {
  const [name, setName] = useState<string>(""); // 입력된 기기명을 저장하는 상태 초기값은 빈 문자열
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const capsuleDataRef = useRef<CreateCapsuleRequest | null>(null); // Capsule 컴포넌트에서 받은 데이터를 저장하는 참조값
  const navigate = useNavigate(); //완료버튼 클릭 시 페이지이동

  // 전역 상태 관리에서 제공하는 핸들러 설정 메서드
  const { setCompleteHandler } = useControlStore(); // 완료 버튼 핸들러 설정
  const { updateCapsuleData } = useCapsuleAndDefaultScentStore.getState(); //스토어에서 켑슐상태업데이트 함수 가져오기

  // 기기명 입력 시 상태 업데이트
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value); // 입력된 값을 상태에 저장
    if (errorMessage) setErrorMessage(""); // 에러 메시지 초기화
  };

  // handleCapsuleData로 캡슐 데이터 수신 (Capsule 컴포넌트에서 전달된 데이터가 capsuleDataRef.current에 저장)
  const handleCapsuleData = (data: CreateCapsuleRequest) => {
    // 전달받은 데이터를 Ref에 저장하고, name도 포함(캡슐 데이터가 변경될때  Ref에 저장)
    capsuleDataRef.current = { ...data, name: name || "" };
  };

  // 완료 버튼 클릭 시 호출되는 함수
  //(handleSubmit에서 캡슐 데이터 유효성 검사를 수행후,유효하면 useCapsuleStore의 updateRecentCapsule을 호출해 상태를 업데이트)
  const handleSubmit = useCallback(() => {
    console.log("handleSubmit 호출됨");
    console.log("현재 캡슐 데이터:", capsuleDataRef.current);
    if (
      !name ||
      capsuleDataRef.current?.slot1 === undefined ||
      capsuleDataRef.current?.slot2 === undefined ||
      capsuleDataRef.current?.slot3 === undefined ||
      capsuleDataRef.current?.slot4 === undefined
    ) {
      setErrorMessage("이름과 모든 슬롯을 선택해주세요.");
      return;
    }
    // 서버로 전송할 최종 데이터 생성
    const finalRequestData = { ...capsuleDataRef.current, name };

    //스토어에 캡슐데이터 업데이트
    updateCapsuleData({
      deviceName: finalRequestData.name, // 기기명
      slot1: finalRequestData.slot1, // 슬롯 1 데이터
      slot2: finalRequestData.slot2, // 슬롯 2 데이터
      slot3: finalRequestData.slot3, // 슬롯 3 데이터
      slot4: finalRequestData.slot4, // 슬롯 4 데이터
    });
    // 성공 메시지
    setSuccessMessage("캡슐 등록이 완료되었습니다.");
    // 5초 후 페이지 이동
    setTimeout(() => {
      navigate("/home/defaultscent"); // 유효성 검사를 통과한 경우에만 이동
    }, 1000);
  }, [name, navigate, updateCapsuleData]);

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
