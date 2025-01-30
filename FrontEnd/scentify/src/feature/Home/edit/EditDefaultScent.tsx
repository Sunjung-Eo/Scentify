import React, { useEffect, useState } from "react";
import SpaceDescription from "../defaultscent/SpaceDescription";
import { useControlStore } from "../../../stores/useControlStore";
import { useCapsuleAndDefaultScentStore } from "../../../stores/useCapsuleAndDefaultScentStore";
import EditSpaceTab from "./EditSpaceTab";
interface EditDefaultScentProps {
  latestCapsuleData: {
    deviceName: string;
    slot1: number;
    slot2: number;
    slot3: number;
    slot4: number;
  };
}

function EditDefaultScent({ latestCapsuleData }: EditDefaultScentProps) {
  const { setCompleteHandler } = useControlStore();
  const { previousCapsuleData, previousScentData, updateDefaultScentData } =
    useCapsuleAndDefaultScentStore();

  //  이전 캡슐 데이터와 비교하여 캡슐 변경 여부 판단
  const isCapsuleChanged =
    latestCapsuleData.slot1 !== previousCapsuleData.slot1 ||
    latestCapsuleData.slot2 !== previousCapsuleData.slot2 ||
    latestCapsuleData.slot3 !== previousCapsuleData.slot3 ||
    latestCapsuleData.slot4 !== previousCapsuleData.slot4;

  //  캡슐 변경 여부에 따라 count 값 설정
  const [scents, setScents] = useState(() => ({
    slot1: isCapsuleChanged ? 0 : previousScentData.slot1.count,
    slot2: isCapsuleChanged ? 0 : previousScentData.slot2.count,
    slot3: isCapsuleChanged ? 0 : previousScentData.slot3.count,
    slot4: isCapsuleChanged ? 0 : previousScentData.slot4.count,
  }));

  useEffect(() => {
    setScents({
      slot1: isCapsuleChanged ? 0 : previousScentData.slot1.count,
      slot2: isCapsuleChanged ? 0 : previousScentData.slot2.count,
      slot3: isCapsuleChanged ? 0 : previousScentData.slot3.count,
      slot4: isCapsuleChanged ? 0 : previousScentData.slot4.count,
    });
  }, [latestCapsuleData, previousScentData]);

  // 완료 버튼 클릭 시 handleComplete 실행
  // handleComplete는 updateDefaultScentData 함수를 호출하여
  // 현재 설정된 향기 사용량 데이터를 전역 상태에 저장
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

      updateDefaultScentData({
        slot1: { slot: latestCapsuleData.slot1, count: scents.slot1 },
        slot2: { slot: latestCapsuleData.slot2, count: scents.slot2 },
        slot3: { slot: latestCapsuleData.slot3, count: scents.slot3 },
        slot4: { slot: latestCapsuleData.slot4, count: scents.slot4 },
      });

      console.log("저장된 기본향 설정:", scents);
    };

    setCompleteHandler(handleComplete);

    return () => {
      setCompleteHandler(null);
    };
  }, [scents, setCompleteHandler, updateDefaultScentData, latestCapsuleData]);

  return (
    <div className="content px-4">
      <EditSpaceTab setScents={setScents} scents={scents} />
      <SpaceDescription />
    </div>
  );
}

export default EditDefaultScent;
