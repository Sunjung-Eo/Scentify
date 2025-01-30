import ScentCarousel from "./scentcarousel";
import FavoritesList from "./favoriteslist";
import bookmarkIcon from "../../../assets/icons/Bookmark.svg";

// 찜한 향기 데이터
const favoritesData = [
  {
    id: "1",
    combination: {
      name: "아침에 맡고 싶은 향",
      choice1: 1,
      choice1Count: 0,
      choice2: 2,
      choice2Count: 1,
      choice3: 3,
      choice3Count: 2,
      choice4: null,
      choice4Count: null,
    },
  },
  {
    id: "2",
    combination: {
      name: "밤의 포근한 향",
      choice1: 4,
      choice1Count: 2,
      choice2: 5,
      choice2Count: 1,
      choice3: null,
      choice3Count: null,
      choice4: null,
      choice4Count: null,
    },
  },
  {
    id: "3",
    combination: {
      name: "봄날의 상쾌함",
      choice1: 6,
      choice1Count: 2,
      choice2: 7,
      choice2Count: 3,
      choice3: 8,
      choice3Count: 1,
      choice4: null,
      choice4Count: null,
    },
  },
];

const ScentMain = () => {
  // 찜 상태 토글 함수
  const handleToggleLike = (id: string) => {
    console.log(`Toggled like for ID: ${id}`);
    // 여기에 찜 상태 변경 로직 추가 가능
  };

  // 공유 버튼 클릭 함수
  const handleShare = (id: string) => {
    console.log(`Shared combination for ID: ${id}`);
    alert(`${id} 향기를 공유합니다.`);
  };

  return (
    <div className="content px-4">
      {/* 브랜드 향기 카드를 보여주는 캐러셀 */}
      <div className="mb-8">
        <h2 className="text-center text-gray-600 mb-2">
          각 카드를 눌러 브랜드 향을 알아보세요.
        </h2>
        <ScentCarousel />
      </div>

      {/* 찜한 향기 목록 */}
      <div>
        <div className="flex items-center mb-4">
          <img src={bookmarkIcon} alt="북마크" className="w-5 h-5 mr-2" />
          <h3 className="text-lg font-bold">찜한 향기</h3>
        </div>

        {/* FavoritesList 렌더링 */}
        <FavoritesList
          favorites={favoritesData}
          onToggleLike={handleToggleLike}
          onShare={handleShare}
        />
      </div>
    </div>
  );
};

export default ScentMain;
