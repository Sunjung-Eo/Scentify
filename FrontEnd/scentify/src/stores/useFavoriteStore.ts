import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FavoriteState {
  favorites: number[];
  setFavorites: (ids: number[]) => void;
  favoritesData: any;
  setFavoritesData: (data: any) => void;
}

export const useFavoriteStore = create<FavoriteState>()(
  persist(
    (set) => ({
      // 서버에서 받아온 찜 id 리스트
      favorites: [] as number[],
      setFavorites: (favorite) => set({ favorites: favorite }),
      // 해당 찜의 세부 정보
      favoritesData: { favorites: [] },
      setFavoritesData: (data) => {
        set({ favoritesData: data });
      },
    }),
    {
      name: "favorite-storage",
      storage: {
        getItem: (name) => {
          const item = sessionStorage.getItem(name);
          return item ? JSON.parse(item) : null;
        },
        setItem: (name, value) => {
          sessionStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          sessionStorage.removeItem(name);
        },
      },
    }
  )
);
