import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import SprayIntervalSelector from "../../../components/SprayIntervalSelector";

export default function BehaviorSetting() {
  const navigate = useNavigate();
  const location = useLocation();

  // API통해 모드 활성화 여부 결정
  const [focus, setFocus] = useState(location.state?.focus || false);
  const [rest, setRest] = useState(location.state?.rest || false);
  // 모드 변했으면 1, 그대로면 0
  const [focusModeOn, setFocusModeOn] = useState<boolean>(false);
  const [restModeOn, setRestModeOn] = useState<boolean>(false);
  // 집중 모드 토글
  const toggleFocus = () => {
    setFocus((prev) => {
      const newState = !prev;
      setFocusModeOn(newState != focus);
      return newState;
    });
  };
  // 휴식 모드 토글
  const toggleRest = () => {
    setRest((prev) => {
      const newState = !prev;
      setRestModeOn(newState != rest);
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
      state: { focus, rest },
    });
  };

  // 완료 버튼 누를 시 API 호출, 현재는 모드 상태 임시 전달달
  const handleComplete = () => {
    navigate("/control", {
      state: { focus, rest },
    });
  };

  return (
    <div className="content">
      <button onClick={handleBack}>뒤로가기</button>
      <h2>동작모드</h2>
      <button onClick={handleComplete}>완료</button>
      <div className="relative">
        <div className="flex flex-col w-[320px] h-[130px] p-5 ml-5 bg-sub text-white rounded-xl">
          <div className="flex justify-between">
            <h3 className="font-pre-medium text-20">집중</h3>
            <div onClick={() => toggleFocus()}>
              <div className="w-[50px] h-[25px] rounded-full cursor-pointer realative bg-brand"></div>
              <div
                className={`absolute top-[20px] left-[270px] w-[25px] h-[25px] bg-white rounded-full transition-transform ${focus ? "translate-x-full" : "translate-x-0"}`}
              ></div>
            </div>
          </div>
          <div className="absolute bottom-[20px] left-[180px] z-40 font-pre-light text-12">
            <div className="flex items-center">
              <p className="p-2">분사 주기</p>
              <SprayIntervalSelector
                selectedTime={selectedTime}
                onTimeSelect={handleSelectTime}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="relative mt-6">
        <div className="flex flex-col w-[320px] h-[130px] p-5 ml-5 bg-sub text-white rounded-xl">
          <div className="flex justify-between">
            <h3 className="font-pre-medium text-20">휴식</h3>
            <div onClick={() => toggleRest()}>
              <div className="w-[50px] h-[25px] rounded-full cursor-pointer realative bg-brand"></div>
              <div
                className={`absolute top-[20px] left-[270px] w-[25px] h-[25px] bg-white rounded-full transition-transform ${rest ? "translate-x-full" : "translate-x-0"}`}
              ></div>
            </div>
          </div>
          <div className="absolute bottom-[20px] left-[180px] z-40 font-pre-light text-12">
            <div className="flex items-center">
              <p className="p-2">분사 주기</p>
              <SprayIntervalSelector
                selectedTime={selectedTime}
                onTimeSelect={handleSelectTime}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
