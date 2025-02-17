import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useAuthStore } from "../../../stores/useAuthStore";

import { getCombinationById } from "../../../apis/control/getCombinationById";

import { AutoManagerProps } from "./AutoModeType";

import SettingIcon from "../../../assets/icons/setting-icon.svg";

export default function AutoManager({
  automationData,
  devices,
  selectedDevice,
}: AutoManagerProps) {
  const navigate = useNavigate();

  // 인증토큰
  const authStore = useAuthStore();
  const accessToken = authStore.accessToken;

  // 기기 한개의 자동화 데이터 저장
  const autoSchedules = automationData?.autoSchedules || [];

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

  // 공간 크기
  const [roomType, setRoomType] = useState<number>(0);
  useEffect(() => {
    const newRoomType = devices.find(
      (device) => device.deviceId === selectedDevice
    )?.roomType;
    setRoomType(newRoomType ?? 0);
  }, [selectedDevice, devices]);

  // 자동화 모드 세부 설정 버튼 클릭 핸들러
  const handleSettingClick = (autoType: number) => {
    // 탐지 모드, 동작 모드, 탈취 모드 순
    if (autoType === 0) {
      navigate(`/control/auto/detect`, {
        state: {
          schedule: automationData.autoSchedules[1],
          defaultScentData: defaultScentData,
          deviceId: selectedDevice,
          defaultScentId: defaultScentId,
          accessToken: accessToken,
          roomType: roomType,
        },
      });
    } else if (autoType === 1) {
      navigate(`/control/auto/behavior`, {
        state: {
          schedule1: automationData.autoSchedules[2],
          schedule2: automationData.autoSchedules[3],
          defaultScentData: defaultScentData,
          deviceId: selectedDevice,
          defaultScentId: defaultScentId,
          accessToken: accessToken,
        },
      });
    } else if (autoType === 2) {
      navigate(`/control/auto/deodorize`, {
        state: {
          schedule: automationData.autoSchedules[0],
          defaultScentData: defaultScentData,
          deviceId: selectedDevice,
          defaultScentId: defaultScentId,
          accessToken: accessToken,
          roomType: roomType,
        },
      });
    }
  };

  return (
    <div className="flex flex-col mt-6 font-pre-medium text-14 gap-4">
      {/* 탈취 모드 */}
      <div className="h-[60px] px-4 bg-component flex justify-between items-center rounded-lg">
        <div className="flex justify-between items-center w-full">
          <div>탈취 모드</div>
          <div className="flex items-center font-pre-light text-12 text-brand gap-2">
            <p>{autoSchedules[0].modeOn === 1 ? "on" : "off"}</p>
            <button
              onClick={() => handleSettingClick(autoSchedules[0].subMode)}
            >
              <img src={SettingIcon} alt="세팅 이미지" />
            </button>
          </div>
        </div>
      </div>

      {/* 동작 모드 */}
      <div className="h-[60px] px-4 bg-component flex justify-between items-center rounded-lg">
        <div className="flex justify-between items-center w-full">
          <div>동작 모드</div>
          <div className="flex flex-col gap-2">
            <div className="flex">
              <div className="flex flex-col pr-2 items-center gap-1 font-pre-light text-10font-pre-light text-brand text-12">
                <p>운동 {autoSchedules[2].modeOn === 1 ? "on" : "off"}</p>
                <p>휴식 {autoSchedules[3].modeOn === 1 ? "on" : "off"}</p>
              </div>
              <button
                onClick={() => handleSettingClick(autoSchedules[2].subMode)}
              >
                <img src={SettingIcon} alt="세팅 이미지" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 탐지 모드 */}
      <div className="h-[60px] px-4 bg-component flex justify-between items-center rounded-lg">
        <div className="flex justify-between items-center w-full">
          <div>탐지 모드</div>
          <div className="flex items-center font-pre-light text-12 text-brand gap-2">
            <p>{autoSchedules[1].modeOn === 1 ? "on" : "off"}</p>
            <button
              onClick={() => handleSettingClick(autoSchedules[1].subMode)}
            >
              <img src={SettingIcon} alt="세팅 이미지" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
