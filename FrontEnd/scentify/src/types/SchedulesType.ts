// AutoSchedule 타입 정의
export interface AutoSchedule {
  id: number;
  combinationId: number;
  subMode: number;
  type: number | null;
  interval: number | null;
  modeOn: boolean;
}

// CustomSchedule 타입 정의
export interface CustomSchedule {
  id: number;
  name: string;
  combinationId: number;
  combinationName: string;
  isFavorite: boolean;
  day: number;
  startTime: string; // HH : mm : ss 형식
  endTime: string;
  interval: number | null;
  modeOn: boolean;
}

// 스케줄 데이터를 한 곳에서 관리하기 위한 ScheduleState 타입 정의
// 필요 이유 : 한번에 스케줄 데이터 받아오기 위해..(편의성)
export interface ScheduleState {
  autoSchedules: AutoSchedule[];
  customSchedules: CustomSchedule[];
  setSchedules: (
    autoSchedules: AutoSchedule[],
    customSchedules: CustomSchedule[]
  ) => void;
  resetSchedules: () => void;
}

// 기존 CustomSchedule 타입을 확장하여 isRunning 추가
export interface CustomScheduleWithStatus extends CustomSchedule {
  isRunning: boolean;
}
