import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useControlStore } from "../../../stores/useControlStore";
import ScentSetting from "../../../components/Control/ScentSetting";
import { detectionData } from "./AutoModeType";
import { updateDetection } from "../../../apis/control/updateDetection";

export default function DetectionSetting() {
  const navigate = useNavigate();
  const location = useLocation();
  const schedule = location.state.schedule;
  const defaultScentData = location.state.defaultScentData;
  const deviceId = location.state.deviceId;
  const accessToken = location.state.accessToken;

  // API통해 모드 활성화 여부 결정
  const [detect, setDetect] = useState(schedule.modeOn);
  const [detectModeOn, setDetectModeOn] = useState<boolean>(false);

  // 탐지 모드 토글
  const toggleDetect = () => {
    setDetect((prev: any) => {
      const newState = !prev;
      setDetectModeOn(newState != detect);
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

  // 완료 버튼 누를 시 API 호출, 현재는 모드 상태 임시 전달
  const { setCompleteHandler } = useControlStore();
  const handleComplete = () => {
    const detectionData: detectionData = {
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
      modeOn: detect,
      modeChange: detectModeOn,
    };

    console.log("최종 detectModeOn:", detectModeOn);

    updateDetection(detectionData, accessToken);
    navigate("/control", {
      state: { detect },
    });
  };

  useEffect(() => {
    // 완료 핸들러 등록
    setCompleteHandler(handleComplete);

    return () => {
      // 컴포넌트 언마운트 시 핸들러 초기화
      setCompleteHandler(null);
    };
  }, [detect]);

  return (
    <div className="content p-0">
      <div className="font-pre-medium text-16 ml-5 mr-5">
        <div className="flex relative justify-between mb-6">
          <h3>향 설정</h3>
          <div onClick={() => toggleDetect()}>
            <div
              className={`w-[50px] h-[25px] rounded-full cursor-pointer realative bg-brand ${detect ? "" : "bg-lightgray"}`}
            >
              <div
                className={`absolute w-[25px] h-[25px] bg-white rounded-full transition-transform ${detect ? "translate-x-full" : "translate-x-0"}`}
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
      </div>
    </div>
  );
}
