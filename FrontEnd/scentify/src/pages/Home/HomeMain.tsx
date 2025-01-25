import DeviceCarousel from "../../feature/Home/Device/DeviceCarousel";
import UserCard from "../../feature/Home/User/UserCard";
import { Link } from "react-router-dom";
import { APIResponse } from "../../feature/Home/Device/DeviceTypes";

const exampleData: APIResponse = {
  main_device_id: ["145", "221", "332"],
  devices: [
    {
      id: "145",
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
      mode: true,
      temperature: 25,
      humidity: 51,
      defaultCombination: 1,
    },
    {
      id: "221",
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
      mode: false,
      temperature: 24,
      humidity: 50,
      defaultCombination: 2,
    },
    {
      id: "332",
      name: "서재",
      groupId: null,
      slot1: null,
      slot1RemainingRatio: null,
      slot2: null,
      slot2RemainingRatio: null,
      slot3: null,
      slot3RemainingRatio: null,
      slot4: null,
      slot4RemainingRatio: null,
      mode: true,
      temperature: 23,
      humidity: 49,
      defaultCombination: 3,
    },
  ],
  autoSchedules: [
    {
      id: 2,
      combinationId: 1,
      subMode: 0,
      type: null,
      modeOn: false,
      interval: 15,
    },
  ],
  customSchedules: [
    {
      id: 3,
      name: "출근 전에",
      combinationId: 2,
      combinationName: "상쾌",
      isFavorite: false,
      day: 64,
      startTime: "09:00:00",
      endTime: "10:00:00",
      interval: 15,
    },
  ],
};
// const exampleData: APIResponse = {
//   main_device_id: [], // 연결된 기기가 없는 상태
//   devices: [], // devices 배열도 비어있음 (기기가 전혀 없는 경우)
// };

function HomeMain() {
  return (
    <div>
      <UserCard />
      <Link to="/home/registdevice1">
        <button className="p-2 bg-blue-500 text-white rounded">눌러라</button>
      </Link>
      {/* DeviceCarousel에 데이터 전달 */}
      <DeviceCarousel data={exampleData} />
    </div>
  );
}

export default HomeMain;
