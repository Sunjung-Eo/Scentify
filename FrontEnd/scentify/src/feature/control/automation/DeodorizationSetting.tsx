import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useControlStore } from "../../../stores/useControlStore";
import ScentSetting from "../../../components/Control/ScentSetting";
import SprayIntervalSelector from "../../../components/Control/SprayIntervalSelector";
import { updateDeodorization } from "../../../apis/control/updataDeodorization";
import { deodorizationData } from "./AutoModeType";

export default function DeodorizationSetting() {
  const navigate = useNavigate();
  const location = useLocation();
  const schedule = location.state.schedule;
  const defaultScentData = location.state.defaultScentData;
  const deviceId = location.state.deviceId;
  const accessToken = location.state.accessToken;

  console.log(schedule);
  // API통해 모드 활성화 여부 결정
  const [deodorize, setDeodorize] = useState(schedule.modeOn);
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
  const [scentName, setScentName] = useState<string>("");
  const [scents, setScents] = useState({
    scent1: 0,
    scent2: 0,
    scent3: 0,
    scent4: 0,
  });
  // 기존 향
  const [previousScentData, setPreviousScentData] = useState({
    choice1: 0,
    choice1Count: 0,
    choice2: 0,
    choice2Count: 0,
    choice3: 0,
    choice3Count: 0,
    choice4: 0,
    choice4Count: 0,
  });
  // 향 수정 여부
  const isScentsChanged = () => {
    const currentScents = {
      choice1: defaultScentData.slot1.slot,
      choice1Count: scents.scent1,
      choice2: defaultScentData.slot2.slot,
      choice2Count: scents.scent2,
      choice3: defaultScentData.slot3.slot,
      choice3Count: scents.scent3,
      choice4: defaultScentData.slot4.slot,
      choice4Count: scents.scent4,
    };
    return JSON.stringify(currentScents) !== JSON.stringify(previousScentData);
  };

  const [totalEnergy, setTotalEnergy] = useState<number>(3);

  // 분사주기 드롭박스 초기값
  const [selectedTime, setSelectedTime] = useState(schedule.interval);
  const previousSelectedTime = schedule.interval;
  // 분사주기 선택
  const handleSelectTime = (time: string | number) => {
    setSelectedTime(time.toString());
  };

  // 완료 버튼 누를 시 API 호출, 현재는 모드 상태 임시 전달
  const { setCompleteHandler } = useControlStore();
  // 완료 버튼 클릭 시 호출되는 함수
  const handleComplete = () => {
    const deodorizationData: deodorizationData = {
      id: schedule.id,
      deviceId: deviceId,
      combination: isScentsChanged()
        ? {
            choice1: defaultScentData.slot1.slot!,
            choice1Count: scents.scent1,
            choice2: defaultScentData.slot2.slot!,
            choice2Count: scents.scent2,
            choice3: defaultScentData.slot3.slot!,
            choice3Count: scents.scent3,
            choice4: defaultScentData.slot4.slot!,
            choice4Count: scents.scent4,
          }
        : { id: schedule.combinationId },
      modeOn: deodorize,
      modeChange: deodorizeModeOn,
      // interval: parseInt(selectedTime.replace("분", ""), 10),
      // interval: parseInt(selectedTime.replace(/[^0-9]/g, "")),
      interval: parseInt(String(selectedTime).replace(/[^0-9]/g, "")),
      intervalChange: previousSelectedTime === selectedTime ? false : true,
    };

    console.log("최종 deodorizationData:", deodorizationData);

    updateDeodorization(deodorizationData, accessToken);
    navigate("/control", {
      state: { deodorize, selectedTime },
    });
  };

  useEffect(() => {
    // 완료 핸들러 등록
    setCompleteHandler(handleComplete);

    return () => {
      // 컴포넌트 언마운트 시 핸들러 초기화
      setCompleteHandler(null);
    };
  }, [deodorize]);

  return (
    <div className="content p-0">
      <div className="font-pre-medium text-16 ml-5 mr-5">
        <div className="flex relative justify-between mb-6">
          <h3>향 설정</h3>
          <div onClick={() => toggleDeodorize()}>
            <div
              className={`w-[50px] h-[25px] rounded-full cursor-pointer realative bg-brand ${deodorize ? "" : "bg-lightgray"}`}
            >
              <div
                className={`absolute w-[25px] h-[25px] bg-white rounded-full transition-transform ${deodorize ? "translate-x-full" : "translate-x-0"}`}
              ></div>
            </div>
          </div>
        </div>
        <ScentSetting
          scents={scents}
          setScents={setScents}
          totalEnergy={totalEnergy}
          defaultScentData={defaultScentData}
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
