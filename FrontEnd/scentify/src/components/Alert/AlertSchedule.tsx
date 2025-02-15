interface AlertScheduleProps {
  message: string;
  showButtons?: boolean;
  onConfirm?: () => void;
}
// 기존에 존재하는 시간을 예약한 경우 알람창
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
