import { create } from 'zustand';
import { useCapsuleAndDefaultScentStore } from './useCapsuleAndDefaultScentStore';
import { DeviceState } from '../types/DeviceType';

// Device 타입은 => types/DeviceType.ts 로 불러옴.
export interface DeviceStoreState {
  mainDevice: DeviceState | null; // 메인 디바이스
  deviceIds: number[]; // 일반 기기의 ID 리스트 (숫자만 저장)
  devices: DeviceState[]; // 일반 기기의 상세 정보 리스트 (객체 저장)
  setMainDevice: (deviceId: number | null) => void; // device의 id만 받음
  setDeviceIds: (deviceIds: number[]) => void;
  setDevices: (devices: DeviceState[]) => void;
  resetDevices: () => void;
}

export const useDeviceStore = create<DeviceStoreState>((set, get) => ({
  mainDevice: null,
  deviceIds: [],
  devices: [],

  /** 메인 디바이스 설정 함수  */
  setMainDevice: (deviceId: number | null) => {
    const state = get(); // 현재 zustand 상태 가져오기
    const newMainDevice = state.devices.find(
      (device) => device.deviceId === deviceId // `devices` 배열에서 ID가 일치하는 기기 찾기
    );

    if (!newMainDevice) {
      console.warn(`Device with ID ${deviceId} not found in devices list.`);
      return; // 해당 ID를 가진 기기가 없으면 함수 종료
    }

    set((state) => {
      // 기존 메인 기기가 있다면 devices 배열로 이동
      const updatedDevices = state.mainDevice
        ? [
            ...state.devices.filter((device) => device.deviceId !== deviceId),
            state.mainDevice, // 기존 메인 기기를 일반 기기로 이동
          ]
        : state.devices.filter((device) => device.deviceId !== deviceId); // 기존 메인 기기가 없으면 필터링만 적용

      return {
        mainDevice: newMainDevice, // 새로운 메인 기기 설정
        devices: updatedDevices, // 기존 메인 기기는 devices로 이동
      };
    });
  },

  // 일반 기기의 ID 리스트 저장 (백엔드에서 숫자로 넘어올 때)
  setDeviceIds: (deviceIds: number[]) => set({ deviceIds }), // ✅ 여기에서 타입 명시

  // 일반 기기 리스트 저장 (객체 형태로 저장할 때)
  setDevices: (devices: DeviceState[]) => set({ devices }),

  // 초기화 함수
  resetDevices: () => set({ mainDevice: null, deviceIds: [], devices: [] }),
}));

/**
 * 최종 저장되는 형태
 * 
 * {
  mainDevice: {
    id: 1,
    name: "거실 디바이스",
    ...
  },
  deviceIds: [145, 221, 332], // ✅ 숫자만 저장됨
  devices: [] // ✅ 일반 기기 정보는 이후 API 호출 후 업데이트
}

 * 
 */
