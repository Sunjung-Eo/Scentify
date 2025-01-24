import { useState } from "react";
import { Mode } from "../../feature/control/main/ControlType";
import ModeToggle from "../../feature/control/main/ModeToggle";
import ReservationManager from "../../feature/control/reservation/ReservationManager";
import AutoManager from "../../feature/control/automation/AutoManager";
import ModeChangeModal from "../../feature/control/main/ModeChangeModal";
import "../../styles/global.css";
import RemoteIcon from "../../assets/icons/remote-icon.svg";

const Control = () => {
  // mode - 어떤 모드인지 백엔드에 전달할 것
  const [mode, setMode] = useState<Mode>(false); // 백엔드에 전달한 현재 모드 상태
  const [isModal, setIsModal] = useState<boolean>(false); // 모달 활성화
  const [nextMode, setNextMode] = useState<Mode>(false); // 모달창 확인 버튼
  const [isFirstRender, setIsFirstRender] = useState<boolean>(true); // 처음 디폴트 모드 (예약 모드)
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

  return (
    <div className="content pt-5">
      <div className="flex w-full flex-col px-4">
        <div>
          <div className="mb-4 flex items-center gap-1">
            <img src={RemoteIcon} alt="리모컨 이미지" />
            <h2 className="text-xl mt-0.5 font-pre-medium">모드 설정</h2>
          </div>
          <ModeToggle currentMode={mode} onModeChange={handleModeChange} />
        </div>
        <div className="text-xl mt-14 font-pre-medium">
          {isFirstRender ? (
            <ReservationManager />
          ) : mode === false ? (
            <ReservationManager />
          ) : (
            <AutoManager />
          )}
          {isModal && (
            <ModeChangeModal
              nextMode={nextMode}
              onConfirm={handleConfirm}
              onCancel={handleCancel}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Control;
