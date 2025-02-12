import { useEffect, useState } from "react";
import HeartIcon from "../../assets/icons/heart-icon.svg";
import FillHeartIcon from "../../assets/icons/fill-heart-icon.svg";

interface HeartButtonProps {
  isLiked?: boolean;
  onToggle?: (newState: boolean) => void;
}

export default function HeartButton({ isLiked, onToggle }: HeartButtonProps) {
  const [isFilled, setIsFilled] = useState(isLiked);
  useEffect(() => {
    // console.log(isFilled);
  }, [isFilled]);
  const handleClick = () => {
    const newState = !isFilled;
    setIsFilled(newState);
    if (onToggle) {
      onToggle(newState);
    }
  };

  return (
    <button onClick={handleClick}>
      {isFilled ? (
        <img src={FillHeartIcon} alt="채워진 하트 이미지" />
      ) : (
        <img src={HeartIcon} alt="하트 이미지" />
      )}
    </button>
  );
}
