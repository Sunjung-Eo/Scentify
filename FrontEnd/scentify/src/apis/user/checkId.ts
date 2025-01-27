export const checkId = async (id: string): Promise<string | null> => {
  try {
    const response = await fetch('/v1/user/check-id', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: id }),
      credentials: 'include', // 리프레시 토큰 HttpOnly 쿠키 전달
    });

    // 409 상태 코드일 경우
    if (response.status === 409) {
      return '이미 사용 중인 아이디입니다.';
    }

    // 성공적으로 처리된 경우
    if (response.ok) {
      return '';
    }

    // 기타 응답 상태 코드일 경우
    return '서버 오류가 발생했습니다.';
  } catch (error) {
    console.error('아이디 중복 확인 오류:', error);
    return '네트워크 오류가 발생했습니다.';
  }
};
