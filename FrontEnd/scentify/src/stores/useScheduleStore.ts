import { create } from 'zustand';
import { CustomSchedule, AutoSchedule } from '../types/SchedulesType';

interface ScheduleState {
  customSchedules: CustomSchedule[];
  autoSchedules: AutoSchedule[];
  setCustomSchedules: (schedules: CustomSchedule[]) => void;
  setAutoSchedules: (schedules: AutoSchedule[]) => void;
}

export const useScheduleStore = create<ScheduleState>((set) => ({
  customSchedules: [],
  autoSchedules: [],
  setCustomSchedules: (schedules) => set({ customSchedules: schedules }),
  setAutoSchedules: (schedules) => set({ autoSchedules: schedules }),
}));
