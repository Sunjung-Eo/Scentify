import { create } from "zustand";
import { CreateCapsuleRequest } from "../feature/Home/device/capsuletypes";

interface CapsuleData {
  slot1: number;
  slot2: number;
  slot3: number;
  slot4: number;
}

interface CapsuleStore {
  recentCapsule: CapsuleData | null; // 가장 최근 저장된 캡슐 데이터
  updateRecentCapsule: (data: CapsuleData) => void; // 데이터를 업데이트하는 함수
}

export const useCapsuleStore = create<CapsuleStore>((set) => ({
  recentCapsule: null, // 초기값은 null
  updateRecentCapsule: (data) => set({ recentCapsule: data }),
}));
