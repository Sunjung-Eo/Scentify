import { create } from 'zustand';
import { useMainDeviceStore } from './useDeviceStore';

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
