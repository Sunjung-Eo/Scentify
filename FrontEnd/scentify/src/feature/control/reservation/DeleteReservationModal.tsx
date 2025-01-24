import { DeleteModalProps } from "./ReservationType";

export default function DeleteConfirmModal({
  onConfirm,
  onCancel,
}: DeleteModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="text-sm flex h-[200px] w-[300px] flex-col rounded-lg bg-component p-10 font-pre-light">
        <p className="mb-6 text-center">예약을 삭제하시겠습니까?</p>
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
