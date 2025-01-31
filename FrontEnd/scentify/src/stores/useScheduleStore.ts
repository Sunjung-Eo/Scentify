import { create } from 'zustand';
import {
  ScheduleState,
  AutoSchedule,
  CustomSchedule,
} from '../types/SchedulesType';

/** 활용예시
const { autoSchedules, customSchedules } = useScheduleStore();
*/
export const useScheduleStore = create<ScheduleState>((set) => ({
  autoSchedules: [],
  customSchedules: [],

  // 전체 스케줄 설정 (기존 방식)
  setSchedules: (
    autoSchedules: AutoSchedule[],
    customSchedules: CustomSchedule[]
  ) => set({ autoSchedules, customSchedules }),

  // 자동 스케줄만 업데이트
  setAutoSchedules: (autoSchedules: AutoSchedule[]) => set({ autoSchedules }),

  // 커스텀 스케줄만 업데이트
  setCustomSchedules: (customSchedules: CustomSchedule[]) =>
    set({ customSchedules }),

  // 로그아웃 시 상태 초기화
  resetSchedules: () => set({ autoSchedules: [], customSchedules: [] }),
}));
