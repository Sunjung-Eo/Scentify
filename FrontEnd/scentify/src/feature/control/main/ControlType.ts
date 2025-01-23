// 모드 타입 정의(0: reservation, 1: auto)
export type Mode = boolean;

// ModeToggle 컴포넌트 props
export interface ModeToggleProps {
  onModeChange: (mode: boolean) => void;
  mode: boolean;
}
