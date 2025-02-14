import { useEffect } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

import { useAuthStore } from "../../../stores/useAuthStore";
import { useFavoriteStore } from "../../../stores/useFavoriteStore";
import { useUserStore } from "../../../stores/useUserStore";

import { getAllFavorite } from "../../../apis/scent/getAllFavorite";
import { deleteFavorite } from "../../../apis/scent/deleteFavorite";

import ScentCarousel from "./scentcarousel";
import FavoritesList from "./FavoritesList";
import bookmarkIcon from "../../../assets/icons/bookmark.svg";
import { homeInfo } from "../../../apis/home/homeInfo";

const ScentMain = () => {
  // 인증토큰
  const authStore = useAuthStore();
  const accessToken = authStore.accessToken;

  const userstore = useUserStore();

  // 마운트 시 동기화
  const queryClient = useQueryClient();
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["favoritesData"] });
    refetch();
  }, []);

  const favoriteStore = useFavoriteStore();
  const setFavoritesData = favoriteStore.setFavoritesData;
  const favoritesData = favoriteStore.favoritesData;
  const setFavorites = favoriteStore.setFavorites;
  const setFavoriteIds = favoriteStore.setFavoriteIds;

  // 기존 db 찜 리스트
  // 찜 리스트 전체조회
  const { data: fetchedFavoritesData, refetch } = useQuery({
    queryKey: ["favoritesData"],
    queryFn: () => getAllFavorite(accessToken),
    staleTime: 0,
    refetchOnMount: "always",
    initialData: { favorites: [] },
  });

  useEffect(() => {
    if (fetchedFavoritesData) {
      setFavoritesData(fetchedFavoritesData);
    }
  }, [fetchedFavoritesData, setFavoritesData]);
  useEffect(() => {}, [favoritesData]);

  // 찜 버튼 클릭 시 단일 삭제
  const deleteSingleMutation = useMutation({
    mutationFn: (id: number) => deleteFavorite(id, accessToken),
    onSuccess: (_, deletedId) => {
      // 전역store 업데이트
      const updatedFavoriteIds = favoritesData.favorites
        .filter((item: any) => item.combination.id !== deletedId)
        .map((item: any) => item.combination.id);
      console.log("삭제후 적용할 id들", updatedFavoriteIds);
      console.log("delete", deletedId);
      // setFavoriteIds(updatedFavoriteIds);
      setFavorites(updatedFavoriteIds);
      queryClient.setQueryData(["favoritesData"], () => ({
        favorites: favoritesData.favorites.filter(
          (item: any) => item.id !== deletedId
        ),
      }));
      console.log("1번이에요", favoriteStore);
      // query 업데이트
      queryClient.invalidateQueries({ queryKey: ["favoritesData"] });
      queryClient.invalidateQueries({ queryKey: ["homeInfo"] });
      console.log("2번에요", favoriteStore);
    },
  });

  // 찜 버튼 핸들러
  const handleToggleLike = async (id: number) => {
    try {
      await deleteSingleMutation.mutateAsync(id);

      // 추가 작업 수행 가능
    } catch (error) {
      console.error("삭제 실패:", error);
    }
  };

  // 공유 버튼 클릭 함수(id는 공유할 향기의 ID)
  const handleShare = (id: string) => {
    // `favoritesData`에서 해당 ID에 맞는 항목을 찾기
    const favorite = favoritesData.find((fav: any) => fav.id === id);

    // 불필요한 if문 제거하고 바로 실행
    console.log(`Shared combination for ID: ${id}`);
    alert(`${favorite!.combination.name} 향기를 공유합니다.`);
  };

  // useEffect(() => {
  //   return () => {
  //     queryClient.invalidateQueries({ queryKey: ["homeInfo"] });
  //   };
  // }, []);

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
        <div className="overflow-y-auto max-h-[259px]">
          {favoritesData.favorites.length > 0 ? (
            <FavoritesList
              favorites={favoritesData.favorites}
              onToggleLike={handleToggleLike}
              onShare={handleShare}
            />
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default ScentMain;
