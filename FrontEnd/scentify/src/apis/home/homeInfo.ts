import { useAuthStore } from '../../stores/useAuthStore';
import { useDeviceStore } from '../../stores/useDeviceStore';
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

    return data;
  } catch (error) {
    console.error('홈 정보 가져오기 실패:', error);
    throw error;
  }
};
