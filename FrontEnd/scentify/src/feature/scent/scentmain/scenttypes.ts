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
}

// 찜한 향기의 조합 데이터 타입
export interface Combination {
  id: number;
  name: string | null; // 조합 이름
  choice1: number; // 첫 번째 선택된 향기 ID
  choice1Count: number; // 첫 번째 선택의 사용 횟수
  choice2: number | null; // 두 번째 선택된 향기 ID
  choice2Count: number | null; // 두 번째 선택의 사용 횟수
  choice3: number | null; // 세 번째 선택된 향기 ID
  choice3Count: number | null; // 세 번째 선택의 사용 횟수
  choice4: number | null; // 네 번째 선택된 향기 ID
  choice4Count: number | null; // 네 번째 선택의 사용 횟수
}

// 찜한 향기 데이터 타입
export interface Favorite {
  id: string; // 찜한 항목의 고유 ID
  combination: Combination; // 향기 조합 데이터
}
export interface fetchFavoritesData {
  favorites: Favorite[];
}

// 모달 컴포넌트의 Props 타입
export interface ModalProps {
  isOpen: boolean; // 모달 열림 여부
  onClose: () => void; // 모달 닫기 함수
  image: string; // 모달에 표시될 이미지 경로
  title: string; // 모달 제목
  description: string; // 모달 설명
}

// FavoritesList 컴포넌트의 Props 타입
export interface FavoritesListProps {
  favorites: Favorite[]; // 찜한 향기 조합 목록
  onToggleLike: (id: string) => void; // 찜 상태를 변경하는 함수
  onShare: (id: string) => void; // 공유 버튼 클릭 시 호출되는 함수
}
