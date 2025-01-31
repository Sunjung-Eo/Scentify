import React, { useState } from "react";
import ScentSetting from "../../../components/Control/HomeScentSetting";
import { useCapsuleAndDefaultScentStore } from "../../../stores/useCapsuleAndDefaultScentStore";
import { mapIntToFragrance } from "../../../utils/fragranceUtils";

const EditSpaceTab = ({ scents, setScents }: any) => {
  const [activeTab, setActiveTab] = useState<"small" | "large">("small");
  const { capsuleData } = useCapsuleAndDefaultScentStore();

  const scentNames = {
    slot1: mapIntToFragrance(capsuleData.slot1 || 0),
    slot2: mapIntToFragrance(capsuleData.slot2 || 0),
    slot3: mapIntToFragrance(capsuleData.slot3 || 0),
    slot4: mapIntToFragrance(capsuleData.slot4 || 0),
  };

  const handleTabChange = (tab: "small" | "large") => {
    setActiveTab(tab);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-pre-regular text-[12px]">공간 크기</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => handleTabChange("small")}
            className={`w-[73px] h-[30px] font-pre-medium text-[12px] rounded-xl border-[1px] border-brand ${
              activeTab === "small"
                ? "bg-brand text-component"
                : "bg-white text-sub"
            }`}
          >
            소형 공간
          </button>
          <button
            onClick={() => handleTabChange("large")}
            className={`w-[83px] h-[30px] font-pre-medium text-[12px] rounded-xl border-[1px] border-brand ${
              activeTab === "large"
                ? "bg-brand text-component"
                : "bg-white text-sub"
            }`}
          >
            중/대형 공간
          </button>
        </div>
      </div>

      {activeTab === "small" && (
        <ScentSetting
          scents={scents}
          scentNames={scentNames}
          setScents={setScents}
          totalEnergy={3} // 소형 공간 에너지
        />
      )}
      {activeTab === "large" && (
        <ScentSetting
          scents={scents}
          scentNames={scentNames}
          setScents={setScents}
          totalEnergy={6} // 중/대형 공간 에너지
        />
      )}
    </div>
  );
};

export default EditSpaceTab;
