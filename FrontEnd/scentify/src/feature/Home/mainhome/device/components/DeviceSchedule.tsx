import React from 'react';
import {
  CustomSchedule,
  AutoSchedule,
} from '../../../../../types/SchedulesType';
import scheduleBg from '../../../../../assets/images/scheduleBg.png';

interface DeviceScheduleProps {
  deviceId: number;
  customSchedules: CustomSchedule[];
  autoSchedules: AutoSchedule[];
}

// 예약 및 자동화 스케줄의 공통 타입 정의
interface ScheduleItem {
  id: number;
  deviceId: number;
  name: string;
  type: string;
  scheduleTime: number;
}

const DeviceSchedule: React.FC<DeviceScheduleProps> = ({
  deviceId,
  customSchedules,
  autoSchedules,
}) => {
  const now = new Date();
  const nowTime = now.getHours() * 60 + now.getMinutes(); // 현재 시간을 분 단위로 변환

  // 해당 deviceId에 해당하는 스케줄 필터링
  const filteredCustomSchedules = customSchedules.filter(
    (schedule) => schedule.deviceId === deviceId
  );
  const filteredAutoSchedules = autoSchedules.filter(
    (schedule) => schedule.deviceId === deviceId
  );

  // 모든 스케줄을 공통 타입을 적용해 변환
  const allSchedules: ScheduleItem[] = [
    ...filteredCustomSchedules.map((schedule) => ({
      id: schedule.id,
      deviceId: schedule.deviceId,
      name: schedule.name,
      type: '예약 모드',
      scheduleTime:
        parseInt(schedule.startTime.split(':')[0]) * 60 +
        parseInt(schedule.startTime.split(':')[1]),
    })),
    ...filteredAutoSchedules.map((schedule) => ({
      id: schedule.id,
      deviceId: schedule.deviceId,
      name: `자동 스케줄 ${schedule.id}`,
      type: '자동화 모드',
      scheduleTime: schedule.interval, // interval을 분 단위로 변환하여 사용
    })),
  ];

  // 가장 가까운 예약 찾기
  let closestSchedule: ScheduleItem | null = null;
  let minDiff = Infinity;

  allSchedules.forEach((schedule) => {
    const timeDiff = schedule.scheduleTime - nowTime;

    if (timeDiff >= 0 && timeDiff < minDiff) {
      closestSchedule = schedule;
      minDiff = timeDiff;
    }
  });

  // "X시간 Y분 후"로 변환
  const formattedTime = closestSchedule
    ? `${Math.floor(minDiff / 60)}시간 ${minDiff % 60}분 후`
    : '-';

  return (
    <div className="w-full mt-4 px-5">
      <div
        className="relative w-full h-40 bg-cover bg-center flex flex-col justify-start items-center text-white rounded-lg shadow-none pt-3"
        style={{ backgroundImage: `url(${scheduleBg})` }}
      >
        {/* ✅ 오른쪽 상단에 스타일 적용된 타원형 버튼 추가 */}
        <div
          className="absolute top-3 right-0 flex items-center justify-center text-white text-xs font-semibold"
          style={{
            width: '83px',
            height: '31px',
            flexShrink: 0,
            borderRadius: '18px',
            background: '#2D3319', // var(--Sub-color) 대신 직접 컬러 지정
          }}
        >
          -
        </div>

        {allSchedules.length === 0 ? (
          <p className="text-sm text-gray-500 px-3 py-10 mt-5 rounded-md text-gray text-12 font-pre-light">
            현재 예정된 스케줄이 없습니다.
          </p>
        ) : (
          <div className="text-center bg-black bg-opacity-50 p-3 rounded-lg">
            <h4 className="text-md font-semibold">다가오는 예약</h4>
            <p className="text-sm">
              {closestSchedule} - {closestSchedule} ({formattedTime})
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeviceSchedule;
