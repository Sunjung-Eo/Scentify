import FavoriteScent from "./FavoriteScent";
import { Favorite } from "./scenttypes";

interface FavoritesListProps {
  favorites: Favorite[];
  onToggleLike: (id: number) => void;
  onShare: (id: string) => void;
}

const FavoritesList = ({ favorites, onToggleLike }: FavoritesListProps) => {
  // 초기 렌더링 전 로딩
  if (
    !favorites ||
    favorites.length === 0 ||
    favorites.some((fav) => !fav.combination)
  ) {
    return;
  }

  return (
    <div className="flex flex-col w-full mb-[20px] px-[10px]">
      {favorites.map((favorite: any) => (
        <FavoriteScent
          key={favorite.id}
          combination={favorite.combination}
          isLiked={true} // 기본적으로 찜 상태로 표시
          onToggleLike={() => onToggleLike(favorite.combination.id)}
        />
      ))}
    </div>
  );
};

export default FavoritesList;
