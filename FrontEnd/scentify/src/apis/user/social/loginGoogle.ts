/**
 * 소셜 로그인
 */
export const loginGoogle = async (): Promise<string | null> => {
  try {
    const response = await fetch('/v1/auth/kakao/login', {
      method: 'GET',
      credentials: 'include', // ✅ 쿠키 포함해서 요청
    });

    if (!response.ok) throw new Error('인증 실패: 유효한 accessToken이 없음');

    const data = await response.json();
    console.log('✅ 서버에서 유저 정보 가져오기 성공:', data);

    return data.accessToken || null;
  } catch (error) {
    console.error('❌ 서버에서 유저 정보 가져오기 실패:', error);
    return null;
  }
};
