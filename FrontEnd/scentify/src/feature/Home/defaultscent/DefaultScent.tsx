import React, { useEffect, useState } from 'react';
import SpaceTab from './SpaceTab';
import SpaceDescription from './SpaceDescription';
import { useControlStore } from '../../../stores/useControlStore';
import { useLocation, useNavigate } from 'react-router-dom';
import { registDefaultScent } from '../../../apis/home/registDefaultScent';
import { fragranceMap } from '../capsule/utils/fragranceMap';

function DefaultScent() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id, name, slot1, slot2, slot3, slot4 } = location.state || {};

  // console.log(
  //   '캡슐등록한것',
  //   id,
  //   '/',
  //   name,
  //   '/',
  //   slot1,
  //   '/',
  //   slot2,
  //   '/',
  //   slot3,
  //   '/',
  //   slot4
  // );
  const { setCompleteHandler } = useControlStore(); // 완료 버튼 핸들러 설정

  // 문자열일 가능성 있으니, 숫자로 변환
  // const safeSlot1 = Number(slot1) || 0;
  // const safeSlot2 = Number(slot2) || 0;
  // const safeSlot3 = Number(slot3) || 0;
  // const safeSlot4 = Number(slot4) || 0;

  // ✅ 공간 크기 상태 추가
  const [roomType, setRoomType] = useState<'small' | 'large' | null>(null);

  // ✅ 향 슬롯이 변하지 않도록 고정
  // scentNames를 문자열로 변환
  const [scentNames] = useState({
    slot1: fragranceMap[slot1],
    slot2: fragranceMap[slot2],
    slot3: fragranceMap[slot3],
    slot4: fragranceMap[slot4],
  });

  // ✅ 향 사용량을 설정하는 상태 (초기 상태에서 `totalEnergy`를 넘지 않도록 보정)
  const [scentCnt, setScentCnt] = useState(() => {
    return {
      slot1: 0,
      slot2: 0,
      slot3: 0,
      slot4: 0,
    };
  });

  // console.log(
  //   '캡슐 슬롯 숫자 변환',
  //   id,
  //   '/',
  //   name,
  //   '/',
  //   slot1,
  //   '/',
  //   slot2,
  //   '/',
  //   slot3,
  //   '/',
  //   slot4
  // );

  // 완료버튼 클릭 시 공간 크기 미선택 경고
  // ✅ 완료 버튼 클릭 시 공간 크기 미선택 경고
  const handleComplete = async () => {
    const roomTypeValue = roomType === 'small' ? 0 : 1;

    try {
      await registDefaultScent(
        id,
        slot1,
        scentCnt.slot1,
        slot2,
        scentCnt.slot2,
        slot3,
        scentCnt.slot3,
        slot4,
        scentCnt.slot4,
        roomTypeValue
      );
      console.log('기본향 설정 완료:', scentCnt);
      navigate('/home');
    } catch (error) {
      console.error('기본향 설정 실패:', error);
      alert('기본향 설정 중 오류가 발생했습니다.');
    }
  };

  useEffect(() => {
    setCompleteHandler(handleComplete);
    return () => {
      setCompleteHandler(null);
    };
  }, [scentCnt, setCompleteHandler, roomType]);

  return (
    <div className="content px-4">
      <SpaceTab
        setRoomType={setRoomType}
        roomType={roomType}
        scentCnt={scentCnt}
        setScentCnt={setScentCnt}
        scentNames={scentNames}
      />
      {!roomType && (
        <p className="text-red-500 text-12 font-pre-light self-start">
          공간 크기를 먼저 선택해주세요.
        </p>
      )}
      <div className="mt-4">
        <SpaceDescription />
      </div>
    </div>
  );
}

export default DefaultScent;
