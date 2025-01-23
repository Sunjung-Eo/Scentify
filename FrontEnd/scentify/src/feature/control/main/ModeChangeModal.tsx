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
    <div className="justify-center items-center z-50 p-6">
      <div className="flex flex-col bg-component rounded-lg font-pre-light text-sm w-full p-10 h-[200px]">
        <p className="text-center mb-6">
          {getModeName()}모드로 변경하시겠습니까?
        </p>
        <div className="flex justify-center space-x-20 mt-auto">
          <button
            onClick={onConfirm}
            className="px-4 py-2 border border-lightgray rounded-lg"
          >
            확인
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-lightgray rounded-lg"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
}
