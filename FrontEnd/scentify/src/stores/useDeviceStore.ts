import { create } from 'zustand';
import { useCapsuleAndDefaultScentStore } from './useCapsuleAndDefaultScentStore';
import { DeviceState } from '../types/DeviceType';

// Device 타입은 => types/DeviceType.ts 로 불러옴.
export interface DeviceStoreState {
  devices: DeviceState[]; // ✅ 모든 기기를 하나의 배열에서 관리
  setDevices: (mainDevice: DeviceState, devices: DeviceState[]) => void;
  setMainDevice: (deviceId: number | null) => void;
  resetDevices: () => void;
}

export const useDeviceStore = create<DeviceStoreState>((set, get) => ({
  devices: [],

  /** ✅ 백엔드에서 받아온 메인 + 일반 디바이스 리스트 저장 */
  setDevices: (mainDevice: DeviceState, devices: DeviceState[]) => {
    set({
      devices: [
        { ...mainDevice, isRepresentative: true }, // ✅ 메인 디바이스
        ...devices.map((device) => ({ ...device, isRepresentative: false })), // ✅ 일반 디바이스
      ],
    });
  },
  /** ✅ 특정 기기를 메인으로 변경 */
  setMainDevice: (deviceId: number | null) => {
    set((state) => ({
      devices: state.devices.map((device) => ({
        ...device,
        isRepresentative: device.deviceId === deviceId, // ✅ 선택한 deviceId만 true
      })),
    }));
  },

  /** ✅ 초기화 */
  resetDevices: () => set({ devices: [] }),
}));

/** 결과:
[
  { deviceId: 1, name: "거실 디바이스", ..., isRepresentative: true },  // ✅ 메인
  { deviceId: 10, name: "침실 디바이스", ..., isRepresentative: false } // ✅ 일반
]
*/
