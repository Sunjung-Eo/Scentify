import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useControlStore } from "../../../stores/useControlStore";

import { updateDetection } from "../../../apis/control/updateDetection";
import { getCombinationById } from "../../../apis/control/getCombinationById";

import ScentSetting from "../../../components/Control/ScentSetting";
import { detectionData } from "./AutoModeType";

export default function DetectionSetting() {
  const navigate = useNavigate();
  const location = useLocation();
  const schedule = location.state.schedule;
  const deviceId = location.state.deviceId;
  const accessToken = location.state.accessToken;
  const roomType = location.state.roomType;

  // 탐지 모드 - mutation
  const queryClient = useQueryClient();
  const updateMutation = useMutation({
    mutationFn: (data: detectionData) => updateDetection(data, accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["automations"] });
      navigate("/control", { state: { detect } });
    },
    onError: (error) => {
      console.error("탐지 모드 업데이트 실패:", error);
    },
  });

  // 모드 활성화 여부
  const [detect, setDetect] = useState(schedule.modeOn);
  // 모드 변했으면 1, 그대로면 0
  const [detectModeOn, setDetectModeOn] = useState<boolean>(false);

  // 탐지 모드 토글
  const toggleDetect = () => {
    setDetect((prev: any) => {
      const newState = !prev;
      setDetectModeOn(newState != detect);
      return newState;
    });
  };

  // 기존 향 설정
  const [previousScentId] = useState(schedule.combinationId);
  const [previousScentData, setPreviousScentData] = useState({
    slot1: { slot: 0, count: 0 },
    slot2: { slot: 0, count: 0 },
    slot3: { slot: 0, count: 0 },
    slot4: { slot: 0, count: 0 },
  });
  useEffect(() => {
    const fetchCombination = async () => {
      if (previousScentId) {
        try {
          const combination = await getCombinationById(
            previousScentId,
            accessToken
          );
          setPreviousScentData({
            slot1: {
              slot: combination.choice1,
              count: combination.choice1Count,
            },
            slot2: {
              slot: combination.choice2,
              count: combination.choice2Count,
            },
            slot3: {
              slot: combination.choice3,
              count: combination.choice3Count,
            },
            slot4: {
              slot: combination.choice4,
              count: combination.choice4Count,
            },
          });
        } catch (error) {
          console.error("기본향 조합 데이터 가져오기 실패:", error);
        }
      }
    };

    fetchCombination();
  }, [previousScentId, accessToken]);

  // 향 설정
  const [scents, setScents] = useState({
    scent1: previousScentData?.slot1?.count,
    scent2: previousScentData?.slot2?.count,
    scent3: previousScentData?.slot3?.count,
    scent4: previousScentData?.slot4?.count,
  });
  useEffect(() => {
    setScents({
      scent1: previousScentData.slot1.count,
      scent2: previousScentData.slot2.count,
      scent3: previousScentData.slot3.count,
      scent4: previousScentData.slot4.count,
    });
  }, [previousScentData]);

  // 향 수정 여부
  const isScentsChanged = () => {
    return (
      scents.scent1 !== previousScentData.slot1.count ||
      scents.scent2 !== previousScentData.slot2.count ||
      scents.scent3 !== previousScentData.slot3.count ||
      scents.scent4 !== previousScentData.slot4.count
    );
  };

  // 공간 크기에 따른 에너지
  const [totalEnergy, setTotalEnergy] = useState<number>(
    roomType === 0 ? 3 : 6
  );
  useEffect(() => {
    setTotalEnergy(roomType === 0 ? 3 : 6);
  }, [roomType]);

  // 폼 유효성 검사
  const [formErrors, setFormErrors] = useState({
    scents: "",
  });

  // 완료 버튼 핸들러
  const { setCompleteHandler } = useControlStore();
  const handleComplete = () => {
    // 유효성 검사
    const errors = {
      scents: "",
    };
    let isValid = true;
    const totalUsage = Object.values(scents).reduce(
      (sum, value) => sum + value,
      0
    );
    if (totalUsage !== totalEnergy) {
      errors.scents = "향을 전부 선택해주세요.";
      isValid = false;
    }

    setFormErrors(errors);
    if (!isValid) {
      return;
    }
    // API request
    const detectionData: detectionData = {
      id: schedule.id,
      deviceId: deviceId,
      combination: isScentsChanged()
        ? {
            choice1: previousScentData.slot1.slot,
            choice1Count: scents.scent1,
            choice2: previousScentData.slot2.slot,
            choice2Count: scents.scent2,
            choice3: previousScentData.slot3.slot,
            choice3Count: scents.scent3,
            choice4: previousScentData.slot4.slot,
            choice4Count: scents.scent4,
          }
        : { id: schedule.combinationId },
      modeOn: detect,
      modeChange: detectModeOn,
    };

    updateMutation.mutate(detectionData);
    navigate("/control", {
      state: { detect },
    });
  };

  useEffect(() => {
    setCompleteHandler(handleComplete);

    return () => {
      setCompleteHandler(null);
    };
  }, [detect, scents]);

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
          defaultScentData={previousScentData}
        />
        {formErrors.scents && (
          <p className="absolute ml-[70px] text-red-500 text-10">
            {formErrors.scents}
          </p>
        )}
      </div>
    </div>
  );
}
