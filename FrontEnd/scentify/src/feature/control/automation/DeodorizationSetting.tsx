import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ScentSetting from "../../../components/ScentSetting";
import SprayIntervalSelector from "../../../components/SprayIntervalSelector";

export default function DeodorizationSetting() {
  const navigate = useNavigate();
  const location = useLocation();

  // API통해 모드 활성화 여부 결정
  const [deodorize, setDeodorize] = useState(location.state.deodorize);
  // 모드 변했으면 1, 그대로면 0
  const [deodorizeModeOn, setDeodorizeModeOn] = useState<boolean>(false);

  // 탈취 모드 토글
  const toggleDeodorize = () => {
    setDeodorize((prev) => {
      const newState = !prev;
      setDeodorizeModeOn(newState != deodorize);
      return newState;
    });
  };

  // 분사주기 드롭박스 초기값
  const [selectedTime, setSelectedTime] = useState("15분");
  // 분사주기 선택
  const handleSelectTime = (time: string) => {
    setSelectedTime(time);
  };

  // 뒤로가기
  const handleBack = () => {
    navigate("/control", {
      state: { deodorize: location.state.deodorize },
    });
  };

  // 완료 버튼 누를 시 API 호출, 현재는 모드 상태 임시 전달
  const handleComplete = () => {
    navigate("/control", {
      state: { deodorize },
    });
  };

  return (
    <div className="content">
      <button onClick={handleBack}>뒤로가기</button>
      <h2>탈취모드</h2>
      <button onClick={handleComplete}>완료</button>
      <div className="font-pre-medium text-16 ml-5 mr-5">
        <div className="flex relative justify-between mb-6">
          <h3>향 설정</h3>
          <div onClick={() => toggleDeodorize()}>
            <div className="w-[50px] h-[25px] rounded-full cursor-pointer realative bg-brand"></div>
            <div
              className={`absolute top-[0px] left-[270px] w-[25px] h-[25px] bg-white rounded-full transition-transform ${deodorize ? "translate-x-full" : "translate-x-0"}`}
            ></div>
          </div>
        </div>
        <ScentSetting />
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
