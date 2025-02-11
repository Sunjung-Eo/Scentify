import { useEffect } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

import { useAuthStore } from "../../../stores/useAuthStore";
import { useFavoriteStore } from "../../../stores/useFavoriteStore";

import { getAllFavorite } from "../../../apis/scent/getAllFavorite";
import { createFavorite } from "../../../apis/scent/createFavorite";
import {
  deleteFavorite,
  deleteAllFavorite,
} from "../../../apis/scent/deleteFavorite";

import ScentCarousel from "./scentcarousel";
import FavoritesList from "./FavoritesList";
import bookmarkIcon from "../../../assets/icons/bookmark.svg";

const ScentMain = () => {
  // 인증토큰
  const authStore = useAuthStore();
  const accessToken = authStore.accessToken;
  const favoriteStore = useFavoriteStore();
  const favorites = favoriteStore.favorites;
  const favoriteIds = favoriteStore.favoriteIds;
  const deleteFavoriteIds = favoriteStore.deleteFavoriteIds;
  const setFavoriteIds = favoriteStore.setFavoriteIds;
  const setDeleteFavoriteIds = favoriteStore.setDeleteFavoriteIds;
  // const favoritesData = favoriteStore.favoritesData;
  const setFavoritesData = favoriteStore.setFavoritesData;
  useEffect(() => {
    console.log("sc찜아이디들", favoriteIds);
    console.log("sc삭제할찜아이디들", deleteFavoriteIds);
  }, [favoriteIds, deleteFavoriteIds]);

  // ScentMain 마운트 시 강제 리페치
  useEffect(() => {
    refetch();
  }, []);

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
      console.log("📌 Zustand 상태 업데이트", fetchedFavoritesData);
      setFavoritesData(fetchedFavoritesData);
    }
  }, [fetchedFavoritesData, setFavoritesData]);

  const favoritesData = favoriteStore.favoritesData || fetchedFavoritesData;
  useEffect(() => {
    console.log("fetchedFavoritesData:", fetchedFavoritesData);
    console.log("zustand 상태 favoritesData:", favoriteStore.favoritesData);
  }, [fetchedFavoritesData, favoriteStore.favoritesData]);
  useEffect(() => {
    console.log("상태 업데이트 후 favoritesData:", favoritesData);
  }, [favoritesData]);
  // 찜 내역 보내기
  const createMutation = useMutation({
    mutationFn: (ids: number[]) =>
      createFavorite({ combinationIds: ids }, accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favoritesData"] });
      refetch();
      setFavoriteIds([]);
    },
    onError: (error) => {
      console.error("찜 목록 업데이트 실패:", error);
    },
  });
  // 찜 삭제 내역 보내기
  const deleteMutation = useMutation({
    mutationFn: (ids: number[]) => deleteAllFavorite(ids, accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favoritesData"] });
      refetch();
      setDeleteFavoriteIds([]);
    },
    onError: (error) => {
      console.error("찜 목록 업데이트 실패:", error);
    },
  });

  useEffect(() => {
    if (!favoritesData?.favorites || !favorites) return;

    let createTimeoutId: number;
    let deleteTimeoutId: number;

    const newFavoriteIds = favoriteIds.filter((id) => !favorites.includes(id));
    const newDeleteIds = deleteFavoriteIds.filter((id) =>
      favorites.includes(id)
    );

    if (newFavoriteIds.length > 0) {
      createTimeoutId = window.setTimeout(() => {
        createMutation.mutate(newFavoriteIds);
      }, 300);
    }

    if (newDeleteIds.length > 0) {
      deleteTimeoutId = window.setTimeout(() => {
        deleteMutation.mutate(newDeleteIds);
      }, 300);
    }

    return () => {
      window.clearTimeout(createTimeoutId);
      window.clearTimeout(deleteTimeoutId);
    };
  }, [favoriteIds, deleteFavoriteIds]);

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
  // const handleToggleLike = async (id: string) => {
  //   try {
  //     const response = await removeCombinationFromFavorites(id);

  //     if (response === 200) {
  //       alert("찜한 향기 조합이 삭제되었습니다.");
  //       console.log(`Deleted favorite combination: ${id}`);
  //     }
  //   } catch (error) {
  //     alert("삭제 중 오류가 발생했습니다.");
  //   }
  // };
  // 공유 버튼 클릭 함수(id는 공유할 향기의 ID)
  const handleShare = (id: string) => {
    // `favoritesData`에서 해당 ID에 맞는 항목을 찾
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
          {favoritesData?.favorites?.length > 0 ? (
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
