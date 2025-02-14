import React from 'react';
import ScentSetting from '../../../components/Control/HomeScentSetting';

interface NoSpaceTabProps {
  roomType: 'small' | 'large' | null;
  scentCnt: { slot1: number; slot2: number; slot3: number; slot4: number };
  setScentCnt: (scentCnt: {
    slot1: number;
    slot2: number;
    slot3: number;
    slot4: number;
  }) => void;
  scentNames: { slot1: string; slot2: string; slot3: string; slot4: string };
  totalEnergy: number; // ✅ totalEnergy를 props로 받도록 변경
}

const NoSpaceTab = ({ roomType, scentCnt, setScentCnt, scentNames }: any) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6"></div>
      <ScentSetting
        scentCnt={scentCnt || { slot1: 0, slot2: 0, slot3: 0, slot4: 0 }}
        scentNames={scentNames}
        setScentCnt={setScentCnt}
        totalEnergy={roomType === 'large' ? 6 : 3} // 기본값 3
      />
    </div>
  );
};

export default NoSpaceTab;
