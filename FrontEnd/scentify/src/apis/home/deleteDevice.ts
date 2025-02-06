import { useAuthStore } from '../../stores/useAuthStore';

export const deleteDevice = async (id: number) => {
  try {
    const accessToken = useAuthStore.getState().accessToken;
    const response = await fetch('/v1/device/delete', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });

    if (!response.ok) {
      throw response;
    }
    return { success: true };
  } catch (error: any) {
    console.error('디바이스 삭제 실패:', error);
    throw error;
  }
};
