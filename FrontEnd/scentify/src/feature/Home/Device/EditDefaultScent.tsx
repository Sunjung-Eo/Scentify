import React, { useEffect, useState } from "react";
import SpaceDescription from "./SpaceDescription";
import { useControlStore } from "../../../stores/useControlStore";
import { useCapsuleAndDefaultScentStore } from "../../../stores/useCapsuleAndDefaultScentStore";
import EditSpaceTab from "./EditSpaceTab";

function EditDefaultScent() {
  const { setCompleteHandler } = useControlStore();
  const { capsuleData, defaultScentData, updateDefaultScentData } =
    useCapsuleAndDefaultScentStore();

  //기본향 데이터가 초기 로드될 때, 캡슐데이터가 변경될 때 업데이트
  // 캡슐데이터가 변경되면 0으로 아니면 기존값으로.
  const [scents, setScents] = useState(() => ({
    slot1:
      defaultScentData.slot1.slot === capsuleData.slot1
        ? defaultScentData.slot1.count
        : 0,
    slot2:
      defaultScentData.slot2.slot === capsuleData.slot2
        ? defaultScentData.slot2.count
        : 0,
    slot3:
      defaultScentData.slot3.slot === capsuleData.slot3
        ? defaultScentData.slot3.count
        : 0,
    slot4:
      defaultScentData.slot4.slot === capsuleData.slot4
        ? defaultScentData.slot4.count
        : 0,
  }));

  //useEffect를 사용하여 capsuleData가 변경될 때마다 scents 상태를 업데이트하여 새로운 캡슐 데이터 반영
  //캡슐을 변경하면 defaultScentData.slot 값도 동기화됨
  //기존 향기 사용량(count)을 유지하거나, 새로운 슬롯이면 0으로 초기화됨
  useEffect(() => {
    setScents({
      slot1:
        defaultScentData.slot1.slot === capsuleData.slot1
          ? defaultScentData.slot1.count
          : 0,
      slot2:
        defaultScentData.slot2.slot === capsuleData.slot2
          ? defaultScentData.slot2.count
          : 0,
      slot3:
        defaultScentData.slot3.slot === capsuleData.slot3
          ? defaultScentData.slot3.count
          : 0,
      slot4:
        defaultScentData.slot4.slot === capsuleData.slot4
          ? defaultScentData.slot4.count
          : 0,
    });
  }, [capsuleData, defaultScentData]); // 캡슐 데이터가 변경될 때 실행

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

      // 기본향 데이터 업데이트
      updateDefaultScentData({
        slot1: { slot: capsuleData.slot1, count: scents.slot1 },
        slot2: { slot: capsuleData.slot2, count: scents.slot2 },
        slot3: { slot: capsuleData.slot3, count: scents.slot3 },
        slot4: { slot: capsuleData.slot4, count: scents.slot4 },
      });

      console.log("저장된 기본향 설정:", scents);
    };

    setCompleteHandler(handleComplete);

    return () => {
      setCompleteHandler(null);
    };
  }, [scents, setCompleteHandler, updateDefaultScentData, capsuleData]);

  return (
    <div className="content px-4">
      <EditSpaceTab setScents={setScents} scents={scents} />
      <div className="mt-4">
        <SpaceDescription />
      </div>
    </div>
  );
}

export default EditDefaultScent;
