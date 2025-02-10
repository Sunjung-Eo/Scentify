import { AutoSchedule, CustomSchedule } from '../../../../types/SchedulesType';

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
    console.log('❌ 유효하지 않은 스케줄 데이터:', scheduleData);
    return null;
  }

  const schedules = scheduleData.schedules;
  console.log('📌 처리할 스케줄 데이터:', schedules);

  const now = new Date();
  const today = now.getDay();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  console.log(
    `📌 현재 요일: ${today} (${['일', '월', '화', '수', '목', '금', '토'][today]})`
  );
  console.log('📌 들어온 스케줄들: ', schedules);

  // ✅ 현재 요일에 해당하는 예약 찾기
  let validSchedules = schedules
    .filter((schedule) => {
      const isValidDay = (schedule.day & (1 << (6 - today))) !== 0;
      console.log(
        `📌 day 필터링 확인:`,
        schedule.name,
        schedule.day,
        isValidDay
      );
      return isValidDay;
    })
    .map((schedule) => {
      const [startHours, startMinutes] = schedule.startTime
        .split(':')
        .map(Number);
      const startTimeMinutes = startHours * 60 + startMinutes;
      return { ...schedule, startTimeMinutes };
    });

  console.log(`📌 오늘(${today}) 가능한 예약 목록:`, validSchedules);

  // ✅ 현재 실행 중인 예약 찾기 (startTime ≤ 현재 시간)
  const runningSchedule = validSchedules.find(
    (schedule) => schedule.startTimeMinutes <= nowMinutes
  );

  if (runningSchedule) {
    console.log(`✅ 실행 중인 예약 찾음: ${runningSchedule.name}`);
    return runningSchedule;
  }

  // ✅ 현재 시간 이후의 가장 가까운 예약 찾기
  const upcomingSchedules = validSchedules
    .filter((schedule) => schedule.startTimeMinutes > nowMinutes)
    .sort((a, b) => a.startTimeMinutes - b.startTimeMinutes);

  if (upcomingSchedules.length > 0) {
    console.log(
      `⏳ 오늘(${today}) 가장 가까운 예약: ${upcomingSchedules[0].name}`
    );
    return upcomingSchedules[0];
  }

  // ✅ 이번 주 내에서 가장 가까운 예약 찾기
  const futureSchedules = schedules
    .map((schedule) => {
      return {
        ...schedule,
        nextDay: [...Array(7).keys()]
          .map((offset) => (today + offset) % 7)
          .find((day) => (schedule.day & (1 << (6 - day))) !== 0),
      };
    })
    .filter((schedule) => schedule.nextDay !== undefined)
    .sort((a, b) => (a.nextDay as number) - (b.nextDay as number));

  if (futureSchedules.length > 0) {
    console.log(
      `⏳ 이번 주 가장 가까운 예약: ${futureSchedules[0].name} (${['일', '월', '화', '수', '목', '금', '토'][futureSchedules[0].nextDay as number]})`
    );
    return futureSchedules[0];
  }

  console.log(`❌ 이번 주 예약 없음`);
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
    console.log('❌ 유효하지 않은 자동화 스케줄 데이터');
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
