import React from 'react';
import {
  CustomSchedule,
  AutoSchedule,
} from '../../../../../types/SchedulesType';

interface DeviceScheduleProps {
  deviceId: number;
  customSchedules: CustomSchedule[];
  autoSchedules: AutoSchedule[];
}

const DeviceSchedule: React.FC<DeviceScheduleProps> = ({
  deviceId,
  customSchedules,
  autoSchedules,
}) => {
  const filteredCustomSchedules = customSchedules.filter(
    (schedule) => schedule.deviceId === deviceId
  );
  const filteredAutoSchedules = autoSchedules.filter(
    (schedule) => schedule.deviceId === deviceId
  );

  return (
    <div className="w-full mt-4 px-5">
      <h3 className="text-lg font-bold">스케줄 관리</h3>
      <div className="mt-2">
        <h4 className="text-md font-semibold">커스텀 스케줄</h4>
        {filteredCustomSchedules.length > 0 ? (
          <ul className="list-disc ml-5">
            {filteredCustomSchedules.map((schedule) => (
              <li key={schedule.id}>
                {schedule.name} - {schedule.modeOn}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">
            등록된 커스텀 스케줄이 없습니다.
          </p>
        )}
      </div>

      <div className="mt-4">
        <h4 className="text-md font-semibold">자동 스케줄</h4>
        {filteredAutoSchedules.length > 0 ? (
          <ul className="list-disc ml-5">
            {filteredAutoSchedules.map((schedule) => (
              <li key={schedule.id}>{schedule.subMode}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">
            등록된 자동 스케줄이 없습니다.
          </p>
        )}
      </div>
    </div>
  );
};

export default DeviceSchedule;
