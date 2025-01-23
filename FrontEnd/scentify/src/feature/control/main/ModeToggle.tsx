import { ModeToggleProps } from "./ControlType";
import "../../../styles/global.css";

// 예약 모드 / 자동화 모드 토글
export default function ModeToggle({
  currentMode,
  onModeChange,
}: ModeToggleProps) {
  return (
    <div>
      <div className="flex bg-white border border-brand font-pre-light text-xs rounded-lg">
        <div
          onClick={() => onModeChange(false)}
          className={`flex-1 py-2 text-center transition-all rounded-lg ${currentMode === true ? "text-black" : "bg-brand text-white"}`}
        >
          예약 모드
        </div>
        <div
          onClick={() => onModeChange(true)}
          className={`flex-1 py-2 text-center transition-all rounded-lg ${currentMode === false ? "text-black" : "bg-brand text-white"}`}
        >
          자동화 모드
        </div>
      </div>
    </div>
  );
}
