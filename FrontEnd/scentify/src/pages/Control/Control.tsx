import { useState } from "react";
import { Mode } from "../../feature/control/main/ControlType";
import ModeToggle from "../../feature/control/main/ModeToggle";
import "../../styles/global.css";

const Control = () => {
  const [mode, setMode] = useState<Mode>(false);
  // 다른 모드 클릭 시 보여지는 화면 변경
  const handleModeChangeRequest = (currentMode: Mode) => {
    setMode(currentMode);
  };

  return (
    <div className="content">
      <div className="flex flex-col w-full px-4">
        <div>
          <h2 className="font-pre-medium text-xl mb-4">모드 설정</h2>
          <ModeToggle onModeChange={handleModeChangeRequest} mode={mode} />
        </div>
        <div className="mt-16 font-pre-medium text-xl">
          {mode === false ? <h1>예약 관리</h1> : <h2>자동화 모드 설정</h2>}
        </div>
      </div>
    </div>
  );
};

export default Control;
