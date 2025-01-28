import { useState } from "react";
import ScentSetting from "../../../components/Control/HomeScentSetting";

const SmallSpace = () => {
  const [scents, setScents] = useState({
    scent1: 0,
    scent2: 0,
    scent3: 0,
    scent4: 0,
  });
  const totalEnergy = 3; // 소형 공간의 에너지 값

  return (
    <div>
      <ScentSetting
        scents={scents}
        setScents={setScents}
        totalEnergy={totalEnergy}
      />
    </div>
  );
};

const LargeSpace = () => {
  const [scents, setScents] = useState({
    scent1: 0,
    scent2: 0,
    scent3: 0,
    scent4: 0,
  });
  const totalEnergy = 6; // 중/대형 공간의 에너지 값

  return (
    <div>
      <ScentSetting
        scents={scents}
        setScents={setScents}
        totalEnergy={totalEnergy}
      />
    </div>
  );
};

const SpaceTab = () => {
  const [activeTab, setActiveTab] = useState<"small" | "large">("small");
  // useState에 small과 large 두 값만 허용
  const handleTabChange = (tab: "small" | "large") => {
    setActiveTab(tab);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-pre-regular text-[12px]">공간 크기</h2>
        {/* 두 버튼 */}
        <div className="flex space-x-2">
          <button
            onClick={() => handleTabChange("small")}
            className={`px-4 w-[116px] h-[30px] font-pre-medium text-[12px] rounded-xl border-[1px] border-brand ${
              activeTab === "small"
                ? "bg-brand text-component border-[1px]"
                : "bg-white text-sub border-[1px]"
            }`}
          >
            소형 공간
          </button>
          <button
            onClick={() => handleTabChange("large")}
            className={`px-4 w-[130px] h-[30px] font-pre-medium text-[12px] rounded-xl border-[1px] border-brand ${
              activeTab === "large"
                ? "bg-brand text-component border-[1px]"
                : "bg-white text-sub border-[1px]"
            }`}
          >
            중/대형 공간
          </button>
        </div>
      </div>

      <div>
        {activeTab === "small" && <SmallSpace />}
        {activeTab === "large" && <LargeSpace />}
      </div>
    </div>
  );
};

export default SpaceTab;
