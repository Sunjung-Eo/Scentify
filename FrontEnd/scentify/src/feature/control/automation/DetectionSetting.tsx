import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useControlStore } from "../../../stores/useControlStore";
import ScentSetting from "../../../components/Control/ScentSetting";

export default function DetectionSetting() {
  const navigate = useNavigate();
  const location = useLocation();

  // API통해 모드 활성화 여부 결정
  const [detect, setDetect] = useState(location.state.detect);
  const [detectModeOn, setDetectModeOn] = useState<boolean>(false);

  // 탐지 모드 토글
  const toggleDetect = () => {
    setDetect((prev) => {
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
  const [totalEnergy, setTotalEnergy] = useState<number>(3);

  // 완료 버튼 누를 시 API 호출, 현재는 모드 상태 임시 전달
  const { setCompleteHandler } = useControlStore();
  const handleComplete = () => {
    navigate("/control", {
      state: { detect },
    });
  };
  useEffect(() => {
    setCompleteHandler(handleComplete);
    return () => setCompleteHandler(null);
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
        />
      </div>
    </div>
  );
}
