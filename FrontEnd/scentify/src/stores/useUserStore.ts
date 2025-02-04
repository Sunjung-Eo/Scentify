import { create } from 'zustand';
import { useDeviceStore } from './useDeviceStore';

export interface UserState {
  nickname: string;
  email: string;
  imgNum: number;
  socialType: number;
  gender: number;
  birth: string;
  mainDeviceId: number | null;
  deviceIds: number[] | null;
  setUser: (user: Partial<UserState>) => void;
  resetUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  nickname: '',
  email: '',
  imgNum: 0,
  socialType: 0,
  gender: 0,
  birth: '',
  mainDeviceId: null,
  deviceIds: [],

  /** 유저 정보 업데이트 시 mainDeviceId 변경 감지 */
  setUser: (user) => {
    set((state) => {
      const updatedState = {
        ...state,
        ...user,
        deviceIds: user.deviceIds ?? [],
      }; //

      if (user.mainDeviceId !== undefined) {
        const deviceStore = useDeviceStore.getState();

        // 1) 일반 기기가 없을 경우 mainDevice를 그대로 저장
        if (deviceStore.devices.length === 0) {
          deviceStore.setMainDevice(user.mainDeviceId);
        } else {
          // 2) devices 배열에서 mainDeviceId와 일치하는 기기 찾음
          const newMainDevice = deviceStore.devices.find(
            (device) => device.id === user.mainDeviceId
          );

          if (newMainDevice) {
            deviceStore.setMainDevice(newMainDevice.id);
          }
        }
      }

      return updatedState;
    });
  },

  resetUser: () =>
    set({
      nickname: '',
      email: '',
      imgNum: 0,
      socialType: 0,
      gender: 0,
      birth: '',
      mainDeviceId: null,
      deviceIds: [],
    }),
}));
