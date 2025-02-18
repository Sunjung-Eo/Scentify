import { useAuthStore } from '../../stores/useAuthStore';

export const deviceInfo = async (OneDiveIds: number | number[]) => {
  try {
    const formattedDeviceIds = Array.isArray(OneDiveIds)
      ? OneDiveIds
      : [OneDiveIds];

    // deviceIds가 비어있으면 빈 배열 반환
    if (formattedDeviceIds.length === 0) {
      return [];
    }

    const accessToken = useAuthStore.getState().accessToken;

    const response = await fetch('/v1/device/info', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`, // 토큰 추가
      },
      body: JSON.stringify({
        deviceIds: formattedDeviceIds,
      }),
    });

    if (!response.ok) {
      throw new Error('디바이스 정보를 가져올 수 없습니다');
    }
    const data = await response.json(); // 응답 데이터 파싱

    return data;
  } catch (error) {
    console.error('디바이스 정보 가져오기 실패:', error);
    throw error;
  }
};
