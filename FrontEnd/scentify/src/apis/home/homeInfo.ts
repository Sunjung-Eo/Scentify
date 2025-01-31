import { useAuthStore } from '../../stores/useAuthStore';
import { useDeviceStore } from '../../stores/useDeviceStore';
import { useScheduleStore } from '../../stores/useScheduleStore';
import { useUserStore } from '../../stores/useUserStore';
import { AutoSchedule, CustomSchedule } from '../../types/SchedulesType';

export const homeInfo = async () => {
  try {
    const accessToken = useAuthStore.getState().accessToken;

    const response = await fetch('/v1/home/info', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`, // 토큰 추가
      },
    });

    if (!response.ok) {
      throw new Error('서버 오류가 발생했습니다.');
    }
    const data = await response.json(); // 응답 데이터 파싱
    console.log('홈 정보 가져오기 성공:', data);

    // 유저 정보 저장
    useUserStore.getState().setUser({
      nickname: data.user.nickName,
      imgNum: data.user.imgNum,
      mainDeviceId: data.user.mainDeviceId,
    });

    if (data.mainDevice) {
      useDeviceStore.getState().setMainDevice(data.mainDevice.id);
    }

    // ✅ **메인 디바이스 저장**
    if (data.deviceIds && Array.isArray(data.deviceIds)) {
      useDeviceStore.getState().setDevices(
        data.deviceIds.map((deviceId: number) => ({
          deviceId,
          name: null,
          groupId: null,
          ipAddress: '',
          roomType: null,
          slot1: null,
          slot1RemainingRatio: null,
          slot2: null,
          slot2RemainingRatio: null,
          slot3: null,
          slot3RemainingRatio: null,
          slot4: null,
          slot4RemainingRatio: null,
          mode: 0,
          temperature: null,
          humidity: null,
          defaultCombination: null,
        }))
      );
    }

    // **일반 디바이스 리스트 저장**
    if (data.deviceIds && Array.isArray(data.deviceIds)) {
      useDeviceStore.getState().setDevices(
        data.deviceIds.map((deviceId: number) => ({
          deviceId, // ✅ id → deviceId 변경
          name: null,
          groupId: null,
          ipAddress: '',
          roomType: null,
          slot1: null,
          slot1RemainingRatio: null,
          slot2: null,
          slot2RemainingRatio: null,
          slot3: null,
          slot3RemainingRatio: null,
          slot4: null,
          slot4RemainingRatio: null,
          mode: 0,
          temperature: null,
          humidity: null,
          defaultCombination: null,
        }))
      );
    }

    // **스케줄 정보 저장**
    useScheduleStore.getState().setSchedules(
      data.autoSchedules.map((schedule: AutoSchedule) => ({
        id: schedule.id,
        deviceId: schedule.deviceId, // ✅ device_id → deviceId로 변환
        combinationId: schedule.combinationId,
        subMode: schedule.subMode,
        type: schedule.type,
        modeOn: schedule.modeOn,
        interval: schedule.interval,
      })),
      data.customSchedules.map((schedule: CustomSchedule) => ({
        id: schedule.id,
        deviceId: schedule.deviceId, // ✅ deviceId 통일
        name: schedule.name,
        combinationId: schedule.combinationId,
        combinationName: schedule.combinationName,
        isFavorite: schedule.isFavorite,
        day: schedule.day,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        interval: schedule.interval,
        modeOn: schedule.modeOn,
      }))
    );

    return data;
  } catch (error) {
    console.error('홈 정보 가져오기 실패:', error);
    throw error;
  }
};
