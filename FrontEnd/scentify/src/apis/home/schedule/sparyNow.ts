import { useAuthStore } from '../../../stores/useAuthStore';

export const sprayNow = async (deviceId: number) => {
  try {
    const accessToken = useAuthStore.getState().accessToken;
    const response = await fetch('/v1/device/spray', {
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
    console.error('즉시분사 실패:', error);
    throw error;
  }
};
