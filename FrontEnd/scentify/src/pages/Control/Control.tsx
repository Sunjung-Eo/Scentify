import { useState } from "react";
import { Mode } from "../../feature/control/main/ControlType";
import ModeToggle from "../../feature/control/main/ModeToggle";
import ReservationManager from "../../feature/control/reservation/ReservationManager";
import AutoManager from "../../feature/control/automation/AutoManager";
import ModeChangeModal from "../../feature/control/main/ModeChangeModal";
import "../../styles/global.css";

const Control = () => {
  const [mode, setMode] = useState<Mode>(false);
  const [isModal, setIsModal] = useState<boolean>(false);
  const [nextMode, setNextMode] = useState<Mode>(false);
  // 다른 모드 클릭 시 모달 표시
  const handleModeChangeRequest = (newMode: Mode) => {
    if (mode !== newMode) {
      setNextMode(newMode);
      setIsModal(true);
    }
  };
  // 모달 창 확인 버튼
  const handleConfirm = () => {
    setMode(nextMode);
    setIsModal(false);
  };
  // 모달 창 취소 버튼
  const handleCancel = () => {
    setIsModal(false);
  };

  return (
    <div className="content">
      <div className="flex flex-col w-full px-4">
        <div>
          <h2 className="font-pre-medium text-xl mb-4">모드 설정</h2>
          <ModeToggle
            currentMode={mode}
            onModeChange={handleModeChangeRequest}
          />
        </div>
        <div className="mt-16 font-pre-medium text-xl">
          {mode === false ? <ReservationManager /> : <AutoManager />}
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
