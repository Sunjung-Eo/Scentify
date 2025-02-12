import { ModeToggleProps } from "./ControlType";

// 예약 모드 / 자동화 모드 토글
export default function ModeToggle({
  currentMode,
  onModeChange,
}: ModeToggleProps) {
  if (currentMode === null) {
    return;
  }
  return (
    <div>
      <div className="flex w-[180px] mb-[12px] bg-white border-0.2 border-brand font-pre-light text-12 rounded-lg">
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
