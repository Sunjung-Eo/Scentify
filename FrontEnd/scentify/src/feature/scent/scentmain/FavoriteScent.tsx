import HeartButton from "../../../components/Button/HeartButton";
import ShareIcon from "../../../assets/icons/shareIcon.svg";
import { Combination } from "./scenttypes";

// FavoriteScent 컴포넌트 Props 타입 정의
interface FavoriteScentProps {
  combination: Combination; // 향기 조합 데이터
  isLiked: boolean; // 찜 상태 여부(HeartButton 컴포넌트에 전달)
  onToggleLike: () => void; // 찜 상태를 변경하는 함수,isLiked 값을 반전(찜 or취소),하트버튼클릭시 호출
  onShare: () => void; // 공유 버튼 클릭 시 호출되는 함수
}

// FavoriteScent 컴포넌트 정의
const FavoriteScent = ({
  combination,
  isLiked,
  onToggleLike,
  onShare,
}: FavoriteScentProps) => {
  return (
    <div className="flex justify-between items-start">
      <div className="mb-[19px]">
        {/* 조합 이름 */}
        <h3 className="text-14 text-brand font-pre-medium mb-1">
          {combination.name || "이름 없는 조합"}
        </h3>
        {/* 향기 정보 */}
        <p className="text-10 text-sub font-pre-light flex gap-1">
          <span className="mr-1">
            {combination.choice1} ({combination.choice1Count})
          </span>
          <span className="mr-1">
            {combination.choice2 || "없음"} (
            {combination.choice2Count || "없음"})
          </span>
          <span className="mr-1">
            {combination.choice3 || "없음"} (
            {combination.choice3Count || "없음"})
          </span>
          <span>
            {combination.choice4 || "없음"} (
            {combination.choice4Count || "없음"})
          </span>
        </p>
      </div>
      {/* 찜 & 공유 버튼 */}
      <div className="flex flex-row gap-3">
        <HeartButton isLiked={isLiked} onToggle={onToggleLike} />
        <button onClick={onShare}>
          <img
            src={ShareIcon}
            alt="공유 아이콘"
            className="w-[17px] h-[18px]"
          />
        </button>
      </div>
    </div>
  );
};

export default FavoriteScent;
