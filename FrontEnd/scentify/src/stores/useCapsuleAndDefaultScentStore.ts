import { create } from "zustand";

interface CapsuleAndDefaultScentStore {
  capsuleData: {
    deviceName: string;
    slot1: number;
    slot2: number;
    slot3: number;
    slot4: number;
  };

  defaultScentData: {
    slot1: { slot: number; count: number };
    slot2: { slot: number; count: number };
    slot3: { slot: number; count: number };
    slot4: { slot: number; count: number };
  };

  previousScentData: {
    slot1: { slot: number; count: number };
    slot2: { slot: number; count: number };
    slot3: { slot: number; count: number };
    slot4: { slot: number; count: number };
  };

  updateCapsuleData: (data: {
    deviceName: string;
    slot1: number;
    slot2: number;
    slot3: number;
    slot4: number;
  }) => void;

  updateDefaultScentData: (data: {
    slot1: { slot: number; count: number };
    slot2: { slot: number; count: number };
    slot3: { slot: number; count: number };
    slot4: { slot: number; count: number };
  }) => void;
}

export const useCapsuleAndDefaultScentStore =
  create<CapsuleAndDefaultScentStore>((set, get) => ({
    capsuleData: {
      deviceName: "",
      slot1: 0,
      slot2: 0,
      slot3: 0,
      slot4: 0,
    },

    defaultScentData: {
      slot1: { slot: 0, count: 0 },
      slot2: { slot: 0, count: 0 },
      slot3: { slot: 0, count: 0 },
      slot4: { slot: 0, count: 0 },
    },

    previousScentData: {
      slot1: { slot: 0, count: 0 },
      slot2: { slot: 0, count: 0 },
      slot3: { slot: 0, count: 0 },
      slot4: { slot: 0, count: 0 },
    },

    updateCapsuleData: (newCapsuleData) => {
      const state = get();

      // ✅ 기존 capsuleData와 비교하여 "하나라도 변경된 경우" true
      const isCapsuleChanged =
        state.capsuleData.slot1 !== newCapsuleData.slot1 ||
        state.capsuleData.slot2 !== newCapsuleData.slot2 ||
        state.capsuleData.slot3 !== newCapsuleData.slot3 ||
        state.capsuleData.slot4 !== newCapsuleData.slot4;

      set({
        capsuleData: newCapsuleData,

        defaultScentData: {
          slot1: {
            slot: newCapsuleData.slot1,
            count: isCapsuleChanged ? 0 : state.previousScentData.slot1.count,
          },
          slot2: {
            slot: newCapsuleData.slot2,
            count: isCapsuleChanged ? 0 : state.previousScentData.slot2.count,
          },
          slot3: {
            slot: newCapsuleData.slot3,
            count: isCapsuleChanged ? 0 : state.previousScentData.slot3.count,
          },
          slot4: {
            slot: newCapsuleData.slot4,
            count: isCapsuleChanged ? 0 : state.previousScentData.slot4.count,
          },
        },

        previousScentData: state.defaultScentData,
      });
    },

    updateDefaultScentData: (newDefaultScentData) =>
      set((state) => ({
        defaultScentData: newDefaultScentData,
        previousScentData: newDefaultScentData,
      })),
  }));
