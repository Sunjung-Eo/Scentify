import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useFavoriteStore } from "../../../stores/useFavoriteStore";
import { useAuthStore } from "../../../stores/useAuthStore";
import { getAllFavorite } from "../../../apis/scent/getAllFavorite";

export const useGetFavorites = () => {
  const { accessToken } = useAuthStore();
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["favoritesData"],
    queryFn: () => getAllFavorite(accessToken),
    staleTime: 1000 * 60, // 1분간 캐시 유지
    initialData: { favorites: [] },
    onSuccess: (data) => {
      // 필요한 경우 여기서 데이터 가공
      const favoriteIds = data.favorites
        .filter((item: any) => item?.combination)
        .map((item: any) => item.combination.id);

      // zustand store 업데이트
      useFavoriteStore.getState().setFavorites(favoriteIds);
    },
  });
};
