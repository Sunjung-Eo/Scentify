import { DeviceSelectItem } from "../../../components/Control/DeviceSelect";
// 자동화 모드 설정 관련 타입
// export type AutoMode = {
//   탈취: boolean;
//   동작: {
//     집중: boolean;
//     휴식: boolean;
//   };
//   탐지: boolean;
// };

export interface AutoSchedule {
  combinationId: number;
  id: number;
  interval: number | null;
  modeOn: number;
  subMode: number;
  type: null;
}

export interface AutoManagerProps {
  automationData: {
    autoSchedules: AutoSchedule[];
  };
  devices: DeviceSelectItem[];
  selectedDevice: number | null;
  onDeviceChange: (device: number) => void;
}

interface Combination {
  choice1: number;
  choice1Count: number;
  choice2: number;
  choice2Count: number;
  choice3: number;
  choice3Count: number;
  choice4: number;
  choice4Count: number;
}

// 탈취 모드
export interface deodorizationData {
  id: number;
  deviceId: number;
  combination: Combination;
  modeOn: boolean;
  modeChange: boolean;
  interval: number;
  intervalChange: boolean;
}
// 탐지 모드
export interface detectionData {
  id: number;
  deviceId: number;
  combination: Combination;
  modeOn: boolean;
  modeChange: boolean;
}

interface behaviorSchedule {
  id: number;
  deviceId: number;
  interval: number;
  modeOn: boolean;
}
// 동작 모드
export interface behaviorData {
  exerciseSchedule: behaviorSchedule;
  exerciseModeChange: boolean;
  exerciseIntervalChange: boolean;
  restSchedule: behaviorSchedule;
  restModeChange: boolean;
  restIntervalChange: boolean;
}
