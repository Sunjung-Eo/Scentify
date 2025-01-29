import React, { useState, useEffect, useCallback } from "react";
import Capsule from "./Capsule";
import deviceImg from "../../../assets/images/device.svg";
import { useCapsuleAndDefaultScentStore } from "../../../stores/useCapsuleAndDefaultScentStore";
import { useControlStore } from "../../../stores/useControlStore";

function EditCapsule() {
  const { capsuleData, updateCapsuleData } = useCapsuleAndDefaultScentStore();
  const { setCompleteHandler } = useControlStore();

  const [capsuleSlots, setCapsuleSlots] = useState({
    slot1: capsuleData.slot1,
    slot2: capsuleData.slot2,
    slot3: capsuleData.slot3,
    slot4: capsuleData.slot4,
  });
  const [errorMessage, setErrorMessage] = useState<string>("");

  // 캡슐 데이터 변경 핸들러
  const handleCapsuleDataChange = (data: typeof capsuleSlots) => {
    setCapsuleSlots(data);
  };

  // 완료 버튼 클릭 시 호출되는 함수
  const handleSubmit = useCallback(() => {
    if (
      capsuleSlots.slot1 === 0 ||
      capsuleSlots.slot2 === 0 ||
      capsuleSlots.slot3 === 0 ||
      capsuleSlots.slot4 === 0
    ) {
      setErrorMessage("모든 슬롯에 향을 설정해주세요.");
      return;
    }

    // 캡슐 데이터 업데이트
    updateCapsuleData({
      deviceName: capsuleData.deviceName, // 기존 기기명 유지
      slot1: capsuleSlots.slot1,
      slot2: capsuleSlots.slot2,
      slot3: capsuleSlots.slot3,
      slot4: capsuleSlots.slot4,
    });

    // 완료 메시지 출력 및 이동
    alert("캡슐 정보가 성공적으로 수정되었습니다.");
  }, [capsuleData.deviceName, capsuleSlots, updateCapsuleData]);

  // 완료 버튼에 핸들러 연결
  useEffect(() => {
    setCompleteHandler(handleSubmit);
    return () => {
      setCompleteHandler(null); // 언마운트 시 초기화
    };
  }, [handleSubmit, setCompleteHandler]);

  return (
    <div>
      {/* 기기명 표시 */}
      <div className="text-center text-lg font-pre-medium mb-5">
        {capsuleData.deviceName}
      </div>

      {/* 기기 이미지 */}
      <img
        src={deviceImg}
        alt="device"
        className="w-32 h-32 mx-auto mt-5 mb-8"
      />

      {/* 캡슐 슬롯 설정 */}
      <Capsule
        name={capsuleData.deviceName}
        onSubmit={handleCapsuleDataChange}
        initialData={capsuleSlots}
      />

      {/* 에러 메시지 */}
      {errorMessage && (
        <p className="mt-4 text-center text-sm text-red-500">{errorMessage}</p>
      )}
    </div>
  );
}
export default EditCapsule;
