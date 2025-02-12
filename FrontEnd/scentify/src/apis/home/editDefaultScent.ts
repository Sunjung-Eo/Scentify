import { useAuthStore } from '../../stores/useAuthStore';

export const editDefaultScent = async (
  id: number, // 디바이스 아이디
  roomType: number, // 공간 크기
  combination: {
    id: number;
    choice1: number;
    choice1Count: number;
    choice2: number;
    choice2Count: number;
    choice3: number;
    choice3Count: number;
    choice4: number;
    choice4Count: number;
  }
) => {
  try {
    const accessToken = useAuthStore.getState().accessToken;
    const response = await fetch('/v1/device/set/update', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
        roomType,
        combination: {
          id: combination.id,
          choice1: combination.choice1,
          choice1Count: combination.choice1Count,
          choice2: combination.choice2,
          choice2Count: combination.choice2Count,
          choice3: combination.choice3,
          choice3Count: combination.choice3Count,
          choice4: combination.choice4,
          choice4Count: combination.choice4Count,
        },
      }),
    });
    // ✅ 응답 상태 코드 체크 (본문이 없는 경우 대비)
    if (response.status === 200) {
      console.log('기본향 수정 성공');
      return { success: true }; // 빈 응답 대비
    } else {
      const errorText = await response.text(); // 오류 메시지 읽기
      throw new Error(
        `서버 오류: ${response.status} - ${errorText || '에러 메시지가 없습니다.'}`
      );
    }
  } catch (error) {
    console.error('기본향 수정 실패:', error);
    throw error;
  }
};
