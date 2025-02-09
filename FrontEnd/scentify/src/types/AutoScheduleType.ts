export interface AutoSchedule {
  id: number;
  deviceId: number;
  type: string;
  interval: number;
  modeOn: boolean;
  // 기타 필요한 속성들...
}
