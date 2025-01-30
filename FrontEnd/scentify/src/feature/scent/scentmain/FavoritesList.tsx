import FavoriteScent from "./favoritescent";

// API에서 반환된 데이터 구조에 맞는 Favorite 타입 정의
interface Combination {
  name: string | null; // 콤비네이션 이름
  choice1: number;
  choice1Count: number;
  choice2: number | null;
  choice2Count: number | null;
  choice3: number | null;
  choice3Count: number | null;
  choice4: number | null;
  choice4Count: number | null;
}

interface Favorite {
  id: string; // 찜 항목의 고유 ID
  combination: Combination; // 향기 조합 데이터
}

// FavoritesList 컴포넌트 Props 타입 정의
//백엔드 API에서 가져온 데이터를 props로 받아와서 렌더링
interface FavoritesListProps {
  favorites: Favorite[]; //찜한 향기 조합 목록(배열)
  onToggleLike: (id: string) => void; // 찜 상태를 변경하는 함수, 해당 id(찜한 향기 조합의 ID)를 부모 컴포넌트로 전달하여 상태를 변경
  onShare: (id: string) => void; // 공유 버튼 클릭 시 호출되는 함수
}

// FavoritesList 컴포넌트 정의
const FavoritesList = ({
  favorites,
  onToggleLike,
  onShare,
}: FavoritesListProps) => {
  return (
    <div className="space-y-4">
      {favorites.map((favorite) => (
        <FavoriteScent
          key={favorite.id}
          combination={favorite.combination}
          isLiked={true} // 기본적으로 찜 상태로 표시
          onToggleLike={() => onToggleLike(favorite.id)}
          onShare={() => onShare(favorite.id)}
        />
      ))}
    </div>
  );
};

export default FavoritesList;
