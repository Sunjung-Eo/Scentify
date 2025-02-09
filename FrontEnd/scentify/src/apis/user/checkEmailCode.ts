// 이메일 인증 코드 검증
export const checkEmailCode = async (code: string): Promise<string> => {
  try {
    const response = await fetch('/v1/user/email/verify-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: code }), // 명확한 key-value 사용
      credentials: 'include', // 리프레시 토큰 HttpOnly 쿠키 전달
    });

    console.log('응답 상태 코드:', response.status);

    if (response.status === 200) {
      return '200';
    }

    if (response.status === 400) {
      return '잘못된 인증 코드입니다.';
    }

    return '현재 인증이 불가합니다.';
  } catch (error) {
    console.error('이메일 인증 요청 실패:', error);
    throw new Error('현재 인증이 불가합니다. 잠시 후 다시 인증 바랍니다.');
  }
};
