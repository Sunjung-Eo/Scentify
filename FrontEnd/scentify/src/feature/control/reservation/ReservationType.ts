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
