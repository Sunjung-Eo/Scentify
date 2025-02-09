// 예약 목록 관련 타입
export interface Reservations {
  [key: string]: string[];
}

// 하트 상태 관련 타입
export interface HeartStatus {
  [key: string]: boolean;
}

// 삭제 모달 props 타입
export interface DeleteModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

// 예약 리스트 조회
export interface Reservation {
  id: number;
  name: string;
  combinationName: string;
  day: number;
  isFavorite: boolean;
  combinationId: number;
  startTime: string;
  endTime: string;
  interval: number;
  modeOn: boolean;
}
export interface ReservationManagerProps {
  reservationData: {
    customSchedules: Reservation[];
  };
  selectedDevice: number;
}

// 예약하기 데이터 전송
export interface Combination {
  name: string;
  choice1: number;
  choice1Count: number;
  choice2: number;
  choice2Count: number;
  choice3: number;
  choice3Count: number;
  choice4: number;
  choice4Count: number;
}

export interface CustomSchedules {
  id: number;
  name: string;
  combinationId: number;
  combinationName: string;
  day: number;
  starttime: string;
  endtime: string;
  interval: number;
  isFavorite: boolean;
}

// 예약하기
export interface ReservationData {
  name: string;
  deviceId: number;
  day: number;
  combination: Combination;
  startTime: string;
  endTime: string;
  interval: number;
  modeOn: boolean;
}

// 예약 수정
export interface UpdateReservationData {
  id: number;
  name: string;
  deviceId: number;
  day: number;
  combination: Combination;
  startTime: string;
  endTime: string;
  interval: number;
  modeOn: boolean;
}
