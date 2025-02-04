// 더미 데이터
export const dummyMainDevice = {
  id: 1,
  name: "우리 방",
  groupId: null,
  roomType: 1,
  slot1: 0,
  slot1RemainingRatio: 80,
  slot2: 4,
  slot2RemainingRatio: 60,
  slot3: 6,
  slot3RemainingRatio: 40,
  slot4: 8,
  slot4RemainingRatio: 20,
  mode: 0 as 0 | 1,
  temperature: 25.5,
  humidity: 50,
  defaultCombination: null,
  isRepresentative: true, // ✅ 메인 기기로 설정
};

export const dummyDevices = [
  {
    id: 2,
    name: "거실방",
    groupId: null,
    roomType: 2,
    slot1: 1,
    slot1RemainingRatio: 75,
    slot2: 3,
    slot2RemainingRatio: 50,
    slot3: 5,
    slot3RemainingRatio: 30,
    slot4: 7,
    slot4RemainingRatio: 10,
    mode: 1 as 0 | 1,
    temperature: 22.0,
    humidity: 55,
    defaultCombination: 1,
    isRepresentative: false,
  },
];
