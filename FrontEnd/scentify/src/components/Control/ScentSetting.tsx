import { mapIntToFragrance } from "../../utils/fragranceUtils";

interface ScentSettingProps {
  scents: {
    scent1: number;
    scent2: number;
    scent3: number;
    scent4: number;
  };
  setScents: (scents: {
    scent1: number;
    scent2: number;
    scent3: number;
    scent4: number;
  }) => void;
  totalEnergy: number;
  defaultScentData: {
    slot1: { slot: number | null; count: number };
    slot2: { slot: number | null; count: number };
    slot3: { slot: number | null; count: number };
    slot4: { slot: number | null; count: number };
  };
}

export default function ScentSetting({
  scents,
  setScents,
  totalEnergy,
  defaultScentData,
}: ScentSettingProps) {
  const totalUsage = Object.values(scents).reduce((acc, curr) => acc + curr, 0);
  const availableEnergy = totalEnergy - totalUsage;
  console.log("향설정", defaultScentData);
  // 향 설정값 변경
  const handleScentChange = (scentKey: string, value: number) => {
    const newScents = { ...scents, [scentKey]: value };
    const newTotalUsage = Object.values(newScents).reduce(
      (acc, curr) => acc + curr,
      0
    );

    // 남은 에너지 체크
    if (newTotalUsage <= totalEnergy) {
      setScents(newScents);
    }
  };

  return (
    <div className="flex justify-center">
      <div className="flex flex-col w-[215px] h-[206px] p-2">
        <p className="mt-1 font-pre-light text-10 text-gray text-right">
          전체 {availableEnergy}/{totalEnergy}
        </p>
        <div className="space-y-3">
          {(Object.keys(scents) as Array<keyof typeof scents>).map(
            (scentKey, index) => {
              const scentNumber = parseInt(scentKey.replace("scent", ""), 10);
              const slotData =
                defaultScentData[
                  `slot${scentNumber}` as keyof typeof defaultScentData
                ];
              const scentName =
                slotData.slot !== null
                  ? mapIntToFragrance(slotData.slot)
                  : "Empty";

              return (
                <div
                  key={index}
                  className="flex justify-between items-center w-full"
                >
                  <p className="font-pre-light text-10 mr-2 whitespace-nowrap w-[63px] overflow-hidden text-ellipsis">
                    {scentName}
                  </p>

                  <div className="relative flex-1 w-[150px] h-[30px]">
                    <div className="absolute h-full bg-component rounded-lg w-full" />
                    <div
                      className="absolute h-full bg-sub rounded-lg transition-all duration-200"
                      style={{
                        width: `${(scents[scentKey] / totalEnergy) * 100}%`,
                        zIndex: 10,
                      }}
                    />
                    <input
                      type="range"
                      value={scents[scentKey]}
                      min="0"
                      max={totalEnergy}
                      step="1"
                      className="absolute w-full h-full opacity-0 cursor-pointer z-20"
                      onChange={(e) =>
                        handleScentChange(scentKey, Number(e.target.value))
                      }
                    />
                  </div>
                </div>
              );
            }
          )}
        </div>
      </div>
    </div>
  );
}
