import { useAuthStore } from '../../stores/useAuthStore';

export const deviceInfo = async (OneDiveIds: number | number[]) => {
  try {
    const accessToken = useAuthStore.getState().accessToken;
    const formattedDeviceIds = Array.isArray(OneDiveIds)
      ? OneDiveIds
      : [OneDiveIds];

    console.log('🔹 요청 JSON:', JSON.stringify({ OneDiveIds }));

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

    // 🚀 응답 상태 코드 확인
    console.log('🔹 서버 응답 상태:', response.status);

    if (!response.ok) {
      throw new Error('디바이스 정보를 가져올 수 없습니다');
    }
    const data = await response.json(); // 응답 데이터 파싱
    // console.log('디바이스 정보 가져오기 성공:', data);

    return data;
  } catch (error) {
    console.error('디바이스 정보 가져오기 실패:', error);
    throw error;
  }
};
