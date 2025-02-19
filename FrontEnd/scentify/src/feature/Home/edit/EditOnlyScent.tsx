import React, { useEffect, useState, useCallback } from 'react';
import NoSpaceTab from './NoSpaceTab';
import SpaceDescription from '../defaultscent/SpaceDescription';
import { useControlStore } from '../../../stores/useControlStore';
import { useLocation, useNavigate } from 'react-router-dom';
import { editDefaultScent } from '../../../apis/home/editDefaultScent';
import { getCombinationById } from '../../../apis/control/getCombinationById';
import { fragranceMap } from '../capsule/utils/fragranceMap';
import { useAuthStore } from '../../../stores/useAuthStore';
import Alert from '../../../components/Alert/Alert';

interface Message {
  type: 'error' | 'success';
  text: string;
}

function EditOnlyScent() {
  const navigate = useNavigate();
  const location = useLocation();
  const { deviceId, defaultCombination } = location.state || {};
  const { setCompleteHandler } = useControlStore();
  const [message, setMessage] = useState<Message | null>(null);
  const accessToken = useAuthStore.getState().accessToken; // ✅ 토큰 가져오기
  const [combinationData, setCombinationData] = useState<any>(null); // ✅ 조합 데이터 상태
  const [loading, setLoading] = useState(true); // ✅ 로딩 상태 추가
  const [roomType, setRoomType] = useState<'small' | 'large' | null>(null); // ✅ 공간 크기
  const [totalEnergy, setTotalEnergy] = useState(3);
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    message: '',
    onConfirm: () => {},
    showButtons: true,
  });

  useEffect(() => {
    if (deviceId) {
      localStorage.setItem('deviceId', deviceId); // ✅ `deviceId` 유지
    }
  }, [deviceId]);

  useEffect(() => {
    if (!defaultCombination || !accessToken) {
      setLoading(false);
      return;
    }

    const fetchCombinationData = async () => {
      try {
        setLoading(true);

        const data = await getCombinationById(defaultCombination, accessToken);
        // console.log('기본향 데이터 요청:', data);

        if (!data) {
          throw new Error('조합 데이터를 찾을 수 없습니다.');
        }

        setCombinationData(data); // ✅ API 응답 저장

        // ✅ roomType을 choiceCount 합으로 결정
        const totalCount =
          (data.choice1Count || 0) +
          (data.choice2Count || 0) +
          (data.choice3Count || 0) +
          (data.choice4Count || 0);

        const detectedRoomType = totalCount === 6 ? 'large' : 'small';
        setRoomType(detectedRoomType);
        setTotalEnergy(detectedRoomType === 'large' ? 6 : 3);
      } catch (error) {
        console.error('기본향 불러오는데 실패:', error);
        setMessage({
          type: 'error',
          text: '조합 데이터를 불러오는데 실패했습니다.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCombinationData();
  }, [defaultCombination, accessToken]);

  const [scentNames, setScentNames] = useState({
    slot1: '',
    slot2: '',
    slot3: '',
    slot4: '',
  });

  useEffect(() => {
    if (combinationData) {
      setScentNames({
        slot1: fragranceMap[combinationData.choice1] || '',
        slot2: fragranceMap[combinationData.choice2] || '',
        slot3: fragranceMap[combinationData.choice3] || '',
        slot4: fragranceMap[combinationData.choice4] || '',
      });
    }
  }, [combinationData]); // ✅ `useEffect`에서 `scentNames` 업데이트

  // ✅ `scentCnt`도 `useState`로 유지하여 안정적인 렌더링 보장
  const [scentCnt, setScentCnt] = useState({
    slot1: 0,
    slot2: 0,
    slot3: 0,
    slot4: 0,
  });

  useEffect(() => {
    if (combinationData) {
      setScentCnt({
        slot1: combinationData.choice1Count || 0,
        slot2: combinationData.choice2Count || 0,
        slot3: combinationData.choice3Count || 0,
        slot4: combinationData.choice4Count || 0,
      });
    }
  }, [combinationData]); // `useEffect`에서 `scentCnt` 업데이트

  const handleComplete = useCallback(async () => {
    // 향 설정 검증
    const totalUsage = Object.values(scentCnt).reduce(
      (acc, curr) => acc + curr,
      0
    );
    if (totalUsage === 0) {
      setAlertConfig({
        message: '향을 하나 이상 설정해주세요.',
        onConfirm: () => setShowAlert(false),
        showButtons: true,
      });
      setShowAlert(true);
      return;
    }

    try {
      if (!deviceId || !combinationData) return;

      const updatedCombination = {
        id: defaultCombination,
        choice1: combinationData.choice1,
        choice1Count: scentCnt.slot1,
        choice2: combinationData.choice2,
        choice2Count: scentCnt.slot2,
        choice3: combinationData.choice3,
        choice3Count: scentCnt.slot3,
        choice4: combinationData.choice4,
        choice4Count: scentCnt.slot4,
      };

      await editDefaultScent(deviceId, updatedCombination);
      console.log('🍀기본향 수정 성공 id:', updatedCombination);

      setAlertConfig({
        message: '기본향 설정이 완료되었습니다.',
        onConfirm: () => {
          setShowAlert(false);
          navigate('/home');
        },
        showButtons: true,
      });
      setShowAlert(true);
    } catch (error) {
      console.error('수정 실패:', error);
      setAlertConfig({
        message: '수정 중 오류가 발생했습니다.',
        onConfirm: () => setShowAlert(false),
        showButtons: true,
      });
      setShowAlert(true);
    }
  }, [
    deviceId,
    combinationData,
    scentCnt,
    defaultCombination,
    navigate,
    roomType,
  ]);

  useEffect(() => {
    if (!deviceId) return;
    setCompleteHandler(handleComplete);

    return () => {
      setCompleteHandler(null);
    };
  }, [deviceId, handleComplete]);

  if (loading) {
    return <div className="content">로딩 중...</div>;
  }

  if (!combinationData) {
    return <div className="content">조합 데이터를 불러오지 못했습니다.</div>;
  }

  return (
    <>
      <div className="px-4 flex flex-col items-center w-full">
        <NoSpaceTab
          setRoomType={setRoomType}
          roomType={roomType}
          scentCnt={scentCnt}
          setScentCnt={setScentCnt}
          scentNames={scentNames}
          totalEnergy={totalEnergy}
        />

        <div className="mt-4 w-full">
          <SpaceDescription />
        </div>
      </div>
      {showAlert && (
        <Alert
          message={alertConfig.message}
          onClose={() => setShowAlert(false)}
          onConfirm={alertConfig.onConfirm}
          showButtons={alertConfig.showButtons}
          confirmText="확인"
          cancelText=""
        />
      )}
    </>
  );
}

export default EditOnlyScent;
