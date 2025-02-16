export interface combinationIds {
  combinationIds: number[];
}

// 각 향기의 카드 데이터 타입
export interface ScentCard {
  id: number; // 고유 ID
  cardImage: string; // 카드에 표시될 이미지 경로
  modalImage: string; // 모달에 표시될 이미지 경로
  alt: string; // 이미지 대체 텍스트
  description: string; // 모달 설명
  use: string; // 모달 설명
}

// 찜한 향기의 조합 데이터 타입
export interface Combination {
  id: number;
  name: string | null;
  choice1: number;
  choice1Count: number;
  choice2: number;
  choice2Count: number;
  choice3: number;
  choice3Count: number;
  choice4: number;
  choice4Count: number;
}

// 찜한 향기 데이터 타입
export interface Favorite {
  id: number;
  combination: Combination;
}

export interface FetchFavoritesData {
  favorites: Favorite[];
}

// 모달 컴포넌트의 Props 타입
export interface ModalProps {
  isOpen: boolean; // 모달 열림 여부
  onClose: () => void; // 모달 닫기 함수
  image: string; // 모달에 표시될 이미지 경로
  title: string; // 모달 제목
  description: string; // 모달 설명
  use: string;
}

// FavoritesList 컴포넌트의 Props 타입
export interface FavoritesListProps {
  favorites: Favorite[]; // 찜한 향기 조합 목록
  onToggleLike: (id: number) => void; // 찜 상태를 변경하는 함수
  onShare: (id: string) => void; // 공유 버튼 클릭 시 호출되는 함수
}

//shareFavoriteCombination API의 응답 데이터 구조 정의
export interface ShareFavoriteResponse {
  success: boolean;
  combination?: Combination;
  s3Url?: string;
  shareUrl?: string;
  message?: string;
}

//readShareFavorite.ts 공유된 향기 조합을 불러오는 API 응답 타입
export interface ReadShareFavoriteResponse {
  combination?: Combination;
  s3Url?: string; // S3 Presigned URL
}
