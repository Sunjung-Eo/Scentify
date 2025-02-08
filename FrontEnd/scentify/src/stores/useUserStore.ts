import { create } from "zustand";
import { useMainDeviceStore } from "./useDeviceStore";

export interface UserState {
  nickname: string;
  email: string;
  imgNum: number;
  socialType: number;
  gender: number;
  birth: string;
  mainDeviceId: number | null;
  deviceIdsAndNames: Record<string, string> | null;
  setUser: (user: Partial<UserState>) => void;
  resetUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  nickname: "",
  email: "",
  imgNum: 0,
  socialType: 0,
  gender: 0,
  birth: "",
  mainDeviceId: null,
  deviceIdsAndNames: null,

  /** 유저 정보 업데이트 시 mainDeviceId 변경 감지 */
  setUser: (user) => {
    set((state) => {
      const updatedState = {
        ...state,
        ...user,
        deviceIdsAndNames: user.deviceIdsAndNames ?? state.deviceIdsAndNames,
      }; //

      return updatedState;
    });
  },

  resetUser: () =>
    set({
      nickname: "",
      email: "",
      imgNum: 0,
      socialType: 0,
      gender: 0,
      birth: "",
      mainDeviceId: null,
      deviceIdsAndNames: null,
    }),
}));
// setUser: (user) => {
//   set((state) => {
//     const deviceIdsAndNames = useMainDeviceStore.getState().deviceIdsAndNames;
//     const extractedDeviceIds = deviceIdsAndNames
//       ? Object.keys(deviceIdsAndNames).map((id) => parseInt(id))
//       : [];
//     console.log("확인해보자", deviceIdsAndNames);
//     const updatedState = {
//       ...state,
//       ...user,
//       deviceIds: extractedDeviceIds,
//     }; //

//     return updatedState;
//   });
// },
