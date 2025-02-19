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
  // 향 설정값 변경
  const handleScentChange = (scentKey: keyof typeof scents, value: number) => {
    const currentValue = scents[scentKey];
    const newScents = {
      ...scents,
      [scentKey]: currentValue === value ? 0 : value,
    };
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
      <div className="flex flex-col w-full h-[206px] ml-[50px] mr-[50px] p-2">
        <p className="mt-1 mb-1 font-pre-light text-10 text-gray text-right">
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
                  <div className="flex gap-1 w-[210px]">
                    {Array.from({ length: totalEnergy }).map((_, i) => (
                      <button
                        key={i}
                        className={`w-full h-[26px] rounded-lg ${
                          i < scents[scentKey] ? "bg-brand" : "bg-component"
                        }`}
                        onClick={() => handleScentChange(scentKey, i + 1)}
                      />
                    ))}
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
