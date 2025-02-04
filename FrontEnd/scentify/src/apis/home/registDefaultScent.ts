import { useAuthStore } from '../../stores/useAuthStore';

export const registDefaultScent = async (
  id: number,
  name: string,
  slot1: number,
  slot1Count: number,
  slot2: number,
  slot2Count: number,
  slot3: number,
  slot3Count: number,
  slot4: number,
  slot4Count: number,
  roomType: number
) => {
  try {
    const accessToken = useAuthStore.getState().accessToken;
    const response = await fetch('/v1/device/set', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: id,
        combination: {
          name: name,
          choice1: slot1,
          choice1Count: slot1Count,
          choice2: slot2,
          choice2Count: slot2Count,
          choice3: slot3,
          choice3Count: slot3Count,
          choice4: slot4,
          choice4Count: slot4Count,
        },
        roomType: roomType,
      }),
    });

    console.log('등록 요청 데이터:', {
      id,
      combination: {
        name,
        choice1: slot1,
        choice1Count: slot1Count,
        choice2: slot2,
        choice2Count: slot2Count,
        choice3: slot3,
        choice3Count: slot3Count,
        choice4: slot4,
        choice4Count: slot4Count,
      },
      roomType,
    });

    if (!response.ok) {
      throw new Error('캡슐 등록 실패');
    }

    return response; // 성공 시 응답 반환
  } catch (error) {
    console.error('캡슐 등록 실패:', error);
    throw error;
  }
};
