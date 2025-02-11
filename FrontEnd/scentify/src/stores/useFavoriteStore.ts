import { create } from "zustand";

interface FavoriteState {
  favorites: number[];
  setFavorites: (ids: number[]) => void;
  favoriteCombinationIds: number[];
  setFavoriteCombinationIds: (ids: number[]) => void;
  favoriteIds: number[];
  removeFavoriteIds: number[];
  // previousFavoriteIds: number[];
  // setPreviousFavorites: (ids: number[]) => void;
  addFavorite: (id: number) => void;
  removeFavorite: (id: number) => void;
}

export const useFavoriteStore = create<FavoriteState>((set) => ({
  favorites: [] as number[], // 서버에서 받아온 찜 id 리스트
  setFavorites: (favorite) => set({ favorites: favorite }),
  favoriteCombinationIds: [] as number[], // 찜 리스트의 향 id들
  setFavoriteCombinationIds: (favoriteCombinationId) =>
    set({ favoriteCombinationIds: favoriteCombinationId }), // 찜 리스트의 향 id들
  favoriteIds: [] as number[], // 새로 추가한 찜 id들
  removeFavoriteIds: [] as number[], // 새로 삭제할 찜 id들
  // 찜 추가
  addFavorite: (id: number) =>
    set((state) => {
      if (state.favoriteIds.includes(id)) return state;
      // if (state.previousFavoriteIds.includes(id)) return state;

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
