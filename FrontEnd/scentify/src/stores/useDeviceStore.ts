import { create } from 'zustand';
import { MainDeviceState } from '../types/MainDeviceType';

// Device 타입은 => types/DeviceType.ts 로 불러옴.
export interface MainDeviceStoreState {
  mainDevice: MainDeviceState | null;
  setMainDevice: (device: MainDeviceState) => void;
  resetMainDevice: () => void;
}

export const useMainDeviceStore = create<MainDeviceStoreState>((set) => ({
  mainDevice: null,

  setMainDevice: (device) => set({ mainDevice: device }),

  resetMainDevice: () => set({ mainDevice: null }),
}));
