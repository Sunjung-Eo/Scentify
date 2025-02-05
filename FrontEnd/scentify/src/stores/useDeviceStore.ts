import { create } from 'zustand';
import { DeviceState } from '../types/DeviceType';

// Device 타입은 => types/DeviceType.ts 로 불러옴.
export interface DeviceStoreState {
  devices: DeviceState[]; // ✅ 모든 기기를 하나의 배열에서 관리
  setDevices: (mainDevice: DeviceState, devices: DeviceState[]) => void;
  setMainDevice: (id: number | null) => void;
  updateCapsule: (id: number, slots: Partial<DeviceState>) => void;
  updateDefaultScent: (
    id: number,
    data: Partial<DeviceState['defaultScentData']>
  ) => void;
  updateDeviceName: (id: number, name: string) => void;
  resetDevices: () => void;
}

export const useDeviceStore = create<DeviceStoreState>((set, get) => ({
  devices: [],

  setDevices: (mainDevice: DeviceState, devices: DeviceState[]) => {
    set((state) => {
      const existingDevices = state.devices; // 기존 devices 리스트 가져오기
      const updatedDevices = [...existingDevices]; // 새로운 devices 배열 생성 -> 이걸로 덮어쓰기 위해

      // 📌 메인 기기 처리
      // 1) updatedDevices에서 mainDevice의 id와 같은 id 가진 요소 있는 찾음
      // 일치하면 해당 인덱스 반환
      // 없으면 -1
      const mainDeviceIndex = updatedDevices.findIndex(
        (d) => d.id === mainDevice.id
      );

      if (mainDeviceIndex !== -1) {
        // => mainDevice가 기존에 있다! 그럼 업데이트
        updatedDevices[mainDeviceIndex] = {
          ...updatedDevices[mainDeviceIndex],
          ...mainDevice,
          isRepresentative: true, // 대표 기기로로 설정
        };
      } else {
        // 존재하지 않으면 추가
        updatedDevices.push({
          ...mainDevice,
          isRepresentative: true,
        });
      }

      // 📌 일반 기기 처리
      // 2) devices(새로운 기기목록 담는 얘) 배열 순회하면서
      // updatedDevices에서 동일한 id를 가진 기기가 있는 확인
      devices.forEach((device) => {
        const existingDeviceIndex = updatedDevices.findIndex(
          (d) => d.id === device.id
        );

        if (existingDeviceIndex !== -1) {
          // 2-1) 기기가 이미 존재 -> 기존 데이터 업데이트 (isRepresentative 값은 기존 값 유지)
          updatedDevices[existingDeviceIndex] = {
            ...updatedDevices[existingDeviceIndex],
            ...device,
            isRepresentative:
              updatedDevices[existingDeviceIndex].id === mainDevice.id, // ✅ 대표 기기인지 확인
          };
        } else {
          // 2-2) 존재하지 않으면 추가 (isRepresentative: false)
          updatedDevices.push({
            ...device,
            isRepresentative: false,
          });
        }
      });

      return { devices: updatedDevices };
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
    data: Partial<DeviceState['defaultScentData']>
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
