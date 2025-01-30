import React, { useEffect, useState } from "react";
import SpaceTab from "./SpaceTab";
import SpaceDescription from "./SpaceDescription";
import { useControlStore } from "../../../stores/useControlStore";
import { useCapsuleAndDefaultScentStore } from "../../../stores/useCapsuleAndDefaultScentStore";
import { useNavigate } from "react-router-dom";

function DefaultScent() {
  const navigate = useNavigate();
  const { setCompleteHandler } = useControlStore(); // 완료 버튼 핸들러
  const { updateDefaultScentData } = useCapsuleAndDefaultScentStore(); // 기본향 데이터를 업데이트하는 함수

  // scents는 향기의 사용량(count)
  const [scents, setScents] = useState({
    slot1: 0,
    slot2: 0,
    slot3: 0,
    slot4: 0,
  });

  // 완료 버튼이 클릭되었을 때 실행되는 핸들러 함수
  // - 사용자가 모든 에너지를 할당했는지 검증
  // - 기본향 데이터를 저장
  useEffect(() => {
    const handleComplete = () => {
      const totalEnergy = Object.values(scents).reduce(
        (sum, val) => sum + val,
        0
      );

      if (totalEnergy === 0) {
        alert("모든 에너지를 할당해주세요.");
        return;
      }

      // 전역 상태에 기본향 데이터 저장
      updateDefaultScentData({
        slot1: { slot: scents.slot1, count: scents.slot1 },
        slot2: { slot: scents.slot2, count: scents.slot2 },
        slot3: { slot: scents.slot3, count: scents.slot3 },
        slot4: { slot: scents.slot4, count: scents.slot4 },
      });

      console.log("저장된 기본향 설정:", scents);

      // 기본향 설정 완료 후 홈 페이지로 이동
      navigate("/home");
    };

    setCompleteHandler(handleComplete);

    return () => {
      setCompleteHandler(null); // 언마운트 시 초기화
    };
  }, [scents, setCompleteHandler, updateDefaultScentData, navigate]);

  return (
    <div className="content px-4">
      <SpaceTab setScents={setScents} scents={scents} />
      <div className="mt-4">
        <SpaceDescription />
      </div>
    </div>
  );
}

export default DefaultScent;
