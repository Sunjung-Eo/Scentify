import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useControlStore } from "../../../stores/useControlStore";

import { updateBehavior } from "../../../apis/control/updateBehavior";

import SprayIntervalSelector from "../../../components/Control/SprayIntervalSelector";
import { behaviorData } from "./AutoModeType";

export default function BehaviorSetting() {
  const navigate = useNavigate();
  const location = useLocation();
  const scheduleExercise = location.state.schedule1;
  const scheduleRest = location.state.schedule2;
  const deviceId = location.state.deviceId;
  const accessToken = location.state.accessToken;

  // react query
  const queryClient = useQueryClient();
  const updateMutation = useMutation({
    mutationFn: (data: behaviorData) => updateBehavior(data, accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["automations"] });
      navigate("/control", {
        state: { exercise, rest, exerciseSelectedTime, restSelectedTime },
      });
    },
    onError: (error) => {
      console.error("동작 모드 업데이트 실패:", error);
    },
  });

  // 모드 활성화 여부
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
    `${scheduleExercise.interval}분`
  );
  const [restSelectedTime, setRestSelectedTime] = useState(
    `${scheduleRest.interval}분`
  );
  // 기존 분사주기
  const previousExerciseSelectedTime = scheduleExercise.interval;
  const previousRestSelectedTime = scheduleRest.interval;
  // 분사주기 선택
  const handleExerciseSelectTime = (time: string | number) => {
    const formattedTime = typeof time === "number" ? `${time}분` : time;
    setExerciseSelectedTime(formattedTime);
  };
  const handleRestSelectTime = (time: string | number) => {
    const formattedTime = typeof time === "number" ? `${time}분` : time;
    setRestSelectedTime(formattedTime);
  };

  // 완료 버튼 핸들러
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

    updateMutation.mutate(behaviorData);
    navigate("/control", {
      state: { exercise, rest, exerciseSelectedTime, restSelectedTime },
    });
  };

  useEffect(() => {
    setCompleteHandler(handleComplete);

    return () => {
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
