interface ButtonProps {
  onClick?: () => void;
}

export default function Button({ onClick }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className="border-0.2 h-[30px] w-[65px] border-[#AFB1B6] text-center font-[Pretendard] text-[12px] font-light text-black rounded-lg active:text-component active:bg-brand active:border-0"
    >
      완료
    </button>
  );
}
