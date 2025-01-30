import React, { useState, useEffect } from "react";
import Capsule from "../capsule/Capsule";
import deviceImg from "../../../assets/images/device.svg";
import { useCapsuleAndDefaultScentStore } from "../../../stores/useCapsuleAndDefaultScentStore";
import { useControlStore } from "../../../stores/useControlStore";

interface EditCapsuleProps {
  latestCapsuleData: {
    deviceName: string;
    slot1: number;
    slot2: number;
    slot3: number;
    slot4: number;
  };
  setLatestCapsuleData: (data: {
    deviceName: string;
    slot1: number;
    slot2: number;
    slot3: number;
    slot4: number;
  }) => void;
}

function EditCapsule({
  latestCapsuleData,
  setLatestCapsuleData,
}: EditCapsuleProps) {
  const { updateCapsuleData } = useCapsuleAndDefaultScentStore();
  const { setCompleteHandler } = useControlStore();

  // 📌 최신 캡슐 데이터를 사용하여 초기 상태 설정
  const [capsuleSlots, setCapsuleSlots] = useState({
    slot1: latestCapsuleData.slot1,
    slot2: latestCapsuleData.slot2,
    slot3: latestCapsuleData.slot3,
    slot4: latestCapsuleData.slot4,
  });

  const [errorMessage, setErrorMessage] = useState<string>("");

  // ✅ 캡슐 데이터 변경 시 즉시 업데이트 (완료 버튼 없이)
  const handleCapsuleDataChange = (data: typeof capsuleSlots) => {
    setCapsuleSlots(data);
  };

  // ✅ `useEffect`를 사용하여 `capsuleSlots`가 변경될 때만 상태 업데이트
  useEffect(() => {
    const updatedCapsuleData = {
      deviceName: latestCapsuleData.deviceName,
      slot1: capsuleSlots.slot1,
      slot2: capsuleSlots.slot2,
      slot3: capsuleSlots.slot3,
      slot4: capsuleSlots.slot4,
    };

    setLatestCapsuleData(updatedCapsuleData); // 부모 컴포넌트 (DeviceSetting) 상태 업데이트
    updateCapsuleData(updatedCapsuleData); // 전역 상태 업데이트
  }, [capsuleSlots]); // 🔹 `capsuleSlots` 변경 시만 실행

  return (
    <div>
      {/* 기기명 표시 */}
      <div className="text-center text-lg font-pre-medium mb-5">
        {latestCapsuleData.deviceName}
      </div>

      {/* 기기 이미지 */}
      <img
        src={deviceImg}
        alt="device"
        className="w-32 h-32 mx-auto mt-5 mb-8"
      />

      {/* 캡슐 슬롯 설정 */}
      <Capsule
        name={latestCapsuleData.deviceName}
        onSubmit={handleCapsuleDataChange} // ✅ 변경된 데이터가 즉시 반영됨
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
