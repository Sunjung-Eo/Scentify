import React, { useState, useEffect, useCallback } from 'react';
import SpaceTab from '../defaultscent/SpaceTab';
import SpaceDescription from '../defaultscent/SpaceDescription';
import { useControlStore } from '../../../stores/useControlStore';
import { useLocation, useNavigate } from 'react-router-dom';
import { editDefaultScent } from '../../../apis/home/editDefaultScent';
import { registCapsule } from '../../../apis/home/registCapsule';
import { fragranceMap } from '../capsule/utils/fragranceMap';
import { useQuery } from '@tanstack/react-query';
import { getCombinationById } from '../../../apis/control/getCombinationById';
import { useAuthStore } from '../../../stores/useAuthStore';
import HomeScentSetting from '../../../components/Control/HomeScentSetting';

interface FormData {
  roomType: 'small' | 'large' | null;
  scentNames: {
    slot1: string;
    slot2: string;
    slot3: string;
    slot4: string;
  };
  scentCnt: {
    slot1: number;
    slot2: number;
    slot3: number;
    slot4: number;
  };
}

interface Message {
  type: 'error' | 'success';
  text: string;
}

function EditDefaultScent() {
  const navigate = useNavigate();
  const location = useLocation();
  const { deviceId, capsuleData, defaultCombination } = location.state || {};
  const { setCompleteHandler } = useControlStore();
  const [message, setMessage] = useState<Message | null>(null);

  const [formData, setFormData] = useState<FormData>({
    roomType: null,
    scentNames: {
      slot1: fragranceMap[capsuleData?.slot1] || '',
      slot2: fragranceMap[capsuleData?.slot2] || '',
      slot3: fragranceMap[capsuleData?.slot3] || '',
      slot4: fragranceMap[capsuleData?.slot4] || '',
    },
    scentCnt: {
      slot1: 0,
      slot2: 0,
      slot3: 0,
      slot4: 0,
    },
  });

  // 기존 기본향 정보 조회
  const { data: combinationData } = useQuery({
    queryKey: ['combination', defaultCombination],
    queryFn: async () => {
      try {
        const accessToken = useAuthStore.getState().accessToken;
        const response = await getCombinationById(
          defaultCombination,
          accessToken
        );

        if (response) {
          setFormData((prev) => ({
            ...prev,
            roomType: response.roomType === 0 ? 'small' : 'large',
            scentCnt: {
              slot1: response.choice1Count,
              slot2: response.choice2Count,
              slot3: response.choice3Count,
              slot4: response.choice4Count,
            },
          }));
        }
        return response;
      } catch (error) {
        console.error('기본향 정보 조회 실패:', error);
        return null;
      }
    },
    enabled: !!defaultCombination,
    staleTime: 0,
    refetchOnWindowFocus: false,
    retry: false,
  });

  const handleRoomTypeChange = (type: 'small' | 'large' | null) => {
    setFormData((prev) => ({
      ...prev,
      roomType: type,
    }));
  };

  const handleComplete = useCallback(async () => {
    if (!formData.roomType) {
      setMessage({ type: 'error', text: '공간 크기를 선택해주세요.' });
      return;
    }

    if (!capsuleData) {
      setMessage({ type: 'error', text: '캡슐 데이터가 없습니다.' });
      return;
    }

    const roomTypeValue = formData.roomType === 'small' ? 0 : 1;

    try {
      // 1. 캡슐 정보 수정
      await registCapsule(
        deviceId,
        capsuleData.name,
        capsuleData.slot1,
        capsuleData.slot2,
        capsuleData.slot3,
        capsuleData.slot4
      );

      // 2. 기본향 설정 수정
      await editDefaultScent(deviceId, roomTypeValue, {
        id: defaultCombination,
        choice1: combinationData?.choice1 || 0,
        choice1Count: formData.scentCnt.slot1,
        choice2: combinationData?.choice2 || 0,
        choice2Count: formData.scentCnt.slot2,
        choice3: combinationData?.choice3 || 0,
        choice3Count: formData.scentCnt.slot3,
        choice4: combinationData?.choice4 || 0,
        choice4Count: formData.scentCnt.slot4,
      });

      setMessage({ type: 'success', text: '수정이 완료되었습니다.' });
      setTimeout(() => {
        navigate('/home');
      }, 1000);
    } catch (error) {
      console.error('수정 실패:', error);
      setMessage({ type: 'error', text: '수정 중 오류가 발생했습니다.' });
    }
  }, [
    deviceId,
    capsuleData,
    defaultCombination,
    formData,
    combinationData,
    navigate,
  ]);

  useEffect(() => {
    if (!deviceId) return;

    setCompleteHandler(handleComplete);

    return () => {
      setCompleteHandler(null);
    };
  }, [deviceId, handleComplete]);

  if (!combinationData && defaultCombination) {
    return <div className="content">로딩 중...</div>;
  }

  return (
    <div className="content px-4 flex flex-col items-center">
      <SpaceTab
        roomType={formData.roomType}
        setRoomType={handleRoomTypeChange}
      />
      <SpaceDescription />
      <div className="mt-8">
        <div className="flex justify-center">
          <div className="flex flex-col w-[215px] h-[206px] p-2">
            <p className="mt-1 font-pre-light text-10 text-gray text-right">
              전체 {formData.roomType === 'small' ? 3 : 6}
            </p>
            <HomeScentSetting
              scentCnt={formData.scentCnt}
              scentNames={formData.scentNames}
              setScentCnt={(newScentCnt) =>
                setFormData((prev) => ({
                  ...prev,
                  scentCnt: { ...prev.scentCnt, ...newScentCnt },
                }))
              }
              totalEnergy={formData.roomType === 'small' ? 3 : 6}
            />
          </div>
        </div>
      </div>
      {message && (
        <p
          className={`mt-4 text-12 font-pre-light self-start ${
            message.type === 'error' ? 'text-red-500' : 'text-green-500'
          }`}
        >
          {message.text}
        </p>
      )}
    </div>
  );
}

export default EditDefaultScent;
