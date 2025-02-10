import React from 'react';
import {
  CustomSchedule,
  AutoSchedule,
} from '../../../../../types/SchedulesType';
import scheduleBg from '../../../../../assets/images/scheduleBg.png';

interface DeviceScheduleProps {
  deviceId: number;
  scheduleData:
    | {
        type: 0 | 1 | null;
        schedules: CustomSchedule[] | AutoSchedule[] | null;
      }
    | undefined;
}

interface ScheduleItem {
  id: number;
  deviceId: number;
  name: string;
  type: string;
  scheduleTime: number;
}

const DeviceSchedule: React.FC<DeviceScheduleProps> = ({
  deviceId,
  scheduleData,
}) => {
  if (!scheduleData || !scheduleData.schedules) {
    return (
      <div className="w-full mt-4 px-5">
        <div
          className="relative w-full h-40 bg-cover bg-center flex flex-col justify-start items-center text-white rounded-lg shadow-none pt-3"
          style={{ backgroundImage: `url(${scheduleBg})` }}
        >
          <p className="text-sm text-gray-500 px-3 py-10 mt-5 rounded-md text-gray text-12 font-pre-light">
            현재 예정된 스케줄이 없습니다.
          </p>
        </div>
      </div>
    );
  }

  const now = new Date();
  const nowTime = now.getHours() * 60 + now.getMinutes();

  console.log('🤪🤪🤪 넘어온 scheduleData: ', scheduleData);
  console.log('끝');
  const allSchedules: ScheduleItem[] =
    scheduleData.type === 0
      ? (scheduleData.schedules as CustomSchedule[]).map(
          (schedule: CustomSchedule) => ({
            id: schedule.id,
            deviceId: deviceId,
            name: schedule.name || '',
            type: '예약 모드',
            scheduleTime:
              parseInt(schedule.startTime.split(':')[0]) * 60 +
              parseInt(schedule.startTime.split(':')[1]),
          })
        )
      : (scheduleData.schedules as AutoSchedule[]).map(
          (schedule: AutoSchedule) => ({
            id: schedule.id,
            deviceId: deviceId,
            name: `자동 스케줄 ${schedule.id}`,
            type: '자동화 모드',
            scheduleTime: schedule.interval || 0,
          })
        );

  let closestSchedule: ScheduleItem = {
    id: -1,
    deviceId: deviceId,
    name: 'No Schedule',
    type: '-',
    scheduleTime: 0,
  };
  let minDiff = Infinity;

  allSchedules.forEach((schedule) => {
    const timeDiff = schedule.scheduleTime - nowTime;
    if (timeDiff >= 0 && timeDiff < minDiff) {
      closestSchedule = schedule;
      minDiff = timeDiff;
    }
  });

  return (
    <div className="w-full mt-4 px-5">
      <div
        className="relative w-full h-40 bg-cover bg-center flex flex-col justify-start items-center text-white rounded-lg shadow-none pt-3"
        style={{ backgroundImage: `url(${scheduleBg})` }}
      >
        <div
          className="absolute top-3 right-0 flex items-center justify-center text-white text-xs font-semibold"
          style={{
            width: '83px',
            height: '31px',
            flexShrink: 0,
            borderRadius: '18px',
            background: '#2D3319',
          }}
        >
          {closestSchedule?.type || '-'}
        </div>

        {allSchedules.length === 0 ? (
          <p className="text-sm text-gray-500 px-3 py-10 mt-5 rounded-md text-gray text-12 font-pre-light">
            현재 예정된 스케줄이 없습니다.
          </p>
        ) : (
          <div className="text-center bg-black bg-opacity-50 p-3 rounded-lg">
            <h4 className="text-md font-semibold">다가오는 예약</h4>
            <p className="text-sm">
              {closestSchedule.name} - {closestSchedule.type} (
              {Math.floor(minDiff / 60)}시간 {minDiff % 60}분 후)
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeviceSchedule;
