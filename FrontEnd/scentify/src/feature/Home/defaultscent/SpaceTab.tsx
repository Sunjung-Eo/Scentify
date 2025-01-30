import React, { useState } from "react";
import ScentSetting from "../../../components/Control/HomeScentSetting";
import { useCapsuleAndDefaultScentStore } from "../../../stores/useCapsuleAndDefaultScentStore";
import { mapIntToFragrance } from "../../../utils/fragranceUtils";

// SpacceTab은 전역 상태를 활용하여 현재 등록된 캡슐의 향기 정보를 불러옴.
//scents - 현재 선택된 기본향 데이터, setScents - 기본향 데이터를 업데이트하는 함수
const SpaceTab = ({ scents, setScents }: any) => {
  const [activeTab, setActiveTab] = useState<"small" | "large">("small"); // 현재 선택된 공간 크기 탭 상태
  const { capsuleData } = useCapsuleAndDefaultScentStore(); //전역 상태에서 캡슐 데이터를 가져옴 (등록된 캡슐 정보를 기반으로 기본향을 설정하기 위함)

  // 캡슐 ID를 향기 이름으로 변환 (숫자 값을 대응되는 향기로 변경)
  const scentNames = {
    slot1: mapIntToFragrance(capsuleData.slot1 || 0), // 슬롯 1의 향기
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
            className={`px-4 w-[116px] h-[30px] font-pre-medium text-[12px] rounded-xl border-[1px] border-brand ${
              activeTab === "small"
                ? "bg-brand text-component"
                : "bg-white text-sub"
            }`}
          >
            소형 공간
          </button>
          <button
            onClick={() => handleTabChange("large")}
            className={`px-4 w-[130px] h-[30px] font-pre-medium text-[12px] rounded-xl border-[1px] border-brand ${
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
          scents={scents} // 현재 선택된 향기의 사용량(count)
          scentNames={scentNames} // 캡슐 데이터 기반 향기 이름 매핑
          setScents={setScents} // 향기 데이터 업데이트 함수
          totalEnergy={3} // 소형 공간 총 에너지
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

export default SpaceTab;
