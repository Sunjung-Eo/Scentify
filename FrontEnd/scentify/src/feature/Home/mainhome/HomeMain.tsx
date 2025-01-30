import DeviceCarousel from "./device/DeviceCarousel.tsx";
import UserCard from "./user/UserCard.tsx";
import { APIResponse } from "./device/DeviceTypes.ts";

const exampleData: APIResponse = {
  main_device_id: ["145", "221", "332"], // 연결된 기기의 ID
  devices: [
    {
      id: "145", // 예약 모드: 가까운 예약이 있는 경우
      name: "우리 방",
      groupId: 1,
      slot1: 0,
      slot1RemainingRatio: 90,
      slot2: 3,
      slot2RemainingRatio: 80,
      slot3: 7,
      slot3RemainingRatio: 70,
      slot4: 8,
      slot4RemainingRatio: 60,
      mode: 0,
      temperature: 25,
      humidity: 51,
      defaultCombination: 1,
    },
    {
      id: "221", // 예약 모드: 예약이 없는 경우
      name: "거실",
      groupId: 1,
      slot1: 2,
      slot1RemainingRatio: 0,
      slot2: 3,
      slot2RemainingRatio: 75,
      slot3: 2,
      slot3RemainingRatio: 1,
      slot4: 4,
      slot4RemainingRatio: 55,
      mode: 0,
      temperature: 24,
      humidity: 50,
      defaultCombination: 2,
    },
    {
      id: "332", // 자동화 모드
      name: "서재",
      groupId: null,
      slot1: 2,
      slot1RemainingRatio: 20,
      slot2: 0,
      slot2RemainingRatio: 50,
      slot3: 3,
      slot3RemainingRatio: 99,
      slot4: 5,
      slot4RemainingRatio: 25,
      mode: 1,
      temperature: 23,
      humidity: 49,
      defaultCombination: 3,
    },
  ],
  autoSchedules: [
    {
      id: 1,
      device_id: "332",
      combinationId: 1,
      subMode: 0,
      type: null,
      modeOn: true,
      interval: 15,
    },
    {
      id: 2,
      device_id: "332",
      combinationId: 1,
      subMode: 1,
      type: null,
      modeOn: true,
      interval: 30,
    },
  ],
  customSchedules: [
    {
      id: 1, // 가까운 예약 스케줄
      deviceId: "145", // 예약이 연결된 기기 ID
      name: "아침에 뿌리는 향",
      combinationId: 1,
      combinationName: "상쾌한 향",
      isFavorite: true,
      day: 64, // 월요일
      startTime: "23:59:59", // 현재 시간 이후
      endTime: "15:00:00",
      interval: 15, // 분사 주기: 15분
    },
  ],
};

// const exampleData: APIResponse = {
//   main_device_id: [], // 연결된 기기가 없는 상태
//   devices: [], // devices 배열도 비어있음 (기기가 전혀 없는 경우)
// };

function HomeMain() {
  return (
    <div className="content px-4 py-1">
      <div className="mb-5">
        <UserCard />
      </div>
      {/* DeviceCarousel에 데이터 전달 */}
      <DeviceCarousel data={exampleData} />
    </div>
  );
}

export default HomeMain;
