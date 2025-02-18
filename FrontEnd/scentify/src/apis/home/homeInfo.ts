import { useAuthStore } from '../../stores/useAuthStore';

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
      throw new Error('홈 정보를 가져올 수 없습니다');
    }
    const data = await response.json(); // 응답 데이터 파싱

    return data;
  } catch (error) {
    throw error;
  }
};
