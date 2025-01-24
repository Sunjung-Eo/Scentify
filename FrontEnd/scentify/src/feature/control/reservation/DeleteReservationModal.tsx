import { DeleteModalProps } from "./ReservationType";

export default function DeleteConfirmModal({
  onConfirm,
  onCancel,
}: DeleteModalProps) {
  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 p-6">
      <div className="flex flex-col w-[300px] h-[200px] p-10 bg-component font-pre-light text-14 rounded-lg">
        <p className="text-center mb-6">예약을 삭제하시겠습니까?</p>
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
