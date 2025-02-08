import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useControlStore } from "../../../stores/useControlStore";
import SprayIntervalSelector from "../../../components/Control/SprayIntervalSelector";
import { behaviorData } from "./AutoModeType";
import { updateBehavior } from "../../../apis/control/updateBehavior";

export default function BehaviorSetting() {
  const navigate = useNavigate();
  const location = useLocation();
  const scheduleExercise = location.state.schedule1;
  const scheduleRest = location.state.schedule2;
  const defaultScentData = location.state.defaultScentData;
  const deviceId = location.state.deviceId;
  const accessToken = location.state.accessToken;

  // API통해 모드 활성화 여부 결정
  const [exercise, setExercise] = useState(scheduleExercise.modeOn);
  const [rest, setRest] = useState(scheduleRest.modeOn);
  // 모드 변했으면 1, 그대로면 0
  const [exerciseModeOn, setExerciseModeOn] = useState<boolean>(false);
  const [restModeOn, setRestModeOn] = useState<boolean>(false);
  // 집중 모드 토글
  const toggleExercise = () => {
    setExercise((prev: any) => {
      const newState = !prev;
      setExerciseModeOn(newState != exercise);
      return newState;
    });
  };
  // 휴식 모드 토글
  const toggleRest = () => {
    setRest((prev: any) => {
      const newState = !prev;
      setRestModeOn(newState != rest);
      return newState;
    });
  };

  // 분사주기 드롭박스 초기값
  const [exerciseSelectedTime, setExerciseSelectedTime] = useState(
    scheduleExercise.interval
  );
  const [restSelectedTime, setRestSelectedTime] = useState(
    scheduleRest.interval
  );
  // 분사주기 선택
  const handleExerciseSelectTime = (time: string | number) => {
    setExerciseSelectedTime(time.toString());
  };
  const handleRestSelectTime = (time: string | number) => {
    setRestSelectedTime(time.toString());
  };
  const previousExerciseSelectedTime = scheduleExercise.interval;
  const previousRestSelectedTime = scheduleRest.interval;

  const { setCompleteHandler } = useControlStore();
  const handleComplete = () => {
    const behaviorData: behaviorData = {
      exerciseSchedule: {
        id: scheduleExercise.id,
        deviceId: deviceId,
        interval: parseInt(String(exerciseSelectedTime).replace(/[^0-9]/g, "")),
        modeOn: exercise,
      },
      exerciseModeChange: exerciseModeOn,
      exerciseIntervalChange:
        previousExerciseSelectedTime === exerciseSelectedTime ? false : true,
      restSchedule: {
        id: scheduleRest.id,
        deviceId: deviceId,
        interval: parseInt(String(restSelectedTime).replace(/[^0-9]/g, "")),
        modeOn: rest,
      },
      restModeChange: restModeOn,
      restIntervalChange:
        previousRestSelectedTime === restSelectedTime ? false : true,
    };

    console.log("최종 behaviorData:", behaviorData);

    updateBehavior(behaviorData, accessToken);
    navigate("/control", {
      state: { exercise, rest, exerciseSelectedTime, restSelectedTime },
    });
  };

  useEffect(() => {
    // 완료 핸들러 등록
    setCompleteHandler(handleComplete);

    return () => {
      // 컴포넌트 언마운트 시 핸들러 초기화
      setCompleteHandler(null);
    };
  }, [exercise, rest, exerciseSelectedTime, restSelectedTime]);

  return (
    <div className="content p-0">
      <div className="relative">
        <div className="flex flex-col w-[320px] h-[130px] p-5 ml-5 bg-sub text-white rounded-xl">
          <div className="flex justify-between">
            <h3 className="font-pre-medium text-20">운동동</h3>
            <div onClick={() => toggleExercise()}>
              <div
                className={`w-[50px] h-[25px] rounded-full cursor-pointer realative bg-brand ${exercise ? "" : "bg-lightgray"}`}
              >
                <div
                  className={`absolute w-[25px] h-[25px] bg-white rounded-full transition-transform ${exercise ? "translate-x-full" : "translate-x-0"}`}
                ></div>
              </div>
            </div>
          </div>
          <div className="absolute bottom-[20px] left-[180px] z-40 font-pre-light text-12">
            <div className="flex items-center">
              <p className="p-2">분사 주기</p>
              <SprayIntervalSelector
                selectedTime={exerciseSelectedTime}
                onTimeSelect={handleExerciseSelectTime}
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
              <div
                className={`w-[50px] h-[25px] rounded-full cursor-pointer realative bg-brand ${rest ? "" : "bg-lightgray"}`}
              >
                <div
                  className={`absolute w-[25px] h-[25px] bg-white rounded-full transition-transform ${rest ? "translate-x-full" : "translate-x-0"}`}
                ></div>
              </div>
            </div>
          </div>
          <div className="absolute bottom-[20px] left-[180px] z-40 font-pre-light text-12">
            <div className="flex items-center">
              <p className="p-2">분사 주기</p>
              <SprayIntervalSelector
                selectedTime={restSelectedTime}
                onTimeSelect={handleRestSelectTime}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
