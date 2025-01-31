export interface DeviceState {
  deviceId: number;
  name: string | null;
  groupId: number | null;
  ipAddress: string;
  roomType: number | null;
  slot1: number | null;
  slot1RemainingRatio: number | null;
  slot2: number | null;
  slot2RemainingRatio: number | null;
  slot3: number | null;
  slot3RemainingRatio: number | null;
  slot4: number | null;
  slot4RemainingRatio: number | null;
  mode: 0 | 1;
  temperature: number | null;
  humidity: number | null;
  defaultCombination: number | null; // 기본향 ID 저장
}
