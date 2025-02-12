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
      className="font-pre-light fixed inset-0 flex items-center justify-center bg-black/50 z-50"
      onClick={onClose}
    >
      <div
        className="flex flex-col items-center max-w-[320px] w-full p-6 rounded-2xl border-black/10 bg-white shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 메시지 가운데 정렬 */}
        <p className="text-12 text-gray-700 mb-4 text-center">{message}</p>

        {/* 확인 버튼을 중앙 정렬 & 크기 조정 */}
        <div className="flex justify-center w-full">
          <button
            className="w-[60px] h-[30px] px-3 py-1 rounded-lg bg-[#2D3319] text-white text-12 font-medium hover:opacity-90"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Alert;
