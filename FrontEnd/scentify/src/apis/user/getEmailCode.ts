// email 중복확인 후 인증 코드 전송
export const getEmailCode = async (email: string): Promise<string | null> => {
  try {
    const response = await fetch('/v1/user/email/send-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email }),
      credentials: 'include', // 리프레시 토큰 HttpOnly 쿠키 전달
    });

    if (!response.ok) {
      throw new Error(`서버 오류: ${response.status}`);
    }

    const textResponse = await response.text();

    // 응답이 비어 있지 않으면 JSON 파싱 시도
    if (textResponse) {
      return JSON.parse(textResponse);
    } else {
      return null; // 빈 응답 처리
    }
  } catch (error) {
    console.error('이메일 인증 요청 실패:', error);
    throw error;
  }
};
