import { DeviceSelectItem } from "../../../components/Control/DeviceSelect";

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

interface CombinationId {
  id: number;
}

// 탈취 모드
export interface deodorizationData {
  id: number;
  deviceId: number;
  combination: Combination | CombinationId;
  modeOn: boolean;
  modeChange: boolean;
  interval: number;
  intervalChange: boolean;
}
// 탐지 모드
export interface detectionData {
  id: number;
  deviceId: number;
  combination: Combination | CombinationId;
  modeOn: boolean;
  modeChange: boolean;
}

// 동작 모드
interface behaviorSchedule {
  id: number;
  deviceId: number;
  interval: number;
  modeOn: boolean;
}
export interface behaviorData {
  exerciseSchedule: behaviorSchedule;
  exerciseModeChange: boolean;
  exerciseIntervalChange: boolean;
  restSchedule: behaviorSchedule;
  restModeChange: boolean;
  restIntervalChange: boolean;
}
