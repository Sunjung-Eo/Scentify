import { create } from "zustand";

// scent1, scent2, scent3, scent4는 각각 choice1, choice2, choice3, choice4에 해당하며
// number 값들은 각 choice에 할당된 count를 나타냄

// DefaultScentStore의 상태와 메서드 인터페이스 정의
interface DefaultScentStore {
  defaultScents: {
    scent1: number; // choice1의  기존 count 값
    scent2: number;
    scent4: number;
  };
  updateDefaultScents: (scents: {
    scent1: number; // choice1의 새로운 count 값
    scent2: number; // choice2의 새로운 count 값
    scent3: number;
    scent4: number;
  }) => void;
}

export const useDefaultScentStore = create<DefaultScentStore>((set) => ({
  defaultScents: { scent1: 0, scent2: 0, scent3: 0, scent4: 0 },
  updateDefaultScents: (scents) => set({ defaultScents: scents }), // defaultScents 상태를 업데이트하는 함수 정의
})); // 새로운 scents 데이터를 defaultScents 상태에 저장
