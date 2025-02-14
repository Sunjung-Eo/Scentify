import { create } from 'zustand';
import { MainDeviceState } from '../types/MainDeviceType';
import { persist } from 'zustand/middleware';

// Device 타입은 => types/DeviceType.ts 로 불러옴.
export interface MainDeviceStoreState {
  mainDevice: MainDeviceState | null;
  deviceIdsAndNames: Record<string, string> | null;
  setMainDevice: (device: MainDeviceState) => void;
  resetMainDevice: () => void;
}

export const useMainDeviceStore = create<MainDeviceStoreState>()(
  persist(
    (set) => ({
      mainDevice: null,

      deviceIdsAndNames: null,

      setMainDevice: (device) => set({ mainDevice: device }),

      resetMainDevice: () => set({ mainDevice: null }),
    }),
    {
      name: 'main-device-storage',
      storage: {
        getItem: (name) => {
          const item = sessionStorage.getItem(name);
          return item ? JSON.parse(item) : null;
        },
        setItem: (name, value) => {
          sessionStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          sessionStorage.removeItem(name);
        },
      },
    }
  )
);
