import { ModeChangeModalProps } from "./ControlType";

// 모드 변경 모달창
export default function ModeChangeModal({
  nextMode,
  onConfirm,
  onCancel,
}: ModeChangeModalProps) {
  const getModeName = () => {
    return nextMode === false ? "예약 " : "자동화 ";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="text-sm flex h-[200px] w-[300px] flex-col rounded-lg bg-component p-10 font-pre-light">
        <p className="mb-6 text-center">
          {getModeName()}모드로 변경하시겠습니까?
        </p>
        <div className="mt-auto flex justify-between">
          <button
            onClick={onConfirm}
            className="border text-xs h-[30px] w-[65px] rounded-lg border-lightgray"
          >
            확인
          </button>
          <button
            onClick={onCancel}
            className="border text-xs h-[30px] w-[65px] rounded-lg border-lightgray"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
}
