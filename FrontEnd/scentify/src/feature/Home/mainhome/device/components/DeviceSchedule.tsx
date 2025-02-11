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
  console.log('🐛🐛🐛 activeAutoSchedules: ', activeAutoSchedules);

  const scheduleInfo = () => {
    if (!scheduleData || !scheduleData.schedules) {
      return {
        type: '-',
        name: '예약 없음',
        timeText: '',
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
      };
    }

    return {
      type: '-',
      name: '예약 없음',
      timeText: '',
    };
  };

  const currentSchedule = scheduleInfo();

  return (
    <div className="w-full mt-4 px-5">
      <div
        className="relative w-full h-40 bg-cover bg-center flex flex-col justify-start items-center bg-white text-white rounded-[12px] pt-3"
        style={{
          filter: 'drop-shadow(0px 0px 15px rgba(0, 0, 0, 0.05))',
        }}
      >
        <div
          className="absolute top-0 right-0 flex items-center justify-center text-white text-xs font-semibold"
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

        <div className="text-center bg-black bg-opacity-50 p-3 rounded-lg w-full">
          {currentSchedule.schedules?.map((schedule, index) => (
            <p key={index} className="text-sm mt-2">
              {schedule.name}
              {schedule.timeText && ` (${schedule.timeText})`}
            </p>
          ))}
          {!currentSchedule.schedules && (
            <p className="text-sm mt-2">
              {currentSchedule.name}
              {currentSchedule.timeText && ` (${currentSchedule.timeText})`}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeviceSchedule;
