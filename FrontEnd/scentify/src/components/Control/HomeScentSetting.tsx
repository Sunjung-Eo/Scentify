import React, { useCallback } from 'react';
import { useEffect, useRef } from 'react';
interface ScentSCntettingProps {
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

export default function ScentSCntetting({
  scentCnt,
  scentNames,
  setScentCnt,
  totalEnergy, // 3, 6
}: ScentSCntettingProps) {
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

  // typeof : 객체를 타입으로
  // keyof : 객체 형태 타입을 유니온 타입으로
  // 즉 centsCnt 객체의 key들을 유니온 타입으로 변환
  // "slot1" | "slot2" | "slot3" | "slot4" 이 네 개의 문자열만 허용
  const handleScentChange = useCallback(
    (slot: keyof typeof scentCnt, value: number) => {
      if (!setScentCnt) {
        console.error('🚨 setScentCnt가 존재하지 않음!');
        return;
      }

      const currentSlotValue = scentCntRef.current[slot]; // ✅ 최신 상태값 참조
      const newTotalUsage =
        Object.values(scentCntRef.current).reduce(
          (acc, curr) => acc + curr,
          0
        ) -
        currentSlotValue +
        value;

      if (newTotalUsage > totalEnergy) {
        console.warn('🚨 사용량이 totalEnergy를 초과할 수 없음!');
        return;
      }

      setScentCnt((prev) => {
        const updated = { ...prev, [slot]: value };
        console.log('🛠 즉시 상태 업데이트:', updated);
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
      <div className="flex flex-col w-[215px] h-[206px] mt-3">
        <div className="space-y-3">
          {Object.keys(scentCnt).map((slot) => (
            <div key={slot} className="flex justify-between items-center">
              <p className="font-pre-light text-12 mr-2">
                {scentNames[slot as keyof typeof scentNames]}
              </p>
              <div className="relative w-[150px] h-[30px]">
                <div
                  className="absolute h-full bg-component rounded-lg"
                  style={{ width: '100%' }}
                />
                <div
                  className="absolute h-full bg-sub rounded-lg transition-all duration-200"
                  style={{
                    width: `${(scentCnt[slot as keyof typeof scentCnt] / totalEnergy) * 100}%`,
                    zIndex: 10,
                  }}
                />
                <input
                  type="range"
                  value={scentCnt[slot as keyof typeof scentCnt]}
                  min="0"
                  max={Math.min(
                    totalEnergy,
                    availableEnergy + scentCnt[slot as keyof typeof scentCnt]
                  )} // ✅ 최대 사용 가능량 보장
                  step="1"
                  className="absolute w-full h-full opacity-0 cursor-pointer z-20"
                  onChange={(e) =>
                    handleScentChange(
                      slot as keyof typeof scentCnt,
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
