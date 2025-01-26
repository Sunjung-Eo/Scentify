// 자동화 모드 설정 관련 타입
export type AutoMode = {
  탈취: boolean;
  동작: {
    집중: boolean;
    휴식: boolean;
  };
  탐지: boolean;
};

export interface AutoManagerProps {
  selectedDevice: string;
  onDeviceChange: (device: string) => void;
}
