import { useState } from "react";
import { AlertControl } from "../../../components/Alert/AlertControl";
import { ModeToggleProps } from "./ControlType";

// 예약 모드 / 자동화 모드 토글
export default function ModeToggle({
  currentMode,
  onModeChange,
}: ModeToggleProps) {
  const [alertOpen, setalertOpen] = useState(false);
  const handleAlert = () => {
    setalertOpen(true);
  };
  const handleCloseAlert = () => {
    setalertOpen(false);
  };

  if (currentMode === null) {
    return (
      <div className="w-full">
        <div
          onClick={() => handleAlert()}
          className="flex w-full h-[34px] p-[3px] items-center justify-center bg-white border-[0.5px] border-lightgray text-lightgray font-pre-light text-12 rounded-lg"
        >
          <div className="flex-1 flex h-full items-center justify-center rounded-md text-center transition-all">
            예약 모드
          </div>
          <div className="flex-1 flex h-full items-center justify-center rounded-md text-center transition-all">
            자동화 모드
          </div>
        </div>
        {alertOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <AlertControl
              message="기기를 먼저 등록해주세요."
              showButtons={true}
              onConfirm={handleCloseAlert}
            />
          </div>
        )}
      </div>
    );
  }
  return (
    <div className="w-full">
      <div className="flex w-full h-[34px] p-[3px] items-center justify-center bg-white border-[0.5px] border-brand font-pre-light text-12 rounded-lg">
        <div
          onClick={() => onModeChange(false)}
          className={`flex-1 flex h-full items-center justify-center rounded-md text-center transition-all ${
            Boolean(currentMode) === false ? "bg-brand text-bg" : "text-brand"
          }`}
        >
          예약 모드
        </div>
        <div
          onClick={() => onModeChange(true)}
          className={`flex-1 flex h-full items-center justify-center rounded-md text-center transition-all ${
            Boolean(currentMode) === true ? "bg-brand text-bg" : "text-brand"
          }`}
        >
          자동화 모드
        </div>
      </div>
    </div>
  );
}
