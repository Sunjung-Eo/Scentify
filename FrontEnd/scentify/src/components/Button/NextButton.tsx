interface NextButtonProps {
  onClick?: () => void;
}

export default function NextButton({ onClick }: NextButtonProps) {
  return (
    <button
      onClick={onClick}
      className="border-0.2 h-[30px] w-[65px] border-[#AFB1B6] text-center font-[Pretendard] text-[12px] font-light text-black rounded-lg"
    >
      다음
    </button>
  );
}
