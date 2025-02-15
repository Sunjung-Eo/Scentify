// 모드 타입 정의(0: reservation, 1: auto)
export type Mode = boolean;

// ModeToggle 컴포넌트 props
export interface ModeToggleProps {
  currentMode: Mode | null;
  onModeChange: (mode: boolean) => void;
}

// ModeChangeModal 관련 타입
export interface ModeChangeModalProps {
  nextMode: Mode;
  onConfirm: () => void;
  onCancel: () => void;
}

// 기기 상세 정보 타입
export interface DeviceInfo {
  id: number;
  name: string | null;
  roomType: number | null;
  defaultCombination: number;
  groupId: number;
  humidity: number;
  mode: number;
  slot1: number;
  slot2: number;
  slot3: number;
  slot4: number;
  slotRemainingRatio: number;
  slot2RemainingRatio: number;
  slot3RemainingRatio: number;
  slot4RemainingRatio: number;
  temperature: number;
}
export interface DevicesInfo {
  devices: DeviceInfo[];
}
