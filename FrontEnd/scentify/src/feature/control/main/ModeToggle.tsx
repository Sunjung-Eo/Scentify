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
      <div className="flex w-[150px] h-[30px] p-[3px] items-center justify-center bg-white border-[0.5px] border-brand font-pre-light text-10 rounded-lg">
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
