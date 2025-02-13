interface AlertScheduleProps {
  message: string;
  showButtons?: boolean; // 버튼들을 모두 제어하는 prop
  onConfirm?: () => void; // 확인 버튼 클릭 시 실행할 함수
}

export const AlertScheduleModal = ({
  message,
  showButtons = true,
  onConfirm,
}: AlertScheduleProps) => {
  return (
    <div
      className="flex flex-col max-w-[320px] w-full p-6 rounded-2xl border-black/10 bg-white shadow-[20px_20px_20px_rgba(0,0,0,0.08)]"
      onClick={(e) => e.stopPropagation()}
    >
      <p className="text-12 text-gray-700 mb-4 text-center">{message}</p>
      {showButtons && (
        <div className="text-center">
          <button
            className="w-[60px] py-2 rounded-lg bg-[#2D3319] text-white text-12 hover:opacity-90"
            onClick={onConfirm}
          >
            확인
          </button>
        </div>
      )}
    </div>
  );
};
