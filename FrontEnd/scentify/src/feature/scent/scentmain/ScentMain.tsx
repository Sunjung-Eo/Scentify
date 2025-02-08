import ScentCarousel from "./scentcarousel";
import FavoritesList from "./FavoritesList";
import bookmarkIcon from "../../../assets/icons/Bookmark.svg";
import { removeCombinationFromFavorites } from "../../../apis/scent/favorite";

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
  const handleToggleLike = async (id: string) => {
    try {
      const response = await removeCombinationFromFavorites(id);

      if (response === 200) {
        alert("찜한 향기 조합이 삭제되었습니다.");
        console.log(`Deleted favorite combination: ${id}`);
      }
    } catch (error) {
      alert("삭제 중 오류가 발생했습니다.");
    }
  };
  // 공유 버튼 클릭 함수(id는 공유할 향기의 ID)
  const handleShare = (id: string) => {
    // `favoritesData`에서 해당 ID에 맞는 항목을 찾
    const favorite = favoritesData.find((fav) => fav.id === id);

    // 불필요한 if문 제거하고 바로 실행
    console.log(`Shared combination for ID: ${id}`);
    alert(`${favorite!.combination.name} 향기를 공유합니다.`);
  };

  return (
    <div className="px-4 pt-[16px]">
      {/* 브랜드 향기 카드를 보여주는 캐러셀 */}
      <div className="mb-[60px]">
        <h2 className="text-10 text-sub font-pre-light mb-2">
          각 카드를 눌러 브랜드 향을 알아보세요.
        </h2>
        <ScentCarousel />
      </div>

      {/* 찜한 향기 목록 */}
      <div>
        <div className="flex items-center mb-4">
          <img src={bookmarkIcon} alt="북마크" className="w-6 h-6 mr-2" />
          <h3 className="text-20 text-sub font-pre-medium">찜한 향기</h3>
        </div>

        {/* FavoritesList 렌더링 ( favoritesData 배열을 받아서 렌더링)*/}
        <FavoritesList
          favorites={favoritesData} // favoritesData를 받아 각 향기 조합을 리스트 형태로 렌더링.
          onToggleLike={handleToggleLike} //찜,취소할 때 실행되는 함수
          onShare={handleShare} //공유 버튼을 클릭하면 실행되는 함수.
        />
      </div>
    </div>
  );
};

export default ScentMain;
