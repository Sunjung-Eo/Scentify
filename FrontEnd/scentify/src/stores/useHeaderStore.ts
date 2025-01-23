import { create } from 'zustand';

interface HeaderType {
    isFinish: boolean;
    isCancel: boolean;
    setFinish: (value: boolean) => void;
    setCancel: (value: boolean) => void;
    resetLayout: () => void;
}

export const useHeaderStore = create<HeaderType>((set)=>({
    isFinish: false,
    isCancel: false,
    setFinish: (value) => set({ isFinish: value }),
  setCancel: (value) => set({ isCancel: value }),
  resetLayout: () => set({ isFinish: false, isCancel: false }),
}));