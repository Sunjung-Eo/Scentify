export interface DeviceState {
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
  isRepresentative: boolean;
  defaultScentData: {
    slot1: { slot: number | null; count: number };
    slot2: { slot: number | null; count: number };
    slot3: { slot: number | null; count: number };
    slot4: { slot: number | null; count: number };
  };
}
