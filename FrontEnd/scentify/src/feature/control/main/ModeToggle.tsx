import { ModeToggleProps } from "./ControlType";
import "../../../styles/global.css";

// 예약 모드 / 자동화 모드 토글
export default function ModeToggle({
  currentMode,
  onModeChange,
}: ModeToggleProps) {
  console.log("현재상태", currentMode);
  return (
    <div>
      <div className="flex bg-white border-0.2 border-brand font-pre-light text-12 rounded-lg">
        <div
          onClick={() => onModeChange(false)}
          className={`flex-1 rounded-lg py-2 text-center transition-all ${
            Boolean(currentMode) === false
              ? "bg-brand text-white"
              : "text-black"
          }`}
        >
          예약 모드
        </div>
        <div
          onClick={() => onModeChange(true)}
          className={`flex-1 rounded-lg py-2 text-center transition-all ${
            Boolean(currentMode) === true ? "bg-brand text-white" : "text-black"
          }`}
        >
          자동화 모드
        </div>
      </div>
    </div>
  );
}
