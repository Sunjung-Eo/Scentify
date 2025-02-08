// AutoSchedule 타입 정의
export interface AutoSchedule {
  id: number;
  deviceId: number; // ✅ 추가
  combinationId: number;
  subMode: number;
  type: number | null;
  modeOn: boolean;
  interval: number; // ✅ 추가
}

// CustomSchedule 타입 정의
export interface CustomSchedule {
  id: number;
  deviceId: number; // ✅ 추가
  name: string;
  combinationId: number;
  combinationName: string;
  isFavorite: boolean;
  day: number;
  startTime: string;
  endTime: string;
  interval: number;
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
