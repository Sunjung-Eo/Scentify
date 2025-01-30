import React, { useEffect, useState } from "react";
import SpaceDescription from "./SpaceDescription";
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
  const { defaultScentData, previousScentData, updateDefaultScentData } =
    useCapsuleAndDefaultScentStore();

  const isCapsuleChanged =
    latestCapsuleData.slot1 !== previousScentData.slot1.slot ||
    latestCapsuleData.slot2 !== previousScentData.slot2.slot ||
    latestCapsuleData.slot3 !== previousScentData.slot3.slot ||
    latestCapsuleData.slot4 !== previousScentData.slot4.slot;

  // ✅ 캡슐이 변경되면 count를 0으로 초기화, 변경되지 않으면 기존 count 유지
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
