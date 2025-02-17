import React, { useEffect } from 'react';
import HomeScentSetting from '../../../components/Control/HomeScentSetting';

const SpaceTab = ({
  setRoomType,
  roomType,
  scentCnt,
  setScentCnt,
  scentNames,
}: any) => {
  const handleTabChange = (tab: 'small' | 'large') => {
    setRoomType(tab);
  };

  // totalEnergy 변경될 때 scentCnt 조장
  const totalEnergy = roomType === 'large' ? 6 : 3;

  useEffect(() => {
    const totalUsage = Object.values(scentCnt).reduce<number>(
      (acc, curr) => acc + (curr as number),
      0
    );

    // 현재 사용량이 totalEnergy보다 크다면 조정이 필요함
    if (totalUsage > totalEnergy) {
      const scaleFactor = totalUsage > 0 ? totalEnergy / totalUsage : 1;

      const adjustedScentCnt = Object.fromEntries(
        Object.entries(scentCnt).map(([key, value]) => [
          key,
          Math.floor((value as number) * scaleFactor), // 새로운 totalEnergy에 맞춰 비율 조정
        ])
      );

      setScentCnt(adjustedScentCnt);
    }
  }, [totalEnergy, scentCnt, setScentCnt]);

  return (
    <div>
      <div className="flex gap-5 items-center mb-6">
        <h2 className="font-pre-light text-12">공간 크기</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => handleTabChange('small')}
            className={`px-4 w-[80px] h-[30px] font-pre-medium text-[12px] rounded-xl border-[1px] border-brand ${
              roomType === 'small' ? 'bg-brand text-bg' : 'text-brand'
            }`}
          >
            소형 공간
          </button>
          <button
            onClick={() => handleTabChange('large')}
            className={`px-4 w-[100px] h-[30px] font-pre-medium text-[12px] rounded-xl border-[1px] border-brand ${
              roomType === 'large' ? 'bg-brand text-bg' : 'text-brand'
            }`}
          >
            중/대형 공간
          </button>
        </div>
      </div>
      <HomeScentSetting
        scentCnt={scentCnt || { slot1: 0, slot2: 0, slot3: 0, slot4: 0 }}
        scentNames={scentNames}
        setScentCnt={setScentCnt}
        totalEnergy={roomType === 'large' ? 6 : 3} // 기본값 3
      />
    </div>
  );
};

export default SpaceTab;
