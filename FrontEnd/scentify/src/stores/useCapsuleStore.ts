import { create } from "zustand";
import { CreateCapsuleRequest } from "../feature/Home/device/capsuletypes";
//디바이스이름과 캡슐데이터를 전역관리

// 캡슐 데이터의 구조 정의
interface CapsuleData {
  deviceName: string; // 디바이스(기기)의 이름
  slot1: number; // 슬롯 1에 할당된 캡슐 데이터 (숫자값)
  slot2: number; // 슬롯 2에 할당된 캡슐 데이터 (숫자값)
  slot3: number;
  slot4: number;
}

//상태(recentCapsule): 가장 최근에 저장된 캡슐 데이터.
//메서드(updateRecentCapsule): recentCapsule을 업데이트하는 함수.
interface CapsuleStore {
  recentCapsule: CapsuleData | null;
  // 초기값은 null로 설정되어 있으며, null은 데이터가 없음을 의미
  updateRecentCapsule: (data: CapsuleData) => void; // 새로운 CapsuleData를 받아 recentCapsule 값을 갱신
}

// Zustand의 `create` 메서드를 사용하여 상태 관리 로직 생성
//recentCapsule 초기값은 null로 설정되며, updateRecentCapsule 함수는 recentCapsule을 업데이트하도록 구성
export const useCapsuleStore = create<CapsuleStore>((set) => ({
  recentCapsule: null, // 상태 초기화: 캡슐 데이터는 처음에 비어 있음
  updateRecentCapsule: (data) => set({ recentCapsule: data }),
})); // `updateRecentCapsule` 함수를 호출하면 `set`을 통해 상태 업데이트
