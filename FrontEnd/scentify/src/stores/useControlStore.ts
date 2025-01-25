import { create } from "zustand";

interface ControlStore {
  completeHandler: (() => void) | null;
  setCompleteHandler: (handler: (() => void) | null) => void;
}

export const useControlStore = create<ControlStore>((set) => ({
  completeHandler: null,
  setCompleteHandler: (handler) => set({ completeHandler: handler }),
}));
