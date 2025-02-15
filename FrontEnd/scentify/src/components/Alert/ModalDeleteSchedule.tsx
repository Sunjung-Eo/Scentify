interface ModalDeleteScheduleProps {
  message: string;
  showButtons?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
}
// 예약 삭제 모달창
const ModalDeleteSchedule = ({
  message,
  showButtons = true,
  onConfirm,
  onCancel,
  confirmText = "확인",
  cancelText = "취소",
}: ModalDeleteScheduleProps) => {
  return (
    <div
      className="font-pre-light fixed inset-0 flex items-center justify-center bg-black/50 z-50"
      onClick={onCancel}
    >
      <div
        className="flex flex-col max-w-[260px] w-full h-[300px] p-6 rounded-2xl border-black/10 bg-white shadow-[20px_20px_20px_rgba(0,0,0,0.08)]"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-center text-12 text-gray-700 mb-4 mt-[100px]">
          {message}
        </p>
        {showButtons && (
          <div className="flex p-3 pt-[70px] justify-between gap-2">
            <button
              className="w-[60px] py-2 border-0.2 border-sub rounded-lg bg-gray-300 text-sub text-12 hover:opacity-90"
              onClick={onCancel}
            >
              {cancelText}
            </button>
            <button
              className="w-[60px] py-2 rounded-lg bg-[#2D3319] text-white text-12 hover:opacity-90"
              onClick={onConfirm}
            >
              {confirmText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalDeleteSchedule;
