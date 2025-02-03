// import { useState } from "react";

// interface ScentSettingProps {
//   scents: {
//     scent1: number;
//     scent2: number;
//     scent3: number;
//     scent4: number;
//   };
//   setScents: (scents: any) => void;
//   totalEnergy: number;
// }

// export default function ScentSetting({
//   scents,
//   setScents,
//   totalEnergy,
// }: ScentSettingProps) {
//   const totalUsage = Object.values(scents).reduce((acc, curr) => acc + curr, 0);
//   const availableEnergy = totalEnergy - totalUsage;

//   // 향 설정값 변경
//   const handleScentChange = (scent: string, value: number) => {
//     const newScents = { ...scents, [scent]: value };
//     const newTotalUsage = Object.values(newScents).reduce(
//       (acc, curr) => acc + curr,
//       0
//     );

//     // 남은 에너지 체크
//     if (newTotalUsage <= totalEnergy) {
//       setScents(newScents);
//     }
//   };

//   return (
//     <div className="flex justify-center">
//       <div className="flex flex-col w-[215px] h-[206px] p-2">
//         <p className="mt-1 font-pre-light text-10 text-gray text-right">
//           전체 {availableEnergy}/{totalEnergy}
//         </p>
//         <div className="space-y-3">
//           {Object.keys(scents).map((scent, index) => (
//             <div key={index} className="flex justify-between items-center">
//               <p className="font-pre-light text-12 mr-2">{scent}</p>
//               <div className="relative w-[150px] h-[30px]">
//                 {/* 게이지 배경 */}
//                 <div
//                   className="absolute h-full bg-component rounded-lg"
//                   style={{ width: "100%" }}
//                 />
//                 {/* 채워지는 게이지 */}
//                 <div
//                   className="absolute h-full bg-sub rounded-lg transition-all duration-200"
//                   style={{
//                     width: `${(scents[scent] / totalEnergy) * 100}%`,
//                     zIndex: 10,
//                   }}
//                 />

//                 {/* 슬라이더 */}
//                 <input
//                   type="range"
//                   value={scents[scent]}
//                   min="0"
//                   max={totalEnergy}
//                   step="1"
//                   className="absolute w-full h-full opacity-0 cursor-pointer z-20"
//                   onChange={(e) =>
//                     handleScentChange(scent, Number(e.target.value))
//                   }
//                 />
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }
import { useState } from "react";
import { mapIntToFragrance } from "../../utils/fragranceUtils";

interface ScentSettingProps {
  scents: { [key: number]: number };
  setScents: (scents: { [key: number]: number }) => void;
  totalEnergy: number;
}

export default function ScentSetting({
  scents,
  setScents,
  totalEnergy,
}: ScentSettingProps) {
  const totalUsage = Object.values(scents).reduce((acc, curr) => acc + curr, 0);
  const availableEnergy = totalEnergy - totalUsage;

  // 향 설정값 변경
  const handleScentChange = (scent: number, value: number) => {
    const newScents = { ...scents, [scent]: value };
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
          {Object.keys(scents).map((scentKey, index) => {
            const scentName = mapIntToFragrance(Number(scentKey)); // 숫자를 향기 이름으로 변환
            return (
              <div key={index} className="flex justify-between items-center">
                <p className="font-pre-light text-12 mr-2">{scentName}</p>
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
                      width: `${(scents[Number(scentKey)] / totalEnergy) * 100}%`,
                      zIndex: 10,
                    }}
                  />

                  {/* 슬라이더 */}
                  <input
                    type="range"
                    value={scents[Number(scentKey)]}
                    min="0"
                    max={totalEnergy}
                    step="1"
                    className="absolute w-full h-full opacity-0 cursor-pointer z-20"
                    onChange={(e) =>
                      handleScentChange(
                        Number(scentKey),
                        Number(e.target.value)
                      )
                    }
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
