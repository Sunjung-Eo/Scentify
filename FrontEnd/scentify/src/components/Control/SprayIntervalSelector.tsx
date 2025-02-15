import { useState } from "react";
import ArrowDownIcon from "../../assets/icons/arrow-down-icon.svg";

interface SprayIntervalSelectorProps {
  selectedTime: string;
  onTimeSelect: (time: string) => void;
}

// 분사 주기
export default function SprayIntervalSelector({
  selectedTime,
  onTimeSelect,
}: SprayIntervalSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const handleSelectTime = (time: string) => {
    setIsOpen(false);
    onTimeSelect(time);
  };

  return (
    <div className="text-black">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-[82px] h-[36px] p-3 bg-white border-0.2 border-lightgray font-pre-light text-12 items-center justify-between rounded-lg"
      >
        {selectedTime} <img src={ArrowDownIcon} alt="아래 화살표 이미지" />
      </button>
      {isOpen && (
        <div className="w-[82px] font-pre-light text-12">
          <ul className="border-0.2 border-lightgray bg-white rounded-lg">
            {["5분", "15분", "30분", "60분"].map((time) => (
              <li
                key={time}
                onClick={() => handleSelectTime(time)}
                className="p-1 pl-3"
              >
                {time}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
