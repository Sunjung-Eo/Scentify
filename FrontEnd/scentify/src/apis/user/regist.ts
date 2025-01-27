/**
 * 회원가입 API 요청
 */
export const registUser = async (formData: FormData) => {
  try {
    const jsonData = {
      id: formData.get('id') as string,
      password: formData.get('password') as string,
      nickname: formData.get('nickname') as string,
      email: formData.get('email') as string,
      imgNum: 1,
      socialType: Number(formData.get('socialType')) || 0,
      gender: Number(formData.get('gender')) || 2, // 기본값 2
      birth: new Date('1990-01-01').toISOString().split('T')[0], // "1990-01-01"
      mainDeviceId: 0, // 기본값 0
    };

    console.log('보낼 JSON 데이터:', jsonData);

    const response = await fetch('/v1/user/regist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // 세션 쿠키 포함
      body: JSON.stringify(jsonData),
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
