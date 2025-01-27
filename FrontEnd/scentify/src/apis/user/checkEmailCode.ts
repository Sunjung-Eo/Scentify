// 이메일 인증 코드 검증
export const checkEmailCode = async (code: string): Promise<string | null> => {
  try {
    const response = await fetch('/v1/user/email/verify-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: code }), // 명확한 key-value 사용
      credentials: 'include', // 리프레시 토큰 HttpOnly 쿠키 전달
    });

    console.log('응답 상태 코드:', response.status);

    if (response.status === 200) {
      return '코드 인증이 완료되었습니다.';
    } else if (response.status === 400) {
      return '잘못된 인증 코드입니다.';
    } else {
      throw new Error(
        `서버 오류 발생: ${response.status} - ${response.statusText}`
      );
    }
  } catch (error) {
    console.error('이메일 인증 요청 실패:', error);
    throw new Error('서버에 문제가 발생했습니다.');
  }
};
