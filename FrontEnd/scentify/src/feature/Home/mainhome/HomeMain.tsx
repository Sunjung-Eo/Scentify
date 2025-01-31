import DeviceCarousel from './device/DeviceCarousel.tsx';
import UserCard from './user/UserCard.tsx';
import { useUserStore } from '../../../stores/useUserStore';
import { useDeviceStore } from '../../../stores/useDeviceStore.ts';
import { useScheduleStore } from '../../../stores/useScheduleStore.ts';

const HomeMain = () => {
  // Zustand에서 상태 가져오기
  const { mainDeviceId } = useUserStore();
  const { mainDevice, devices } = useDeviceStore();

  const { autoSchedules, customSchedules } = useScheduleStore();

  // exampleData 형식으로 변환
  const exampleData = {
    main_device_id: mainDeviceId ? [String(mainDeviceId)] : [],
    devices: mainDevice
      ? [
          {
            id: String(mainDevice.deviceId),
            name: mainDevice.name,
            groupId: mainDevice.groupId,
            slot1: mainDevice.slot1,
            slot1RemainingRatio: mainDevice.slot1RemainingRatio,
            slot2: mainDevice.slot2,
            slot2RemainingRatio: mainDevice.slot2RemainingRatio,
            slot3: mainDevice.slot3,
            slot3RemainingRatio: mainDevice.slot3RemainingRatio,
            slot4: mainDevice.slot4,
            slot4RemainingRatio: mainDevice.slot4RemainingRatio,
            mode: mainDevice.mode,
            temperature: mainDevice.temperature,
            humidity: mainDevice.humidity,
            defaultCombination: mainDevice.defaultCombination,
          },
        ]
      : [],
    autoSchedules: autoSchedules.map((schedule) => ({
      id: schedule.id,
      device_id: schedule.deviceId,
      combinationId: schedule.combinationId,
      subMode: schedule.subMode,
      type: schedule.type,
      modeOn: schedule.modeOn,
      interval: schedule.interval,
    })),
    customSchedules: customSchedules.map((schedule) => ({
      id: schedule.id,
      deviceId: schedule.deviceId, // ✅ 추가
      name: schedule.name,
      combinationId: schedule.combinationId,
      combinationName: schedule.combinationName,
      isFavorite: schedule.isFavorite,
      day: schedule.day,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      interval: schedule.interval,
      modeOn: schedule.modeOn,
    })),
  };

  return (
    <div className="content px-4 py-1">
      <div className="mb-5">
        <UserCard />
      </div>
      {/* DeviceCarousel에 데이터 전달 */}
      <DeviceCarousel data={exampleData} />
    </div>
  );
};

export default HomeMain;
