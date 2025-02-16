import HeartButton from "../../../components/Button/HeartButton";
import ShareIcon from "../../../assets/icons/shareIcon.svg";
import { getScentName } from "../../../utils/control/scentUtils";
import { getColor } from "../../../utils/control/scentUtils";
import { Combination } from "./scenttypes";
import { useNavigate } from "react-router-dom";

// FavoriteScent 컴포넌트 Props 타입 정의
interface FavoriteScentProps {
  combination: Combination; // 향기 조합 데이터
  isLiked: boolean; // 찜 상태 여부(HeartButton 컴포넌트에 전달)
  onToggleLike: () => void; // 찜 상태를 변경하는 함수,isLiked 값을 반전(찜 or취소),하트버튼클릭시 호출
}

// FavoriteScent 컴포넌트 정의
const FavoriteScent = ({
  combination,
  isLiked,
  onToggleLike,
}: FavoriteScentProps) => {
  const navigate = useNavigate();

  // 🔹 공유 버튼 클릭 핸들러 (API 호출 없이 먼저 이동)
  const handleShareClick = () => {
    if (!combination || !combination.id) {
      console.error("🚨 공유 버튼 클릭 오류: combination 데이터가 없습니다!");
      return;
    }
    navigate("/scent/share", {
      state: {
        combination, // 향기 조합 정보만 먼저 전달
      },
    });
  };

  return (
    <div className="flex flex-col w-full pb-[20px] justify-between items-start border-b-0.2 border-lightgray">
      <div className="flex w-full mb-[4px] justify-between">
        {/* 조합 이름 */}
        <h3 className="text-14 text-brand font-pre-medium mb-1">
          {combination.name || "이름 없는 조합"}
        </h3>
        {/* 찜 & 공유 버튼 */}
        <div className="flex flex-row gap-3">
          <HeartButton isLiked={isLiked} onToggle={onToggleLike} />
          <button onClick={handleShareClick}>
            <img
              src={ShareIcon}
              alt="공유 아이콘"
              className="w-[17px] h-[18px]"
            />
          </button>
        </div>
      </div>

      {/* 향기 정보 */}
      <div className="text-10 text-sub font-pre-light flex gap-1">
        {[1, 2, 3, 4].map((num) => {
          const scentName = getScentName((combination as any)[`choice${num}`]);
          const scentCount = (combination as any)[`choice${num}Count`] || 0;

          if (scentCount === 0) return null;

          return (
            <span
              key={num}
              className="mr-[8px] flex items-center -space-x-[4px]"
            >
              {scentName}
              {Array.from({ length: scentCount }).map((_, i) => (
                <div
                  key={i}
                  className={`w-[14px] h-[6px] ml-[2px] rounded-full ${getColor(scentName)}`}
                  style={{ transform: "rotate(-65deg)" }}
                ></div>
              ))}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default FavoriteScent;
