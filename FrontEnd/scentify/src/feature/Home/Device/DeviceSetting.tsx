import { useEffect, useState } from "react";
import EditDefaultScent from "./EditDefaultScent";
import EditCapsule from "./EditCapsule";
import { useCapsuleAndDefaultScentStore } from "../../../stores/useCapsuleAndDefaultScentStore";

function DeviceSetting() {
  const { capsuleData } = useCapsuleAndDefaultScentStore();
  const [activeTab, setActiveTab] = useState("Capsule"); // 현재 활성화된 탭 상태
  const [latestCapsuleData, setLatestCapsuleData] = useState(capsuleData); // 최신 캡슐 데이터

  // 📌 캡슐 데이터가 변경될 때 최신 데이터 업데이트
  useEffect(() => {
    setLatestCapsuleData(capsuleData);
  }, [capsuleData]);

  return (
    <div className="content">
      {/* 탭 버튼 영역 */}
      <div className="flex justify-between w-[320px] h-[32px] rounded-lg border-[1px] border-brand overflow-hidden mx-auto">
        {/* 캡슐 정보 탭 */}
        <button
          onClick={() => setActiveTab("Capsule")}
          className={`w-1/2 text-12 font-pre-medium transition-all ${
            activeTab === "Capsule"
              ? "bg-brand text-white"
              : "bg-transparent text-brand"
          }`}
        >
          캡슐 정보
        </button>

        {/* 기본향 등록 탭 */}
        <button
          onClick={() => setActiveTab("DefaultScent")}
          className={`w-1/2 text-12 font-pre-medium transition-all ${
            activeTab === "DefaultScent"
              ? "bg-brand text-white"
              : "bg-transparent text-brand"
          }`}
        >
          기본향 등록
        </button>
      </div>

      {/* 콘텐츠 영역 */}
      <div className="px-8 py-8">
        {activeTab === "Capsule" && (
          <EditCapsule
            latestCapsuleData={latestCapsuleData}
            setLatestCapsuleData={setLatestCapsuleData}
          />
        )}
        {activeTab === "DefaultScent" && (
          <EditDefaultScent latestCapsuleData={latestCapsuleData} />
        )}
      </div>
    </div>
  );
}

export default DeviceSetting;
