import { useEffect } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

import { useAuthStore } from "../../../stores/useAuthStore";
import { useFavoriteStore } from "../../../stores/useFavoriteStore";

import { getAllFavorite } from "../../../apis/scent/getAllFavorite";
import { deleteFavorite } from "../../../apis/scent/deleteFavorite";

import ScentCarousel from "./scentcarousel";
import FavoritesList from "./FavoritesList";
import bookmarkIcon from "../../../assets/icons/bookmark.svg";

const ScentMain = () => {
  // 인증토큰
  const authStore = useAuthStore();
  const accessToken = authStore.accessToken;

  const favoriteStore = useFavoriteStore();
  const setFavoritesData = favoriteStore.setFavoritesData;
  const favoritesData = favoriteStore.favoritesData;

  // ScentMain 마운트 시 강제 리페치
  // useEffect(() => {
  //   refetch();
  // }, []);

  // 기존 db 찜 리스트
  // 찜 리스트 전체조회
  const queryClient = useQueryClient();
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
  useEffect(() => {
    console.log("dasd", favoritesData.favorites);
  }, [favoritesData]);
  // const favoritesData = favoriteStore.favoritesData || fetchedFavoritesData;

  // 찜 버튼 클릭 시 단일 삭제
  const deleteSingleMutation = useMutation({
    mutationFn: (id: number) => deleteFavorite(id, accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favoritesData"] });
      refetch();
    },
    onError: (error) => {
      console.error("찜 목록 업데이트 실패:", error);
    },
  });
  // 찜 버튼 핸들러
  const handleToggleLike = (id: number) => {
    deleteSingleMutation.mutate(id);
  };

  // 공유 버튼 클릭 함수(id는 공유할 향기의 ID)
  const handleShare = (id: string) => {
    // `favoritesData`에서 해당 ID에 맞는 항목을 찾기
    const favorite = favoritesData.find((fav: any) => fav.id === id);

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
        <div className="overflow-y-auto max-h-[259px]">
          {/* FavoritesList 렌더링 ( favoritesData 배열을 받아서 렌더링)*/}
          {/* {favoritesData.favorites.length > 0 ? (
            <FavoritesList
              favorites={favoritesData.favorites}
              onToggleLike={handleToggleLike}
              onShare={handleShare}
            />
          ) : (
            ""
          )} */}
        </div>
      </div>
    </div>
  );
};

export default ScentMain;
