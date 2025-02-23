import { useEffect } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';

import { useAuthStore } from '../../../stores/useAuthStore';
import { useFavoriteStore } from '../../../stores/useFavoriteStore';

import { getAllFavorite } from '../../../apis/scent/getAllFavorite';
import { deleteFavorite } from '../../../apis/scent/deleteFavorite';

import ScentCarousel from './scentcarousel';
import FavoritesList from './FavoritesList';
import { Favorite } from './scenttypes';

import bookmarkIcon from '../../../assets/icons/bookmark.svg';

const ScentMain = () => {
  // 인증토큰
  const authStore = useAuthStore();
  const accessToken = authStore.accessToken;

  // 마운트 시 동기화
  const queryClient = useQueryClient();
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['favoritesData'] });
    refetch();
  }, []);

  // 찜
  const { setFavorites, favoritesData, setFavoritesData } = useFavoriteStore();

  // 찜 세부 정보 query
  const { data: fetchedFavoritesData, refetch } = useQuery({
    queryKey: ['favoritesData'],
    queryFn: () => getAllFavorite(accessToken),
    staleTime: 0,
    refetchOnMount: 'always',
    initialData: { favorites: [] },
  });

  useEffect(() => {
    if (fetchedFavoritesData) {
      setFavoritesData(fetchedFavoritesData);
    }
  }, [fetchedFavoritesData, setFavoritesData]);

  // 찜 버튼 클릭 시 단일 삭제
  const deleteSingleMutation = useMutation({
    mutationFn: (id: number) => deleteFavorite(id, accessToken),
    onSuccess: (_, deletedId) => {
      // 전역store 업데이트
      const updatedFavoriteIds = favoritesData.favorites
        .filter((item: Favorite) => item.combination.id !== deletedId)
        .map((item: Favorite) => item.combination.id);
      setFavorites(updatedFavoriteIds);

      // query 업데이트
      queryClient.invalidateQueries({ queryKey: ['favoritesData'] });
      queryClient.invalidateQueries({ queryKey: ['homeInfo'] });
    },
  });

  // 찜 버튼 핸들러
  const handleToggleLike = async (id: number) => {
    try {
      await deleteSingleMutation.mutateAsync(id);
    } catch (error) {
      console.error('삭제 실패:', error);
    }
  };

  // 공유 버튼 클릭 함수(id는 공유할 향기의 ID)
  const handleShare = (id: string) => {
    const favorite = favoritesData.favorites.find((fav: any) => fav.id === id);
    alert(`${favorite!.combination.name} 향기를 공유합니다.`);
  };

  return (
    <div className="pt-[16px]">
      {/* 브랜드 향기 카드 캐러셀 */}
      <div className="mb-[40px]">
        <h2 className="text-12 text-sub font-pre-light mb-2">
          각 카드를 눌러 브랜드 향을 알아보세요.
        </h2>
        <ScentCarousel />
      </div>
      {/* 찜한 향기 목록 */}
      <div>
        <div className="flex items-center">
          <img src={bookmarkIcon} alt="북마크" className="w-6 h-6 mr-[2px]" />
          <h3 className="text-16 text-black font-pre-medium">찜한 향기</h3>
        </div>
        <div className="overflow-y-auto max-h-[calc(100vh-25rem)] scrollbar-hidden">
          {favoritesData.favorites.length > 0 ? (
            <FavoritesList
              favorites={favoritesData.favorites}
              onToggleLike={handleToggleLike}
              onShare={handleShare}
            />
          ) : (
            <p className="mt-10 font-pre-light text-12 text-gray text-center">
              찜한 향기가 아직 없습니다.
              <br />
              마음에 드는 향을 발견하면 찜 목록에 추가해 보세요!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScentMain;
