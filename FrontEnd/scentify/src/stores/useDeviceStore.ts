import { create } from "zustand";

// 타입 정의
interface DeviceState {
  serial: string; // 디바이스 시리얼 넘버
  ip_address: string; // IP 주소
  setSerial: (serial: string) => void; // serial 상태를 업데이트하는 함수
  setIPAddress: (ip: string) => void; // ip_address 상태를 업데이트하는 함수
}

// Zustand 스토어 생성
export const useDeviceStore = create<DeviceState>((set) => ({
  serial: "",
  ip_address: "",
  setSerial: (serial) => set({ serial }),
  setIPAddress: (ip) => set({ ip_address: ip }),
}));
