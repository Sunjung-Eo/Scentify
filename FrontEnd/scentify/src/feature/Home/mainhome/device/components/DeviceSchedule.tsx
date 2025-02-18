import React from 'react';
import {
  CustomScheduleWithStatus,
  CustomSchedule,
  AutoSchedule,
} from '../../../../../types/SchedulesType';
import {
  getClosestCustomSchedule,
  getActiveAutoSchedule,
} from '../schedulesUtil';
import temperatureIcon from '../../../../../assets/icons/temperature-icon.svg';
import waterIcon from '../../../../../assets/icons/water-icon.svg';

interface DeviceScheduleProps {
  deviceId: number | null;
  scheduleData: {
    type: 0 | 1 | null;
    schedules: {
      customSchedules?: CustomSchedule[];
      autoSchedules?: AutoSchedule[];
    } | null;
  } | null;
  temperature: number | null;
  humidity: number | null;
}

const DeviceSchedule: React.FC<DeviceScheduleProps> = ({
  deviceId,
  scheduleData,
  temperature,
  humidity,
}) => {
  let activeAutoSchedules: AutoSchedule[] = [];
  let closestCustomSchedule: CustomScheduleWithStatus | null = null;

  // 자동화 스케줄 처리
  if (scheduleData?.type === 1 && scheduleData.schedules?.autoSchedules) {
    activeAutoSchedules = getActiveAutoSchedule(scheduleData);
  }

  // 커스텀 스케줄 처리
  if (scheduleData?.type === 0 && scheduleData.schedules?.customSchedules) {
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
    }) as CustomScheduleWithStatus;
  }

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
        isRunning: false,
        schedules: [],
      };
    }

    if (scheduleData.type === 1 && activeAutoSchedules.length > 0) {
      return {
        type: '자동화 모드',
        isRunning: true,
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
              : '주기 없음', // ✅ 자동화 모드 실행 주기 표시
            endStartTime: '',
            isRunning: true,
          };
        }),
      };
    }

    if (closestCustomSchedule && scheduleData.type === 0) {
      return {
        type: '예약 모드',
        name: closestCustomSchedule.name || '예약',
        timeText: '',
        endStartTime: `${formatTime(closestCustomSchedule.startTime)} ~ ${formatTime(closestCustomSchedule.endTime)}`,
        isRunning: closestCustomSchedule.isRunning ?? false,
        schedules: [],
      };
    }

    return {
      type: '-',
      name: '예약 없음',
      timeText: '',
      endStartTime: '',
      isRunning: false,
      schedules: [],
    };
  };

  const currentSchedule = scheduleInfo();

  return (
    <>
      <div className="flex w-full min-w-[300px] h-full mt-4 px-10">
        <div
          className="flex flex-col relative w-full h-full justify-start bg-white rounded-[12px] p-4"
          style={{
            filter: 'drop-shadow(0px 0px 15px rgba(0, 0, 0, 0.05))',
          }}
        >
          <div className="flex">
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
                  <div key={index} className="mt-1">
                    <div className="flex flex-row items-center font-pre-medium text-14 text-sub">
                      {schedule.name}
                      {currentSchedule.type === '자동화 모드' && (
                        <span className="pl-2 font-pre-light text-brand text-12 ">
                          {schedule.timeText}
                        </span>
                      )}{' '}
                    </div>

                    {/* ✅ 예약 모드에서는 주기 표시 X */}
                    {schedule.endStartTime && (
                      <div className="font-pre-light text-brand text-10">
                        {schedule.endStartTime}
                      </div>
                    )}
                    {currentSchedule.name !== '예약 없음' &&
                      currentSchedule.type !== '자동화 모드' && (
                        <p className="font-pre-medium text-16 text-sub">
                          {schedule.isRunning ? '실행중' : '실행예정'}
                        </p>
                      )}
                  </div>
                ))
              ) : (
                <div className="flex flex-col justify-start items-start mt-2 gap-1">
                  <p
                    className={`flex flex-col items-center ${
                      currentSchedule.name === '예약 없음'
                        ? 'text-gray font-pre-light text-14'
                        : 'text-sub font-pre-medium text-16'
                    }`}
                  >
                    {currentSchedule.name}
                  </p>
                  {currentSchedule.type === '자동화 모드' && (
                    <p className="font-pre-light text-brand text-10">
                      {currentSchedule.timeText}
                    </p>
                  )}
                  <div className="flex flex-row items-center">
                    {currentSchedule.endStartTime && (
                      <p className="font-pre-light text-brand text-12">
                        {currentSchedule.endStartTime}
                      </p>
                    )}
                    {currentSchedule.name !== '예약 없음' &&
                      currentSchedule.type !== '자동화 모드' && (
                        <span className="pl-2 font-pre-light text-12 text-sub">
                          {currentSchedule.isRunning ? '실행중' : '실행예정'}
                        </span>
                      )}
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* 온습도 표시 */}
          <div className="flex flex-row items-center justify-center mt-auto gap-5 font-pre-light text-10 text-sub">
            <div className="flex flex-row items-center gap-1">
              <img src={temperatureIcon} alt="temperature-icon" />
              <p>{temperature}℃</p>
            </div>
            <div className="flex flex-row items-center gap-1">
              <img src={waterIcon} alt="water-icon" />
              <p>{humidity}%</p>
            </div>
          </div>
        </div>
      </div>
      <div className="h-[16px]"></div>
    </>
  );
};

export default DeviceSchedule;
