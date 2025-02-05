import { DeviceSelectItem } from "../../../components/Control/DeviceSelect";

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
  devices: DeviceSelectItem[];
  selectedDevice: number;
  onDeviceChange: (deviceId: number) => void;
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
