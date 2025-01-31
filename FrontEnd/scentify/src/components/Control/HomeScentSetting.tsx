import React from "react";

interface ScentSettingProps {
  scents: {
    // 사용자가 설정한 향기 사용량(count) 데이터
    slot1: number;
    slot2: number;
    slot3: number;
    slot4: number;
  };
  scentNames: {
    // 캡슐 슬롯별 향기 이름 매핑
    slot1: string;
    slot2: string;
    slot3: string;
    slot4: string;
  };
  setScents: (scents: {
    // 향기 사용량(count) 변경 함수
    slot1: number;
    slot2: number;
    slot3: number;
    slot4: number;
  }) => void;
  totalEnergy: number;
}

export default function ScentSetting({
  scents,
  scentNames,
  setScents,
  totalEnergy,
}: ScentSettingProps) {
  const totalUsage = Object.values(scents).reduce((acc, curr) => acc + curr, 0);
  const availableEnergy = totalEnergy - totalUsage;

  const handleScentChange = (slot: keyof typeof scents, value: number) => {
    const newScents = { ...scents, [slot]: value };
    const newTotalUsage = Object.values(newScents).reduce(
      (acc, curr) => acc + curr,
      0
    );

    if (newTotalUsage <= totalEnergy) {
      setScents(newScents);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <p className="mt-1 font-pre-light text-12 self-start">
        전체 {availableEnergy}/{totalEnergy}
      </p>
      <div className="flex flex-col w-[215px] h-[206px] mt-3">
        <div className="space-y-3">
          {Object.keys(scents).map((slot) => (
            <div key={slot} className="flex justify-between items-center">
              <p className="font-pre-light text-12 mr-2">
                {scentNames[slot as keyof typeof scentNames]}
              </p>
              <div className="relative w-[150px] h-[30px]">
                <div
                  className="absolute h-full bg-component rounded-lg"
                  style={{ width: "100%" }}
                />
                <div
                  className="absolute h-full bg-sub rounded-lg transition-all duration-200"
                  style={{
                    width: `${
                      (scents[slot as keyof typeof scents] / totalEnergy) * 100
                    }%`,
                    zIndex: 10,
                  }}
                />
                <input
                  type="range"
                  value={scents[slot as keyof typeof scents]}
                  min="0"
                  max={totalEnergy}
                  step="1"
                  className="absolute w-full h-full opacity-0 cursor-pointer z-20"
                  onChange={(e) =>
                    handleScentChange(
                      slot as keyof typeof scents,
                      Number(e.target.value)
                    )
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
