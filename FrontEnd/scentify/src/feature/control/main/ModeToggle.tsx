import { ModeToggleProps } from "./ControlType";
import "../../../styles/global.css";

// 예약 모드 / 자동화 모드 토글
export default function ModeToggle({
  currentMode,
  onModeChange,
}: ModeToggleProps) {
  return (
    <div>
      <div className="border text-xs flex rounded-lg border-brand bg-white font-pre-light">
        <div
          onClick={() => onModeChange(false)}
          className={`flex-1 rounded-lg py-2 text-center transition-all ${currentMode === true ? "text-black" : "bg-brand text-white"}`}
        >
          예약 모드
        </div>
        <div
          onClick={() => onModeChange(true)}
          className={`flex-1 rounded-lg py-2 text-center transition-all ${currentMode === false ? "text-black" : "bg-brand text-white"}`}
        >
          자동화 모드
        </div>
      </div>
    </div>
  );
}
