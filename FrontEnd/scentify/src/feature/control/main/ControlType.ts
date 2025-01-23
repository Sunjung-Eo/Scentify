// 모드 타입 정의(0: reservation, 1: auto)
export type Mode = boolean;

// ModeToggle 컴포넌트 props
export interface ModeToggleProps {
  currentMode: Mode;
  onModeChange: (mode: boolean) => void;
}

// ModeChangeModal 관련 타입
export interface ModeChangeModalProps {
  nextMode: Mode;
  onConfirm: () => void;
  onCancel: () => void;
}
