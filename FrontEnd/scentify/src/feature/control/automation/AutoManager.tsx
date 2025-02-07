import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DeviceSelect from "../../../components/Control/DeviceSelect";
import { useAuthStore } from "../../../stores/useAuthStore";
import { AutoManagerProps } from "./AutoModeType";
import { getCombinationById } from "../../../apis/control/getCombinationById";
import AutoIcon from "../../../assets/icons/auto-icon.svg";
import SettingIcon from "../../../assets/icons/setting-icon.svg";

export default function AutoManager({
  automationData,
  devices,
  selectedDevice,
  onDeviceChange,
}: AutoManagerProps) {
  const navigate = useNavigate();
  const location = useLocation();
  // 인증토큰
  const authStore = useAuthStore();
  const accessToken = authStore.accessToken;

  // 자동화모드 데이터 관리리
  const [autoData, setAutoData] = useState(automationData);
  console.log("자동화!", automationData);
  useEffect(() => {
    setAutoData(structuredClone(automationData));
  }, [selectedDevice, automationData]);

  // 하위 컴포넌트 데이터 가져오기
  const deodorize = location.state?.deodorize;
  const deodorizeInterval = location.state?.selectedTime;
  const detect = location.state?.detect;
  const exercise = location.state?.exercise;
  const exerciseInterval = location.state?.exerciseSelectedTime;
  const rest = location.state?.rest;
  const restInterval = location.state?.restSelectedTime;

  // useEffect(() => {
  //   setAutoData(automationData);
  // }, [automationData]);

  useEffect(() => {
    if (deodorize !== undefined || deodorizeInterval !== undefined) {
      setAutoData((prev) => ({
        ...prev,
        autoSchedules: [...prev.autoSchedules].map((schedule, index) =>
          index === 0
            ? {
                ...schedule,
                ...(deodorize !== undefined && { modeOn: deodorize }),
                ...(deodorizeInterval !== undefined && {
                  interval: deodorizeInterval,
                }),
              }
            : schedule
        ),
      }));
    }
  }, [deodorize, deodorizeInterval, location.state]);

  useEffect(() => {
    if (
      exercise !== undefined ||
      exerciseInterval !== undefined ||
      rest !== undefined ||
      restInterval !== undefined
    ) {
      setAutoData((prev) => ({
        ...prev,
        autoSchedules: [...prev.autoSchedules].map((schedule, index) =>
          index === 1
            ? {
                ...schedule,
                ...(exercise !== undefined && { modeOn: exercise }),
                ...(exerciseInterval !== undefined && {
                  interval: exerciseInterval,
                }),
                ...(rest !== undefined && { modeOn: rest }),
                ...(restInterval !== undefined && {
                  interval: restInterval,
                }),
              }
            : schedule
        ),
      }));
    }
  }, [exercise, rest, exerciseInterval, restInterval, location.state]);

  useEffect(() => {
    if (detect !== undefined) {
      setAutoData((prev) => ({
        ...prev,
        autoSchedules: [...prev.autoSchedules].map((schedule, index) =>
          index === 1
            ? {
                ...schedule,
                ...(detect !== undefined && { modeOn: detect }),
              }
            : schedule
        ),
      }));
    }
  }, [detect, location.state]);

  // 기본향 설정
  const [defaultScentId, setDefaultScentId] = useState(
    devices.find((device) => device.deviceId === selectedDevice)?.defaultScentId
  );
  const [defaultScentData, setDefaultScentData] = useState({
    slot1: { slot: 0, count: 0 },
    slot2: { slot: 0, count: 0 },
    slot3: { slot: 0, count: 0 },
    slot4: { slot: 0, count: 0 },
  });
  useEffect(() => {
    const newDefaultScentId = devices.find(
      (device) => device.deviceId === selectedDevice
    )?.defaultScentId;
    setDefaultScentId(newDefaultScentId);
  }, [selectedDevice, devices]);
  useEffect(() => {
    const fetchCombination = async () => {
      if (defaultScentId) {
        try {
          const combination = await getCombinationById(
            defaultScentId,
            accessToken
          );
          setDefaultScentData({
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
  }, [defaultScentId, accessToken]);

  // 자동화 모드 세부 설정 버튼 클릭
  const handleSettingClick = (autoType: number) => {
    if (autoType === 0) {
      navigate(`/control/auto/detect`, {
        state: {
          schedule: automationData.autoSchedules[1],
          defaultScentData: defaultScentData,
          deviceId: selectedDevice,
          accessToken: accessToken,
        },
      });
    } else if (autoType === 1) {
      navigate(`/control/auto/behavior`, {
        state: {
          schedule1: automationData.autoSchedules[2],
          schedule2: automationData.autoSchedules[3],
          defaultScentData: defaultScentData,
          deviceId: selectedDevice,
          accessToken: accessToken,
        },
      });
    } else if (autoType === 2) {
      navigate(`/control/auto/deodorize`, {
        state: {
          schedule: automationData.autoSchedules[0],
          defaultScentData: defaultScentData,
          deviceId: selectedDevice,
          accessToken: accessToken,
        },
      });
    }
  };

  return (
    <div>
      <div className="relative">
        <div className="flex items-center gap-1">
          <img src={AutoIcon} alt="자동화 이미지" />
          <h2>자동화 모드 설정</h2>
        </div>
        <div className="absolute top-[-4px] left-[209px] z-40">
          {/* <DeviceSelect
            devices={devices}
            selectedDevice={selectedDevice}
            onDeviceChange={onDeviceChange}
          /> */}
        </div>
      </div>
      <div className="flex flex-col mt-5 gap-4">
        {/* 탈취 모드 */}
        <div className="w-[328px] h-[40px] px-4 bg-component text-14 flex justify-between items-center rounded-lg">
          <div className="flex justify-between items-center w-full">
            <div>탈취 모드</div>
            <div className="flex items-center gap-2">
              <p>{autoData.autoSchedules[0].modeOn === 1 ? "ON" : "OFF"}</p>
              <button
                onClick={() =>
                  handleSettingClick(autoData.autoSchedules[0].subMode)
                }
              >
                <img src={SettingIcon} alt="세팅 이미지" />
              </button>
            </div>
          </div>
        </div>

        {/* 동작 모드 */}
        <div className="w-[328px] h-[40px] px-4 bg-component text-14 flex justify-between items-center rounded-lg">
          <div className="flex justify-between items-center w-full">
            <div>동작 모드</div>
            <div className="flex flex-col gap-2">
              <div className="flex">
                <div className="flex flex-col pr-2 items-center gap-1 font-pre-light text-10">
                  <p>
                    운동 {autoData.autoSchedules[2].modeOn === 1 ? "ON" : "OFF"}
                  </p>
                  <p>
                    휴식 {autoData.autoSchedules[3].modeOn === 1 ? "ON" : "OFF"}
                  </p>
                </div>
                <button
                  onClick={() =>
                    handleSettingClick(autoData.autoSchedules[2].subMode)
                  }
                >
                  <img src={SettingIcon} alt="세팅 이미지" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 탐지 모드 */}
        <div className="w-[328px] h-[40px] px-4 bg-component text-14 flex justify-between items-center rounded-lg">
          <div className="flex justify-between items-center w-full">
            <div>탐지 모드</div>
            <div className="flex items-center gap-2">
              <p>{autoData.autoSchedules[1].modeOn === 1 ? "ON" : "OFF"}</p>
              <button
                onClick={() =>
                  handleSettingClick(autoData.autoSchedules[1].subMode)
                }
              >
                <img src={SettingIcon} alt="세팅 이미지" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
