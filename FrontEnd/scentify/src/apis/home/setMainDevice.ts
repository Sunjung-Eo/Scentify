import { useAuthStore } from '../../stores/useAuthStore';

export const setMainDevice = async (deviceId: number) => {
  try {
    const accessToken = useAuthStore.getState().accessToken;
    const response = await fetch('/v1/user/device/set', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ deviceId }),
    });

    if (!response.ok) {
      throw response;
    }
    return { success: true };
  } catch (error: any) {
    console.error('대표기기 설정 실패:', error);
    throw error;
  }
};
