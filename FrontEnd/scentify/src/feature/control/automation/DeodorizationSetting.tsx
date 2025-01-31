import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useControlStore } from '../../../stores/useControlStore';
import ScentSetting from '../../../components/Control/ScentSetting';
import SprayIntervalSelector from '../../../components/Control/SprayIntervalSelector';

export default function DeodorizationSetting() {
  const navigate = useNavigate();
  const location = useLocation();

  // API통해 모드 활성화 여부 결정
  const [deodorize, setDeodorize] = useState(location.state.deodorize);
  // 모드 변했으면 1, 그대로면 0
  const [deodorizeModeOn, setDeodorizeModeOn] = useState<boolean>(false);

  // 탈취 모드 토글
  const toggleDeodorize = () => {
    setDeodorize((prev: any) => {
      const newState = !prev;
      setDeodorizeModeOn(newState != deodorize);
      return newState;
    });
  };

  // 향 설정
  const [scentName, setScentName] = useState<string>('');
  const [scents, setScents] = useState({
    scent1: 0,
    scent2: 0,
    scent3: 0,
    scent4: 0,
  });
  const [totalEnergy, setTotalEnergy] = useState<number>(3);

  // 분사주기 드롭박스 초기값
  const [selectedTime, setSelectedTime] = useState('15분');
  // 분사주기 선택
  const handleSelectTime = (time: string) => {
    setSelectedTime(time);
  };

  // 완료 버튼 누를 시 API 호출, 현재는 모드 상태 임시 전달
  const { setCompleteHandler } = useControlStore();
  const handleComplete = () => {
    navigate('/control', {
      state: { deodorize },
    });
  };
  useEffect(() => {
    setCompleteHandler(handleComplete);
    return () => setCompleteHandler(null);
  }, [deodorize]);

  return (
    <div className="content p-0">
      <div className="font-pre-medium text-16 ml-5 mr-5">
        <div className="flex relative justify-between mb-6">
          <h3>향 설정</h3>
          <div onClick={() => toggleDeodorize()}>
            <div
              className={`w-[50px] h-[25px] rounded-full cursor-pointer realative bg-brand ${deodorize ? '' : 'bg-lightgray'}`}
            >
              <div
                className={`absolute w-[25px] h-[25px] bg-white rounded-full transition-transform ${deodorize ? 'translate-x-full' : 'translate-x-0'}`}
              ></div>
            </div>
          </div>
        </div>
        <ScentSetting
          scents={scents}
          setScents={setScents}
          totalEnergy={totalEnergy}
        />
        <div className="mt-12">
          <h3>분사 설정</h3>
          <div className="flex pt-4 justify-center items-center font-pre-light text-12">
            <p className="pr-12">분사 주기</p>
            <SprayIntervalSelector
              selectedTime={selectedTime}
              onTimeSelect={handleSelectTime}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
