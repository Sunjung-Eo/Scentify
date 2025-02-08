import { create } from "zustand";

interface CapsuleAndDefaultScentStore {
  /**
   * 캡슐 데이터 (현재 등록된 캡슐 정보)
   * - deviceName: 기기의 이름
   * - slot1 ~ slot4: 각 슬롯에 등록된 캡슐의 고유 ID
   */
  capsuleData: {
    deviceName: string;
    slot1: number;
    slot2: number;
    slot3: number;
    slot4: number;
  };
  /**
   *  기본향 데이터 (현재 설정된 기본향 사용량)
   * - slot: 해당 슬롯에 저장된 캡슐 ID
   * - count: 해당 슬롯의 향기 사용량
   */

  defaultScentData: {
    slot1: { slot: number; count: number };
    slot2: { slot: number; count: number };
    slot3: { slot: number; count: number };
    slot4: { slot: number; count: number };
  };

  previousCapsuleData: {
    deviceName: string;
    slot1: number;
    slot2: number;
    slot3: number;
    slot4: number;
  };

  /**
   *  이전 기본향 데이터 (이전 향기 사용량을 저장하는 역할)
   * - 캡슐이 변경되지 않았을 경우 이전 count 값을 유지하는 용도
   */
  previousScentData: {
    slot1: { slot: number; count: number };
    slot2: { slot: number; count: number };
    slot3: { slot: number; count: number };
    slot4: { slot: number; count: number };
  };
  /**
   *  캡슐 데이터를 업데이트하는 함수
   * - 사용자가 `EditCapsule.tsx`에서 캡슐 정보를 변경하면 호출됨.
   * - 하나라도 캡슐이 변경되면 `defaultScentData.count`를 **0으로 초기화**.
   * - 캡슐이 변경되지 않으면 기존 `count` 값을 유지.
   */
  updateCapsuleData: (data: {
    deviceName: string;
    slot1: number;
    slot2: number;
    slot3: number;
    slot4: number;
  }) => void;

  /**
   *  기본향 데이터를 업데이트하는 함수
   * - 사용자가 `EditDefaultScent.tsx`에서 기본향 사용량을 변경하면 호출됨.
   * - 기본향 사용량 변경 시 `previousScentData`에도 업데이트.
   */

  updateDefaultScentData: (data: {
    slot1: { slot: number; count: number };
    slot2: { slot: number; count: number };
    slot3: { slot: number; count: number };
    slot4: { slot: number; count: number };
  }) => void;
}

export const useCapsuleAndDefaultScentStore =
  create<CapsuleAndDefaultScentStore>((set, get) => ({
    //초기 캡슐 데이터 (기본적으로 슬롯 ID는 0)
    capsuleData: {
      deviceName: "",
      slot1: 0,
      slot2: 0,
      slot3: 0,
      slot4: 0,
    },
    // 초기 기본향 데이터 (기본적으로 count는 0)
    defaultScentData: {
      slot1: { slot: 0, count: 0 },
      slot2: { slot: 0, count: 0 },
      slot3: { slot: 0, count: 0 },
      slot4: { slot: 0, count: 0 },
    },

    previousCapsuleData: {
      deviceName: "",
      slot1: 0,
      slot2: 0,
      slot3: 0,
      slot4: 0,
    },

    // 초기 이전 기본향 데이터 (count를 저장하는 용도)
    previousScentData: {
      slot1: { slot: 0, count: 0 },
      slot2: { slot: 0, count: 0 },
      slot3: { slot: 0, count: 0 },
      slot4: { slot: 0, count: 0 },
    },

    /**
     * 캡슐 데이터를 업데이트하는 함수
     * - 하나라도 변경되었으면 기본향 사용량을 **0으로 초기화**
     * - 변경되지 않은 경우, 기존 count 값을 유지
     */
    updateCapsuleData: (newCapsuleData) => {
      const state = get();

      // 기존 capsuleData와 비교하여 하나라도 변경된 경우 true
      const isCapsuleChanged =
        state.previousCapsuleData.slot1 !== newCapsuleData.slot1 ||
        state.previousCapsuleData.slot2 !== newCapsuleData.slot2 ||
        state.previousCapsuleData.slot3 !== newCapsuleData.slot3 ||
        state.previousCapsuleData.slot4 !== newCapsuleData.slot4;

      set({
        capsuleData: newCapsuleData,

        // 하나라도 변경된 경우, 모든 count를 0으로 초기화
        defaultScentData: isCapsuleChanged
          ? {
              slot1: { slot: newCapsuleData.slot1, count: 0 },
              slot2: { slot: newCapsuleData.slot2, count: 0 },
              slot3: { slot: newCapsuleData.slot3, count: 0 },
              slot4: { slot: newCapsuleData.slot4, count: 0 },
            }
          : state.defaultScentData, // 변경이 없으면 기존 count 유지

        previousCapsuleData: newCapsuleData, // 변경된 캡슐 데이터 저장
        previousScentData: state.defaultScentData, // 기존 기본향 데이터 저장 /
      });
    },

    /**
     *  기본향 데이터를 업데이트하는 함수
     * - 사용자가 `EditDefaultScent.tsx`에서 향기 사용량을 변경하면 호출됨.
     * - `previousScentData`에도 업데이트하여 이후 비교에 활용됨.
     */
    updateDefaultScentData: (newDefaultScentData) =>
      set(() => ({
        defaultScentData: newDefaultScentData,
        previousScentData: newDefaultScentData, // 저장 시 previousScentData 업데이트
      })),
  }));
