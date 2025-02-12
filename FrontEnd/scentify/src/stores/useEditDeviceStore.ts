import { create } from 'zustand';

interface EditDeviceState {
  capsuleData: {
    name: string;
    slot1: number;
    slot2: number;
    slot3: number;
    slot4: number;
  } | null;
  defaultScentData: {
    roomType: 'small' | 'large' | null;
    scentCnt: {
      slot1: number;
      slot2: number;
      slot3: number;
      slot4: number;
    };
  } | null;
  setCapsuleData: (data: EditDeviceState['capsuleData']) => void;
  setDefaultScentData: (data: EditDeviceState['defaultScentData']) => void;
  resetStore: () => void;
}

export const useEditDeviceStore = create<EditDeviceState>((set) => ({
  capsuleData: null,
  defaultScentData: null,
  setCapsuleData: (data) => set({ capsuleData: data }),
  setDefaultScentData: (data) => set({ defaultScentData: data }),
  resetStore: () => set({ capsuleData: null, defaultScentData: null }),
}));
