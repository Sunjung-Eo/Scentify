import { useState } from "react";

export default function ScentSetting() {
  const totalEnerge = 3; // 전체 에너지(3 or 6 입력받음)
  const [availableEnergy, setAvailableEnergy] = useState(totalEnerge); // 가용 에너지
  const [scents, setScents] = useState({
    scent1: 0, // 향1
    scent2: 0, // 향2
    scent3: 0, // 향3
    scent4: 0, // 향4
  });

  // 향 설정값 변경
  const handleScentChange = (scent: string, value: number) => {
    const newScents = { ...scents, [scent]: value };
    // 사용 에너지 갱신
    const totalUsage = Object.values(newScents).reduce(
      (acc, curr) => acc + curr,
      0
    );
    // 남은 에너지 체크
    if (totalUsage <= totalEnerge) {
      setScents(newScents);
      setAvailableEnergy(totalEnerge - totalUsage);
    }
  };

  return (
    <div className="flex justify-center">
      <div className="flex flex-col w-[215px] h-[206px] p-2">
        <p className="font-pre-light text-12 text-lightgray text-right">
          전체 {availableEnergy}/{totalEnerge}
        </p>
        <div className="space-y-4 mt-2">
          {Object.keys(scents).map((scent, index) => (
            <div key={index} className="flex justify-between items-center">
              <p className="font-pre-light text-12 mr-2">{scent}</p>
              <div className="relative w-[150px] h-[30px]">
                {/* 게이지 배경 */}
                <div
                  className="absolute h-full bg-component rounded-lg"
                  style={{ width: "100%" }}
                />
                {/* 채워지는 게이지 */}
                <div
                  className="absolute h-full bg-sub rounded-lg transition-all duration-200"
                  style={{
                    width: `${(scents[scent] / totalEnerge) * 100}%`,
                    zIndex: 10,
                  }}
                />

                {/* 슬라이더 */}
                <input
                  type="range"
                  value={scents[scent]}
                  min="0"
                  max={totalEnerge}
                  step="1"
                  className="absolute w-full h-full opacity-0 cursor-pointer z-20"
                  onChange={(e) =>
                    handleScentChange(scent, Number(e.target.value))
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
