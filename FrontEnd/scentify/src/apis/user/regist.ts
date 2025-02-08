/**
 * 회원가입 API 요청
 */
export const registUser = async (userData: any) => {
  try {
    const response = await fetch('/v1/user/regist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (response.ok) {
      console.log('회원가입 성공: 상태 코드 200');
      return 200; // 성공 시 200 반환
    } else if (response.status === 401) {
      throw new Error('세션 오류가 발생했습니다.');
    } else if (response.status === 400) {
      throw new Error('잘못된 요청입니다.');
    } else {
      throw new Error('서버 오류가 발생했습니다.');
    }
  } catch (error) {
    console.error('회원가입 요청 실패:', error);
    throw error;
  }
};
