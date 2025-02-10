/**
 * 회원가입 API 요청
 */
export const registUser = async (userData: any) => {
  try {
    // 0부터 5까지의 랜덤한 숫자 생성
    const randomImgNum = Math.floor(Math.random() * 6);

    // userData에 imgNum 추가
    const userDataFinal = {
      ...userData,
      imgNum: randomImgNum,
    };

    const response = await fetch('/v1/user/regist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userDataFinal),
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
