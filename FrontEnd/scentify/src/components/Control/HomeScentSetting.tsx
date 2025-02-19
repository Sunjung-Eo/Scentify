import React, { useCallback } from "react";
import { useEffect, useRef } from "react";
interface HomeScentSettingProps {
  scentCnt: {
    slot1: number;
    slot2: number;
    slot3: number;
    slot4: number;
  };
  scentNames: {
    slot1: string;
    slot2: string;
    slot3: string;
    slot4: string;
  };
  setScentCnt: React.Dispatch<
    React.SetStateAction<{
      slot1: number;
      slot2: number;
      slot3: number;
      slot4: number;
    }>
  >;
  totalEnergy: number;
}

export default function HomeScentSetting({
  scentCnt,
  scentNames,
  setScentCnt,
  totalEnergy, // 3, 6
}: HomeScentSettingProps) {
  if (!scentCnt || !scentNames) {
    return null;
  }

  // scentsCnt 객체에 저장된 모든 값(향 분사 횟수)의 합을 계산
  const totalUsage = Object.values(scentCnt).reduce(
    (acc, curr) => acc + curr,
    0
  );
  const availableEnergy = totalEnergy - totalUsage;

  const scentCntRef = useRef(scentCnt);

  useEffect(() => {
    scentCntRef.current = scentCnt;
  }, [scentCnt]);

  const handleScentChange = useCallback(
    (slot: keyof typeof scentCnt, value: number) => {
      if (!setScentCnt) {
        return;
      }

      const currentSlotValue = scentCntRef.current[slot]; // 최신 상태값 참조
      const newTotalUsage =
        Object.values(scentCntRef.current).reduce(
          (acc, curr) => acc + curr,
          0
        ) -
        currentSlotValue +
        value;

      if (newTotalUsage > totalEnergy) {
        return;
      }

      setScentCnt((prev) => {
        const updated = {
          ...prev,
          [slot]: currentSlotValue === value ? 0 : value,
        };
        return updated;
      });
    },
    [setScentCnt, totalEnergy]
  );

  return (
    <div className="flex flex-col items-center">
      <p className="mt-1 font-pre-light text-12 self-start">
        전체 {availableEnergy}/{totalEnergy}
      </p>
      <div className="flex flex-col w-full h-[206px] mt-3">
        <div className="space-y-3">
          {Object.keys(scentCnt).map((slot) => (
            <div key={slot} className="flex justify-between items-center">
              <p className="font-pre-light text-12 mr-2 text-gray whitespace-nowrap">
                {scentNames[slot as keyof typeof scentNames]}
              </p>
              <div className="flex gap-1 w-[210px]">
                {Array.from({ length: totalEnergy }).map((_, i) => (
                  <button
                    key={i}
                    className={`w-full h-[26px] ${
                      i === 0
                        ? "rounded-l-lg"
                        : i === totalEnergy - 1
                          ? "rounded-r-lg"
                          : ""
                    } ${
                      i < scentCnt[slot as keyof typeof scentCnt]
                        ? "bg-brand"
                        : "bg-component"
                    }`}
                    onClick={() =>
                      handleScentChange(slot as keyof typeof scentCnt, i + 1)
                    }
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
