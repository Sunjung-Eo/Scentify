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
    <div className="fixed inset-0 flex justify-center items-center z-50 p-6">
      <div className="flex flex-col w-[300px] h-[200px] p-10 bg-component font-pre-light text-14 rounded-lg">
        <p className="text-center mb-6">
          {getModeName()}모드로 변경하시겠습니까?
        </p>
        <div className="flex mt-auto justify-between">
          <button
            onClick={onConfirm}
            className="w-[65px] h-[30px] border-0.2 border-lightgray text-12 rounded-lg"
          >
            확인
          </button>
          <button
            onClick={onCancel}
            className="w-[65px] h-[30px] border-0.2 border-lightgray text-12 rounded-lg"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
}
