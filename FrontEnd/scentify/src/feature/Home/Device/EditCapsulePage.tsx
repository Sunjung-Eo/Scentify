import React, { useState } from "react";
import EditCapsule from "./EditCapsule.tsx";
import deviceImg from "../../../assets/images/device.svg";

const EditCapsulePage = () => {
  // 기존 캡슐 데이터를 상태로 관리
  const [slotData, setSlotData] = useState({
    slot1: 0, // 초기값 예시 (숫자로 제공)
    slot2: 3,
    slot3: 5,
    slot4: 7,
  });

  // 수정된 데이터를 업데이트하는 함수
  const handleUpdate = (updatedData: {
    slot1: number;
    slot2: number;
    slot3: number;
    slot4: number;
  }) => {
    setSlotData(updatedData);
    console.log("수정된 데이터:", updatedData); // 확인용 로그
  };

  return (
    <div>
      <h1 className="text-center text-lg font-pre-medium mb-5">캡슐 수정</h1>
      <img
        src={deviceImg}
        alt="device"
        className="w-32 h-32 mx-auto mt-5 mb-8"
      />
      <EditCapsule slotData={slotData} onUpdate={handleUpdate} />
    </div>
  );
};

export default EditCapsulePage;
