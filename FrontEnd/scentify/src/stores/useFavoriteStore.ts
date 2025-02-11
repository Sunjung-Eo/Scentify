import { create } from "zustand";

interface FavoriteState {
  favorites: number[];
  setFavorites: (ids: number[]) => void;
  favoriteCombinationIds: number[];
  setFavoriteCombinationIds: (ids: number[]) => void;
  favoriteIds: number[];
  setFavoriteIds: (id: number[]) => void;
  addFavorite: (id: number) => void;
  removeFavorite: (id: number) => void;
  deleteFavoriteIds: number[];
  setDeleteFavoriteIds: (id: number[]) => void;
  deleteAddFavorite: (id: number) => void;
  deleteRemoveFavorite: (id: number) => void;
  favoritesData: any; // 구체적인 타입으로 교체 권장
  setFavoritesData: (data: any) => void;
}

export const useFavoriteStore = create<FavoriteState>((set) => ({
  favorites: [] as number[], // 서버에서 받아온 찜 id 리스트
  setFavorites: (favorite) => set({ favorites: favorite }),
  favoriteCombinationIds: [] as number[], // 찜 리스트의 향 id들
  setFavoriteCombinationIds: (favoriteCombinationId) =>
    set({ favoriteCombinationIds: favoriteCombinationId }), // 찜 리스트의 향 id들

  favoritesData: { favorites: [] },
  setFavoritesData: (data) => {
    set({ favoritesData: data });
  },

  favoriteIds: [] as number[], // 새로 추가한 찜 id들
  setFavoriteIds: (id: number[]) => set({ favoriteIds: id }),
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

  deleteFavoriteIds: [] as number[], // 새로 삭제할 찜 id들
  setDeleteFavoriteIds: (id: number[]) => set({ deleteFavoriteIds: id }),
  // 찜 삭제에 추가
  deleteAddFavorite: (id: number) =>
    set((state) => {
      if (state.deleteFavoriteIds.includes(id)) return state;
      // if (state.previousFavoriteIds.includes(id)) return state;

      return {
        deleteFavoriteIds: [...state.deleteFavoriteIds, id],
      };
    }),
  // 찜 삭제에서 제거
  deleteRemoveFavorite: (id: number) =>
    set((state) => ({
      deleteFavoriteIds: state.deleteFavoriteIds.filter(
        (deleteFavoriteIds) => deleteFavoriteIds !== id
      ),
    })),
}));
