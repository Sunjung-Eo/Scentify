import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Mode } from "../../feature/control/main/ControlType";
import ModeToggle from "../../feature/control/main/ModeToggle";
import ReservationManager from "../../feature/control/reservation/ReservationManager";
import AutoManager from "../../feature/control/automation/AutoManager";
import ModeChangeModal from "../../feature/control/main/ModeChangeModal";
import BehaviorSetting from "../../feature/control/automation/BehaviorSetting";
import DeodorizationSetting from "../../feature/control/automation/DeodorizationSetting";
import "../../styles/global.css";
import RemoteIcon from "../../assets/icons/remote-icon.svg";

const Control = () => {
  // mode - 어떤 모드인지 백엔드에 전달할 것
  const [mode, setMode] = useState<Mode>(false); // 백엔드에 전달한 현재 모드 상태
  const [isModal, setIsModal] = useState<boolean>(false); // 모달 활성화
  const [nextMode, setNextMode] = useState<Mode>(false); // 모달창 확인 버튼
  const [isFirstRender, setIsFirstRender] = useState<boolean>(true); // 처음 디폴트 모드 (예약 모드)
  const [selectedDevice, setSelectedDevice] = useState("기기A"); // 선택한 기기

  // 다른 모드 클릭 시 모달 표시
  const handleModeChange = (newMode: Mode) => {
    if (mode !== newMode) {
      setNextMode(newMode);
      setIsModal(true);
    }
  };
  // 모달 창 확인 버튼
  // 확인 눌렀을 때 백엔드에 전달하는 추가 로직 필요
  const handleConfirm = () => {
    setMode(nextMode);
    setIsModal(false);
    setIsFirstRender(false);
  };
  // 모달 창 취소 버튼
  const handleCancel = () => {
    setIsModal(false);
  };

  // 기기 선택
  const handleDeviceChange = (device: string) => {
    setSelectedDevice(device);
  };

  return (
    <div className="content pt-5">
      <Routes>
        <Route
          index
          element={
            <div className="flex flex-col w-full px-4">
              <div>
                <div className="flex mb-4 items-center gap-1">
                  <img src={RemoteIcon} alt="리모컨 이미지" />
                  <h2 className="mt-0.5 font-pre-medium text-20">모드 설정</h2>
                </div>
                <ModeToggle
                  currentMode={mode}
                  onModeChange={handleModeChange}
                />
              </div>
              <div
                className={`font-pre-medium text-20 ${
                  isFirstRender || !mode ? "mt-14" : "mt-0"
                }`}
              >
                {isFirstRender || !mode ? (
                  <ReservationManager
                    selectedDevice={selectedDevice}
                    onDeviceChange={handleDeviceChange}
                  />
                ) : (
                  <div>
                    <div className="h-[130px] mt-5 mb-10 p-4 bg-component rounded-lg">
                      <p>자동화 모드 설명 ~~~</p>
                    </div>
                    <AutoManager
                      selectedDevice={selectedDevice}
                      onDeviceChange={handleDeviceChange}
                    />
                  </div>
                )}
              </div>

              {isModal && (
                <ModeChangeModal
                  nextMode={nextMode}
                  onConfirm={handleConfirm}
                  onCancel={handleCancel}
                />
              )}
            </div>
          }
        />
        <Route index element={<AutoManager />} />
        <Route path="auto/behavior" element={<BehaviorSetting />} />
        <Route path="auto/deodorize" element={<DeodorizationSetting />} />
      </Routes>
    </div>
  );
};

export default Control;
