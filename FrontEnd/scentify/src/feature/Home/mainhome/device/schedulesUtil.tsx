// 가장 가까운 커스텀 스케줄 찾기
/*
const getClosestSchedule = (): CustomSchedule | null => {
  if (!customSchedules || !currentDevice) return null;

  const now = new Date();
  const today = now.getDay();

  const schedulesForDevice = customSchedules.filter(
    (schedule) =>
      schedule.deviceId === currentDevice.deviceId &&
      schedule.day & (1 << (6 - today))
  );

  const validSchedules = schedulesForDevice
    .map((schedule) => {
      const [hours, minutes, seconds] = schedule.startTime.split(':');
      const startDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        parseInt(hours, 10),
        parseInt(minutes, 10),
        parseInt(seconds, 10)
      );
      return { ...schedule, startDate };
    })
    .filter((schedule) => schedule.startDate > now)
    .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

  return validSchedules[0] || null;
};

// 현재 기기의 자동 스케줄 찾기
const getAutoSchedulesForDevice = (): AutoSchedule[] => {
  if (!autoSchedules || !currentDevice) return [];
  return autoSchedules.filter(
    (schedule) => schedule.deviceId === currentDevice.deviceId
  );
};

const closestSchedule = getClosestSchedule();
const autoSchedulesForDevice = getAutoSchedulesForDevice();
*/
