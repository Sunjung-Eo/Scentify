import HeartButton from "../../../components/Button/HeartButton";
import ShareIcon from "../../../assets/icons/shareIcon.svg";
import { getScentName } from "../../../utils/control/scentUtils";
import { getColor } from "../../../utils/control/scentUtils";
import { Combination } from "./scenttypes";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { shareFavoriteCombination } from "../../../apis/scent/shareFavoriteCombination";
import { useAuthStore } from "../../../stores/useAuthStore"; //인증 정보 가져오기

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
  const [loading, setLoading] = useState(false);
  const { accessToken } = useAuthStore();

  // 공유 버튼 클릭 핸들러
  const handleShareClick = async () => {
    setLoading(true);
    try {
      console.log(`🔹 공유 요청 시작 - 조합 ID: ${combination.id}`);
      const response = await shareFavoriteCombination(
        combination.id,
        accessToken
      );
      console.log("🔹 API 응답:", response); // ✅ 응답 확인

      // 🔹 `success` 필드가 없더라도 응답에 `combination`이 있다면 성공으로 간주
      if (response && response.combination) {
        console.log("✅ 공유 성공, 페이지 이동");
        navigate("/scent/share", {
          state: {
            combination: response.combination,
            imageUrl: response.s3Url, // ✅ API 응답 확인 후, 정확한 키 사용
            shareUrl: response.shareUrl,
          },
        });

        console.log("🔹 응답에서 S3 URL:", response.s3Url);
      } else {
        console.error("API 응답 오류: success 필드 없음");
        alert(response.message || "공유 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error(" 공유 중 오류 발생:", error);
      alert("공유 요청을 처리하는 동안 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-between items-start">
      <div className="mb-[19px]">
        <div className="flex w-[310px] mb-[10px] mr-[10px] justify-between">
          {/* 조합 이름 */}
          <h3 className="text-14 text-brand font-pre-medium mb-1">
            {combination.name || "이름 없는 조합"}
          </h3>
          {/* 찜 & 공유 버튼 */}
          <div className="flex flex-row gap-3">
            <HeartButton isLiked={isLiked} onToggle={onToggleLike} />
            <button onClick={handleShareClick} disabled={loading}>
              <img
                src={ShareIcon}
                alt="공유 아이콘"
                className={`w-[17px] h-[18px] ${loading ? "opacity-50" : ""}`}
              />
            </button>
          </div>
        </div>

        {/* 향기 정보 */}
        <div className="text-10 text-sub font-pre-light flex gap-1">
          {[1, 2, 3, 4].map((num) => {
            const scentName = getScentName(
              (combination as any)[`choice${num}`]
            );
            const scentCount = (combination as any)[`choice${num}Count`] || 0;

            if (scentCount === 0) return null;

            return (
              <span key={num} className="mr-1 flex items-center gap-1">
                {scentName}
                {Array.from({ length: scentCount }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 ${getColor(scentName)}`}
                  ></div>
                ))}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FavoriteScent;
