// import { useEffect } from "react";
// import { mapIntToFragrance } from "../../utils/fragranceUtils";

// // interface ScentSettingProps {
// //   scents: { [key: number]: number };
// //   setScents: (scents: { [key: number]: number }) => void;
// //   totalEnergy: number;
// // }
// interface ScentSettingProps {
//   scents: {
//     choice1: number | null;
//     choice1Count: number;
//     choice2: number | null;
//     choice2Count: number;
//     choice3: number | null;
//     choice3Count: number;
//     choice4: number | null;
//     choice4Count: number;
//   };
//   setScents: (scents: {
//     choice1: number | null;
//     choice1Count: number;
//     choice2: number | null;
//     choice2Count: number;
//     choice3: number | null;
//     choice3Count: number;
//     choice4: number | null;
//     choice4Count: number;
//   }) => void;
//   totalEnergy: number;
//   defaultScentData: {
//     slot1: { slot: number | null; count: number };
//     slot2: { slot: number | null; count: number };
//     slot3: { slot: number | null; count: number };
//     slot4: { slot: number | null; count: number };
//   };
// }

// export default function ScentSetting({
//   scents,
//   setScents,
//   totalEnergy,
//   defaultScentData,
// }: ScentSettingProps) {
//   const totalUsage = Object.entries(scents)
//     .filter(([key]) => key.includes("Count"))
//     .reduce((acc, [_, value]) => acc + (value as number), 0);
//   const availableEnergy = totalEnergy - totalUsage;
//   // 향 설정값 변경
//   const handleScentChange = (scentKey: string, value: number) => {
//     const newScents = { ...scents };
//     console.log(totalEnergy, totalUsage);
//     console.log(newScents);

//     if (scentKey.includes("Count")) {
//       const newTotalUsage =
//         Object.entries(newScents)
//           .filter(([key]) => key.includes("Count"))
//           .reduce((acc, [_, val]) => acc + (val as number), 0) -
//         newScents[scentKey as keyof typeof scents] +
//         value;

//       if (newTotalUsage <= totalEnergy) {
//         newScents[scentKey as keyof typeof scents] = value;
//         setScents(newScents);
//       }
//     }
//   };

//   // 디폴트 향
//   useEffect(() => {
//     const initialScents = {
//       choice1: defaultScentData.slot1.slot,
//       choice1Count: defaultScentData.slot1.count,
//       choice2: defaultScentData.slot2.slot,
//       choice2Count: defaultScentData.slot2.count,
//       choice3: defaultScentData.slot3.slot,
//       choice3Count: defaultScentData.slot3.count,
//       choice4: defaultScentData.slot4.slot,
//       choice4Count: defaultScentData.slot4.count,
//       // [defaultScentData.slot1.slot]: defaultScentData.slot1.count,
//       // [defaultScentData.slot2.slot]: defaultScentData.slot2.count,
//       // [defaultScentData.slot3.slot]: defaultScentData.slot3.count,
//       // [defaultScentData.slot4.slot]: defaultScentData.slot4.count,
//     };
//     if (JSON.stringify(scents) !== JSON.stringify(initialScents)) {
//       setScents(initialScents);
//     }
//     console.log("initial", initialScents);
//     console.log("set", scents);
//   }, [defaultScentData, setScents]);

//   return (
//     <div className="flex justify-center">
//       <div className="flex flex-col w-[215px] h-[206px] p-2">
//         <p className="mt-1 font-pre-light text-10 text-gray text-right">
//           전체 {availableEnergy}/{totalEnergy}
//         </p>
//         <div className="space-y-3">
//           {Object.entries(scents)
//             .filter(([key]) => !key.includes("Count"))
//             .map(([scentKey, value], index) => {
//               const scentNumber = value;
//               const scentName = mapIntToFragrance(scentNumber);
//               const countKey = `${scentKey}Count` as keyof typeof scents;

//               return (
//                 <div
//                   key={index}
//                   className="flex justify-between items-center w-full"
//                 >
//                   <p className="font-pre-light text-10 mr-2 whitespace-nowrap w-[63px] overflow-hidden text-ellipsis">
//                     {scentName}
//                   </p>
//                   <div className="relative flex-1 w-[150px] h-[30px]">
//                     <div className="absolute h-full bg-component rounded-lg w-full" />
//                     <div
//                       className="absolute h-full bg-sub rounded-lg transition-all duration-200"
//                       style={{
//                         width: `${(scents[countKey] / totalEnergy) * 100}%`,
//                         zIndex: 10,
//                       }}
//                     />
//                     <input
//                       type="range"
//                       value={scents[countKey] ?? 0}
//                       min="0"
//                       max={totalEnergy}
//                       step="1"
//                       className="absolute w-full h-full opacity-0 cursor-pointer z-20"
//                       onChange={(e) =>
//                         handleScentChange(countKey, Number(e.target.value))
//                       }
//                     />
//                   </div>
//                 </div>
//               );
//             })}
//         </div>
//       </div>
//     </div>
//   );
// }
import { useEffect, useMemo } from "react";
import { mapIntToFragrance } from "../../utils/fragranceUtils";

// interface ScentSettingProps {
//   scents: { [key: number]: number };
//   setScents: (scents: { [key: number]: number }) => void;
//   totalEnergy: number;
// }
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
  // console.log("rrrrrrrrrrrr", defaultScentData);

  const memoizedDefaultScentData = useMemo(
    () => ({
      slot1: {
        slot: defaultScentData.slot1.slot,
        count: defaultScentData.slot1.count,
      },
      slot2: {
        slot: defaultScentData.slot2.slot,
        count: defaultScentData.slot2.count,
      },
      slot3: {
        slot: defaultScentData.slot3.slot,
        count: defaultScentData.slot3.count,
      },
      slot4: {
        slot: defaultScentData.slot4.slot,
        count: defaultScentData.slot4.count,
      },
    }),
    [defaultScentData]
  );
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
  // 디폴트: 기본향으로 설정
  useEffect(() => {
    setScents((prevScents) => ({
      scent1: prevScents.scent1 || memoizedDefaultScentData.slot1.count,
      scent2: prevScents.scent2 || memoizedDefaultScentData.slot2.count,
      scent3: prevScents.scent3 || memoizedDefaultScentData.slot3.count,
      scent4: prevScents.scent4 || memoizedDefaultScentData.slot4.count,
    }));
  }, []);

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
