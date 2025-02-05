import { create } from "zustand";
import { DeviceState } from "../types/DeviceType";

// Device 타입은 => types/DeviceType.ts 로 불러옴.
export interface DeviceStoreState {
  devices: DeviceState[]; // ✅ 모든 기기를 하나의 배열에서 관리
  setDevices: (mainDevice: DeviceState, devices: DeviceState[]) => void;
  setMainDevice: (id: number | null) => void;
  updateCapsule: (id: number, slots: Partial<DeviceState>) => void;
  updateDefaultScent: (
    id: number,
    data: Partial<DeviceState["defaultScentData"]>
  ) => void;
  updateDeviceName: (id: number, name: string) => void;
  resetDevices: () => void;
}

export const useDeviceStore = create<DeviceStoreState>((set) => ({
  devices: [],

  /** ✅ 초기 디바이스 설정 */
  setDevices: (mainDevice: DeviceState, devices: DeviceState[]) => {
    set({
      devices: [
        {
          ...mainDevice,
          isRepresentative: true,
          previousScentData: getDefaultScent(mainDevice),
        },
        ...devices.map((device) => ({
          ...device,
          isRepresentative: false,
          previousScentData: getDefaultScent(device),
        })),
      ],
    });
  },

  /** ✅ 특정 기기를 메인으로 변경 */
  setMainDevice: (deviceId: number | null) => {
    set((state) => ({
      devices: state.devices.map((device) => ({
        ...device,
        isRepresentative: device.id === deviceId, // ✅ 선택한 deviceId만 true
      })),
    }));
  },

  /** ✅ 캡슐 교체 시 기본향(previousScentData)도 자동 업데이트 */
  updateCapsule: (deviceId: number, slots: Partial<DeviceState>) => {
    set((state) => ({
      devices: state.devices.map((device) =>
        device.id === deviceId
          ? {
              ...device,
              ...slots,
              previousScentData: getDefaultScent({ ...device, ...slots }), // ✅ 기본향 동기화
            }
          : device
      ),
    }));
  },

  /** ✅ 기본향만 개별적으로 변경 */
  updateDefaultScent: (
    deviceId: number,
    data: Partial<DeviceState["defaultScentData"]>
  ) => {
    set((state) => ({
      devices: state.devices.map((device) =>
        device.id === deviceId
          ? {
              ...device,
              defaultScentData: { ...device.defaultScentData, ...data }, // ✅ 기본향 업데이트
            }
          : device
      ),
    }));
  },

  updateDeviceName: (deviceId: number, name: string) => {
    set((state) => ({
      devices: state.devices.map((device) =>
        device.id === deviceId ? { ...device, name } : device
      ),
    }));
  },

  resetDevices: () => set({ devices: [] }), //  초기화
}));

/** ✅ 기본향(previousScentData) 설정 함수 */
const getDefaultScent = (device: Partial<DeviceState>) => ({
  slot1: { slot: device.slot1 ?? 0, count: device.slot1RemainingRatio ?? 0 },
  slot2: { slot: device.slot2 ?? 0, count: device.slot2RemainingRatio ?? 0 },
  slot3: { slot: device.slot3 ?? 0, count: device.slot3RemainingRatio ?? 0 },
  slot4: { slot: device.slot4 ?? 0, count: device.slot4RemainingRatio ?? 0 },
});
