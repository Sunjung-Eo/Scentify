import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DeviceSelect from "../../../components/DeviceSelect";
import { AutoMode, AutoManagerProps } from "./AutoModeType";
import AutoIcon from "../../../assets/icons/auto-icon.svg";
import SettingIcon from "../../../assets/icons/setting-icon.svg";

export default function AutoManager({
  selectedDevice,
  onDeviceChange,
}: AutoManagerProps) {
  const navigate = useNavigate();
  const location = useLocation();

  // 대표기기, 기기 명, 각 기기 별 자동화 세팅 - api나 저장소, 상위 컴포넌트에서 가져오기
  const { deodorize, focus, rest, detect } = location.state || {
    deodorize: true,
    focus: true,
    rest: true,
    detect: true,
  };
  const [autos, setAutos] = useState<Record<string, AutoMode>>({
    기기A: {
      탈취: deodorize,
      동작: {
        집중: focus,
        휴식: rest,
      },
      탐지: detect,
    },
    기기B: {
      탈취: deodorize,
      동작: {
        집중: focus,
        휴식: rest,
      },
      탐지: detect,
    },
    기기C: {
      탈취: deodorize,
      동작: {
        집중: focus,
        휴식: rest,
      },
      탐지: detect,
    },
  });
  const devices = Object.keys(autos);
  // 자동화 모드 세부 설정 버튼 클릭
  const handleSettingClick = (autoType: string) => {
    if (autoType === "동작") {
      navigate(`/control/auto/behavior`, {
        state: { focus, rest },
      });
    } else if (autoType === "탈취") {
      navigate(`/control/auto/deodorize`, {
        state: { deodorize },
      });
    } else {
      navigate(`/control/auto/detect`, {
        state: { detect },
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
          <DeviceSelect
            devices={devices}
            selectedDevice={selectedDevice}
            onDeviceChange={onDeviceChange}
          />
        </div>
      </div>
      <div className="flex flex-col mt-5 gap-4">
        {Object.entries(autos[selectedDevice]).map(([autoType, value]) => (
          <div
            key={autoType}
            className="w-[328px] h-[40px] px-4 bg-component text-16 flex justify-between items-center rounded-lg"
          >
            {autoType === "동작" ? (
              <div className="flex justify-between items-center w-full">
                <div>{autoType} 모드</div>
                <div className="flex flex-col gap-2">
                  <div className="flex">
                    <div>
                      {Object.entries(value as { [key: string]: boolean }).map(
                        ([subType, isOn]) => (
                          <div
                            key={subType}
                            className="flex pr-2 items-center gap-2 font-pre-light text-12"
                          >
                            <p>
                              {subType} {isOn ? "ON" : "OFF"}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                    <button onClick={() => handleSettingClick(autoType)}>
                      <img src={SettingIcon} alt="세팅 이미지" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center w-full">
                <div>{autoType} 모드</div>
                <div className="flex items-center gap-2">
                  <p>{value ? "ON" : "OFF"}</p>
                  <button onClick={() => handleSettingClick(autoType)}>
                    <img src={SettingIcon} alt="세팅 이미지" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
