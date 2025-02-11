import { SocialRegistData } from '../../../feature/user/social/types/SocialRegistData';

export const registGoogle = async (
  userData: SocialRegistData
): Promise<void> => {
  try {
    const response = await fetch('/v1/auth/google/regist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || '회원가입에 실패했습니다.');
    }
  } catch (error) {
    throw new Error('회원가입에 실패했습니다. Scentify에 문의바랍니다.');
  }
};
