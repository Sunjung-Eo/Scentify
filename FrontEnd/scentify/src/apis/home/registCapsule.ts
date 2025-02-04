import { useAuthStore } from '../../stores/useAuthStore';

export const registCapsule = async (
  id: number,
  name: string,
  slot1: number,
  slot2: number,
  slot3: number,
  slot4: number
) => {
  try {
    const accessToken = useAuthStore.getState().accessToken;
    const response = await fetch('/v1/device/capsules', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
        name,
        slot1,
        slot2,
        slot3,
        slot4,
      }),
    });

    console.log('📡 registCapsule 요청 데이터:', {
      id: id,
      name: name,
      slot1: slot1,
      slot2: slot2,
      slot3: slot3,
      slot4: slot4,
    });

    // ✅ 응답 상태 코드 체크 (본문이 없는 경우 대비)
    if (response.status === 200) {
      console.log('캡슐 등록 성공');
      return { success: true }; // 빈 응답 대비
    } else {
      const errorText = await response.text(); // 오류 메시지 읽기
      throw new Error(
        `서버 오류: ${response.status} - ${errorText || '에러 메시지가 없습니다.'}`
      );
    }
  } catch (error) {
    console.error('디바이스 등록 실패:', error);
    throw error;
  }
};
