import React from 'react';
import {
  CustomSchedule,
  AutoSchedule,
} from '../../../../../types/SchedulesType';
import scheduleBg from '../../../../../assets/images/scheduleBg.png';
import {
  getClosestCustomSchedule,
  getActiveAutoSchedule,
} from '../schedulesUtil';

interface DeviceScheduleProps {
  deviceId: number | null;
  scheduleData: {
    type: 0 | 1 | null;
    schedules: {
      customSchedules?:
        | CustomSchedule[]
        | { customSchedules: CustomSchedule[] };
      autoSchedules?: AutoSchedule[];
    } | null;
  } | null;
}

const DeviceSchedule: React.FC<DeviceScheduleProps> = ({
  deviceId,
  scheduleData,
}) => {
  let activeAutoSchedules: AutoSchedule[] = [];
  let closestCustomSchedule: CustomSchedule | null = null;

  if (scheduleData?.type === 1 && scheduleData.schedules?.autoSchedules) {
    activeAutoSchedules = getActiveAutoSchedule({
      type: 1,
      schedules: scheduleData.schedules.autoSchedules,
    });
  } else if (
    scheduleData?.type === 0 &&
    scheduleData.schedules?.customSchedules
  ) {
    const customSchedulesArray = Array.isArray(
      scheduleData.schedules.customSchedules
    )
      ? scheduleData.schedules.customSchedules
      : (
          scheduleData.schedules.customSchedules as {
            customSchedules: CustomSchedule[];
          }
        ).customSchedules;

    closestCustomSchedule = getClosestCustomSchedule({
      type: 0,
      schedules: customSchedulesArray,
    });
  }

  console.log('🐛🐛🐛 scheduleData: ', scheduleData);
  console.log('🐛🐛🐛 closestCustomSchedule: ', closestCustomSchedule);
  console.log('🐛🐛🐛 activeAutoSchedules: ', activeAutoSchedules);

  // 타임 포맷
  const formatTime = (timeString: string) => {
    if (!timeString) return '';

    const [hour, minute] = timeString.split(':').map(Number);

    const period = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12; // 0시, 12시 처리

    return `${formattedHour}:${minute.toString().padStart(2, '0')} ${period}`;
  };

  const scheduleInfo = () => {
    if (!scheduleData || !scheduleData.schedules) {
      return {
        type: '-',
        name: '예약 없음',
        timeText: '',
        endStartTime: '',
        schedules: [],
      };
    }

    if (scheduleData.type === 1 && activeAutoSchedules.length > 0) {
      return {
        type: '자동화 모드',
        schedules: activeAutoSchedules.map((schedule) => {
          let modeName = '';
          switch (schedule.subMode) {
            case 0:
              modeName = '탐지모드';
              break;
            case 1:
              modeName =
                schedule.type === 1 ? '동작모드(운동)' : '동작모드(휴식)';
              break;
            case 2:
              modeName = '탈취모드';
              break;
          }

          return {
            name: modeName,
            timeText: schedule.interval
              ? `${schedule.interval}분 간격`
              : '간격 없음',
            endStartTime: '',
          };
        }),
      };
    }

    if (closestCustomSchedule && scheduleData.type === 0) {
      const [hours, minutes] = closestCustomSchedule.startTime
        .split(':')
        .map(Number);
      const now = new Date();
      const scheduleDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        hours,
        minutes
      );
      const diffMinutes = Math.floor(
        (scheduleDate.getTime() - now.getTime()) / (1000 * 60)
      );
      const diffHours = Math.floor(diffMinutes / 60);
      const remainingMinutes = diffMinutes % 60;

      return {
        type: '예약 모드',
        name: closestCustomSchedule.name || '예약',
        timeText: `${diffHours}시간 ${remainingMinutes}분 후`,
        endStartTime: `${formatTime(closestCustomSchedule.startTime)} ~ ${formatTime(closestCustomSchedule.endTime)}`,
        schedules: [],
      };
    }

    return {
      type: '-',
      name: '예약 없음',
      timeText: '',
      endStartTime: '',
      schedules: [],
    };
  };

  console.log('🐛🐛🐛 scheduleInfo: ', scheduleInfo());
  const currentSchedule = scheduleInfo();

  return (
    <div className="w-[300px] h-[140px] mt-4 px-5">
      <div
        className="flex flex-col relative w-full h-full bg-cover bg-center flex flex-col justify-center bg-white rounded-[12px] pt-3"
        style={{
          filter: 'drop-shadow(0px 0px 15px rgba(0, 0, 0, 0.05))',
        }}
      >
        {/* 모드 상태 표시 */}
        <div
          className="font-pre-light text-12 absolute top-0 right-0 flex items-center justify-center text-white"
          style={{
            width: '83px',
            height: '31px',
            flexShrink: 0,
            borderRadius: '18px',
            background: '#2D3319',
          }}
        >
          {currentSchedule.type}
        </div>

        {/* 스케줄 정보 표시 */}
        <div className="flex flex-col justify-start items-start px-3">
          {currentSchedule.schedules.length > 0 ? (
            currentSchedule.schedules.map((schedule, index) => (
              <div key={index} className="mt-2">
                <p className="font-pre-medium text-16 text-sub">
                  {schedule.name}
                </p>
                {/* <p className="font-pre-light text-brand text-10">
                  {schedule.timeText && ` (${schedule.timeText})`}
                </p> */}
                {schedule.endStartTime && (
                  <p className="font-pre-light text-brand text-10">
                    {schedule.endStartTime}
                  </p>
                )}
              </div>
            ))
          ) : (
            <div className="mt-2">
              <p className="font-pre-medium text-16 text-sub">
                {currentSchedule.name}
              </p>
              {/* <p className="font-pre-light text-brand text-10">
                {currentSchedule.timeText && ` (${currentSchedule.timeText})`}
              </p> */}
              {currentSchedule.endStartTime && (
                <p className="font-pre-light text-brand text-10">
                  {currentSchedule.endStartTime}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeviceSchedule;
