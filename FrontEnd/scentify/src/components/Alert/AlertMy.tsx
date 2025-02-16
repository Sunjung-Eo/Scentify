interface AlertProps {
  message: string;
  onClose: () => void;
  onConfirm?: () => void; // 확인 버튼 클릭 시 실행할 함수
  confirmText?: string; // 확인 버튼 텍스트 (기본값: "확인")
}

const Alert = ({
  message,
  onClose,
  onConfirm = onClose,
  confirmText = "확인",
}: AlertProps) => {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
      onClick={onClose}
    >
      <div
        className="w-[260px] h-[120px] bg-white rounded-2xl border-[1px] border-gray flex flex-col items-center justify-center shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 모달 메시지 */}
        <p className="text-12 font-pre-regular mb-5 text-center">{message}</p>

        {/* 확인 버튼 */}
        <button
          className="w-[60px] h-[30px] bg-sub font-pre-light text-12 text-white rounded-lg focus:outline-none"
          onClick={onConfirm}
        >
          {confirmText}
        </button>
      </div>
    </div>
  );
};

export default Alert;
