export interface Device {
  id: string;
  name: string;
  groupId: number | null;
  slot1: number | null;
  slot1RemainingRatio: number | null;
  slot2: number | null;
  slot2RemainingRatio: number | null;
  slot3: number | null;
  slot3RemainingRatio: number | null;
  slot4: number | null;
  slot4RemainingRatio: number | null;
  mode: boolean; // 수정: 0 또는 1로 정의된 boolean
  temperature: number | null;
  humidity: number | null;
  defaultCombination: number | null;
}

export interface AutoSchedule {
  id: number;
  combinationId: number;
  subMode: number;
  type: number | null;
  modeOn: boolean;
  interval: number;
}

export interface CustomSchedule {
  id: number;
  name: string;
  combinationId: number;
  combinationName: string;
  isFavorite: boolean;
  day: number;
  startTime: string; // "HH:MM:SS" 형식
  endTime: string; // "HH:MM:SS" 형식
  interval: number;
}

export interface APIResponse {
  main_device_id: string[];
  devices: Device[];
  autoSchedules: AutoSchedule[];
  customSchedules: CustomSchedule[];
}
