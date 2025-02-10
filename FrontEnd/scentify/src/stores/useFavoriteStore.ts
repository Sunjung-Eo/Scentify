import { create } from "zustand";

interface FavoriteState {
  favoriteIds: number[];
  previousFavoriteIds: number[];
  setPreviousFavorites: (ids: number[]) => void;
  addFavorite: (id: number) => void;
  removeFavorite: (id: number) => void;
}

export const useFavoriteStore = create<FavoriteState>((set) => ({
  favoriteIds: [] as number[], // 찜 초기화
  previousFavoriteIds: [] as number[], // db에 저장된 찜 모아두기
  // 기존 찜 목록 가져오기
  setPreviousFavorites: (ids: number[]) =>
    set(() => {
      const uniqueIds = Array.from(new Set(ids));
      return {
        previousFavoriteIds: uniqueIds,
      };
    }),
  // 찜 추가
  addFavorite: (id: number) =>
    set((state) => {
      if (state.favoriteIds.includes(id)) return state;
      if (state.previousFavoriteIds.includes(id)) return state;

      return {
        favoriteIds: [...state.favoriteIds, id],
      };
    }),
  // 찜 제거
  removeFavorite: (id: number) =>
    set((state) => ({
      favoriteIds: state.favoriteIds.filter((favoriteId) => favoriteId !== id),
    })),
}));
