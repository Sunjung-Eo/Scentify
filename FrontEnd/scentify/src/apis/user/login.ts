interface AuthResponse {
  accessToken: string;
}

// 로그인 API 호출
export const loginUser = async (
  id: string,
  password: string
): Promise<AuthResponse> => {
  try {
    const response = await fetch('/v1/user/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: id, password: password }),
      credentials: 'include', // 리프레시 토큰 HttpOnly 쿠키 전달
    });

    if (!response.ok) {
      throw new Error('로그인 실패');
    }

    // 헤더에서 Authorization 가져오기
    const authHeader = response.headers.get('Authorization');

    if (!authHeader) {
      throw new Error('Authorization 헤더가 없습니다.');
    }

    const accessToken = authHeader.split(' ')[1];
    return { accessToken };
  } catch (error) {
    console.error('로그인 요청 중 오류 발생:', error);
    throw error; // 에러를 호출한 쪽으로 전달
  }
};
