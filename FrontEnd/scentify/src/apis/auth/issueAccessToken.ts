import { useAuthStore } from '../../stores/useAuthStore';

// 액세스 토큰 재발급 API 호출
export const issueAccessToken = async () => {
  try {
    const accessToken = useAuthStore.getState().accessToken;

    if (!accessToken) {
      console.error('AccessToken이 존재하지 않습니다');
      throw new Error('AccessToken이 존재하지 않습니다');
    }

    const response = await fetch('/v1/user/token/issue', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include', // 쿠키 포함
    });

    if (!response.ok) {
      throw new Error('토큰 갱신 실패');
    }

    // 헤더에서 Authorization 가져오기
    const authHeader = response.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Authorization 헤더가 존재하지 않습니다');
    }

    const reAccessToken = authHeader.split(' ')[1];
    console.log('reAccess Token:', reAccessToken);
    return { accessToken };
  } catch (error) {
    console.error('토큰 갱신 요청 중 오류 발생:', error);
    throw error; // 에러를 호출한 쪽으로 전달
  }
};
