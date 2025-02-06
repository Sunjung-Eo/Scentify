export interface MainDeviceState {
  id: number;
  name: string | null;
  groupId: number | null;
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
  temperature: number | null; // 없음
  humidity: number | null; // 없음
  defaultCombination: number | null;
  setMainDevice: (device: Partial<MainDeviceState>) => void;
  resetMainDevice: () => void;
}
