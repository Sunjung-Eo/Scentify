import React from 'react';
import ScentSetting from '../../../components/Control/HomeScentSetting';

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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-pre-light text-12">공간 크기</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => handleTabChange('small')}
            className={`px-4 w-[116px] h-[30px] font-pre-medium text-[12px] rounded-xl border-[1px] border-brand ${
              roomType === 'small'
                ? 'bg-brand text-component'
                : 'bg-white text-sub'
            }`}
          >
            소형 공간
          </button>
          <button
            onClick={() => handleTabChange('large')}
            className={`px-4 w-[130px] h-[30px] font-pre-medium text-[12px] rounded-xl border-[1px] border-brand ${
              roomType === 'large'
                ? 'bg-brand text-component'
                : 'bg-white text-sub'
            }`}
          >
            중/대형 공간
          </button>
        </div>
      </div>
      <ScentSetting
        scentCnt={scentCnt || { slot1: 0, slot2: 0, slot3: 0, slot4: 0 }}
        scentNames={scentNames}
        setScentCnt={setScentCnt}
        totalEnergy={roomType === 'large' ? 6 : 3} // 기본값 3
      />
    </div>
  );
};

export default SpaceTab;
