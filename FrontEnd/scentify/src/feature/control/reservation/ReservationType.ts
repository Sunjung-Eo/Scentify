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

export interface ReservationManagerProps {
  selectedDevice: string;
  onDeviceChange: (device: string) => void;
}

// 예약하기 데이터 전송
export interface Combination {
  name: string;
  choice1: string;
  choice1Count: number;
  choice2: string;
  choice2Count: number;
  choice3: string | null;
  choice3Count: number | null;
  choice4: string | null;
  choice4Count: number | null;
}

export interface CustomSchedule {
  name: string;
  deviceId?: string;
  user_id?: string;
  day: number;
  combination: Combination;
  startTime: string;
  endTime: string;
  interval: number;
}

export interface ReservationData {
  customSchedule: CustomSchedule;
}
