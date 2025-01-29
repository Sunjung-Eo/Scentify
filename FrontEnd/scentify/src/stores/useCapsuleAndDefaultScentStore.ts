import { create } from "zustand";

// 통합 스토어에서 관리할 데이터 타입 정의
interface CapsuleAndDefaultScentStore {
  /**
   * 캡슐 데이터를 관리하는 객체
   * deviceName: 기기의 이름
   * slot1, slot2, slot3, slot4는 각각 슬롯에 설정된 향기를 나타냄.
   */
  capsuleData: {
    deviceName: string; // 기기의 이름
    slot1: number; // 슬롯 1에 설정된 향기의 고유 식별자
    slot2: number; // 슬롯 2에 설정된 향기의 고유 식별자
    slot3: number; // 슬롯 3에 설정된 향기의 고유 식별자
    slot4: number; // 슬롯 4에 설정된 향기의 고유 식별자
  };

  /**
   * 기본향 데이터를 관리하는 객체
   * 각 슬롯에 설정된 향기의 식별자(slot)와 사용량(count)를 포함.
   */
  defaultScentData: {
    slot1: { slot: number; count: number }; // 슬롯 1의 향기 ID와 사용량
    slot2: { slot: number; count: number }; // 슬롯 2의 향기 ID와 사용량
    slot3: { slot: number; count: number }; // 슬롯 3의 향기 ID와 사용량
    slot4: { slot: number; count: number }; // 슬롯 4의 향기 ID와 사용량
  };

  /**
   * 캡슐 데이터를 업데이트하는 함수
   * 사용자가 캡슐 등록 페이지에서 향기를 설정하거나 변경할 때 호출됨.
   * 해당 함수는 기본향 데이터도 함께 업데이트하여 동기화가 이루어짐.
   */
  updateCapsuleData: (data: {
    deviceName: string; // 기기의 이름
    slot1: number;
    slot2: number;
    slot3: number;
    slot4: number;
  }) => void;

  /**
   * 기본향 데이터를 업데이트하는 함수
   * 사용자가 기본향 설정 페이지에서 데이터를 변경할 때 호출됨.
   */
  updateDefaultScentData: (data: {
    slot1: { slot: number; count: number };
    slot2: { slot: number; count: number };
    slot3: { slot: number; count: number };
    slot4: { slot: number; count: number };
  }) => void;
}

// Zustand를 사용해 통합 스토어 생성
export const useCapsuleAndDefaultScentStore =
  create<CapsuleAndDefaultScentStore>((set) => ({
    /**
     * 초기 캡슐 데이터
     * 기본값으로 모든 슬롯은 0으로 설정되며, 기기 이름은 빈 문자열로 초기화.
     */
    capsuleData: {
      deviceName: "", // 초기 기기 이름은 빈 문자열
      slot1: 0,
      slot2: 0,
      slot3: 0,
      slot4: 0,
    },

    /**
     * 초기 기본향 데이터
     * 각 슬롯에 향기의 ID와 사용량(count)을 설정.
     * 기본적으로 모든 슬롯의 ID는 0이고, 사용량은 0으로 설정됨.
     */
    defaultScentData: {
      slot1: { slot: 0, count: 0 },
      slot2: { slot: 0, count: 0 },
      slot3: { slot: 0, count: 0 },
      slot4: { slot: 0, count: 0 },
    },

    /**
     * 캡슐 데이터 업데이트 함수
     * - 사용자가 캡슐 등록 페이지에서 데이터를 변경하면 호출됨.
     * - 캡슐 데이터 업데이트 시 기본향 데이터도 초기화(updateCapsuleData가 실행되면, 기본향 데이터도 초기화.)
     * @param data 사용자가 설정한 향기 데이터 (deviceName과 각 slot는 고유 숫자값)
     */
    // 캡슐 데이터 업데이트 함수
    updateCapsuleData: (newCapsuleData) =>
      set((state) => ({
        capsuleData: newCapsuleData,

        // 기본향 데이터 업데이트 (캡슐이 변경되었으면 count를 0으로 초기화)
        defaultScentData: {
          slot1: {
            slot: newCapsuleData.slot1,
            count:
              state.defaultScentData.slot1.slot === newCapsuleData.slot1
                ? state.defaultScentData.slot1.count
                : 0, // 변경되면 초기화
          },
          slot2: {
            slot: newCapsuleData.slot2,
            count:
              state.defaultScentData.slot2.slot === newCapsuleData.slot2
                ? state.defaultScentData.slot2.count
                : 0,
          },
          slot3: {
            slot: newCapsuleData.slot3,
            count:
              state.defaultScentData.slot3.slot === newCapsuleData.slot3
                ? state.defaultScentData.slot3.count
                : 0,
          },
          slot4: {
            slot: newCapsuleData.slot4,
            count:
              state.defaultScentData.slot4.slot === newCapsuleData.slot4
                ? state.defaultScentData.slot4.count
                : 0,
          },
        },
      })),

    // 기본향 데이터 업데이트 함수
    updateDefaultScentData: (newDefaultScentData) =>
      set((state) => ({
        defaultScentData: newDefaultScentData,
      })),
  }));
