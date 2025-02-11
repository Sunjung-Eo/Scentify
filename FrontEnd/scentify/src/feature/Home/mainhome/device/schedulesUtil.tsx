import { AutoSchedule, CustomSchedule } from '../../../../types/SchedulesType';

/**
 * 
 * 현재 실행 중인 예약 찾기 → 없으면 다음 단계
다음 실행될 예약 찾기
오늘 실행될 예약이 있으면 선택
오늘 예약이 없으면, 가장 가까운 요일의 예약 선택s
 * 
 * 
 */

export const getClosestCustomSchedule = (
  scheduleData: {
    type: 0 | 1 | null;
    schedules: CustomSchedule[];
  } | null
): CustomSchedule | null => {
  if (
    !scheduleData ||
    scheduleData.type !== 0 ||
    !Array.isArray(scheduleData.schedules)
  ) {
    return null;
  }

  const schedules = scheduleData.schedules;
  const now = new Date();
  const today = now.getDay(); // 0(일) ~ 6(토)
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  const DAY_BITS = [1, 2, 4, 8, 16, 32, 64];
  const todayBit = DAY_BITS[today];

  console.log(
    `🕒 현재 시간: ${now.getHours()}:${now.getMinutes()} (분 단위: ${nowMinutes})`
  );
  console.log(`📅 오늘 요일(${today})의 비트: ${todayBit}`);

  // 1. 현재 실행 중인 예약 찾기
  const runningSchedule = schedules.find((schedule) => {
    // 오늘 요일에 해당하는지 확인
    const isToday = (schedule.day & todayBit) !== 0;

    if (!isToday) return false;

    // 시작 시간과 종료 시간을 분으로 변환
    const [startHours, startMinutes] = schedule.startTime
      .split(':')
      .map(Number);
    const [endHours, endMinutes] = schedule.endTime.split(':').map(Number);
    const startTimeMinutes = startHours * 60 + startMinutes;
    const endTimeMinutes = endHours * 60 + endMinutes;

    // 현재 시간이 시작 시간과 종료 시간 사이에 있는지 확인
    return startTimeMinutes <= nowMinutes && nowMinutes <= endTimeMinutes;
  });

  // 실행 중인 예약이 있다면 반환
  if (runningSchedule) {
    console.log(`✅ 실행 중인 예약 찾음: ${runningSchedule.name}`);
    return runningSchedule;
  }

  // 2. 다음 실행될 예약 찾기
  const upcomingSchedules = schedules
    .filter((schedule) => schedule.modeOn)
    .map((schedule) => {
      const [hours, minutes] = schedule.startTime.split(':').map(Number);
      const startTimeMinutes = hours * 60 + minutes;

      // 각 요일별로 다음 실행 시간 계산
      let daysUntilNext = 0;
      let currentDay = today;

      while (daysUntilNext < 7) {
        if ((schedule.day & DAY_BITS[currentDay]) !== 0) {
          if (daysUntilNext === 0 && startTimeMinutes > nowMinutes) break;
          if (daysUntilNext > 0) break;
        }
        daysUntilNext++;
        currentDay = (currentDay + 1) % 7;
      }

      return {
        ...schedule,
        daysUntilNext,
        nextRunTime: startTimeMinutes + daysUntilNext * 24 * 60,
      };
    })
    .filter((schedule) => schedule.daysUntilNext < 7)
    .sort((a, b) => a.nextRunTime - b.nextRunTime);

  if (upcomingSchedules.length > 0) {
    const nextSchedule = upcomingSchedules[0];
    console.log(`⏳ 다음 실행될 예약: ${nextSchedule.name}`);
    return nextSchedule;
  }

  return null;
};

export const getActiveAutoSchedule = (
  scheduleData: {
    type: 0 | 1 | null;
    schedules: AutoSchedule[];
  } | null
): AutoSchedule[] => {
  console.log('🛠 DeviceSchedule에서 넘어온 scheduleData:', scheduleData);

  if (
    !scheduleData ||
    scheduleData.type !== 1 ||
    !Array.isArray(scheduleData.schedules)
  ) {
    return [];
  }

  const activeSchedules = scheduleData.schedules.filter((schedule) => {
    if (schedule.modeOn !== true) return false;

    let modeName = '';
    switch (schedule.subMode) {
      case 0:
        modeName = '탐지모드';
        break;
      case 1:
        modeName = schedule.type === 1 ? '동작모드(운동)' : '동작모드(휴식)';
        break;
      case 2:
        modeName = '탈취모드';
        break;
    }

    console.log(`📌 스케줄 ID: ${schedule.id}`);
    console.log(`📌 모드: ${modeName}`);
    console.log(`📌 인터벌: ${schedule.interval || '없음'}`);

    return true;
  });

  console.log('✅ 활성화된 자동화 스케줄들:', activeSchedules);
  return activeSchedules;
};
