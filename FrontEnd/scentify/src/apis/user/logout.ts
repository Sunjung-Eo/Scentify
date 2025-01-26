import { useAuthStore } from '../../stores/useAuthStore';

export const logoutUser = async (): Promise<void> => {
  try {
    const accessToken = useAuthStore.getState().accessToken;

    const response = await fetch('/v1/user/logout', {
      method: 'POST',
      credentials: 'include', // 쿠키 기반 인증이므로 필요
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('로그아웃 실패');
    }

    // 상태 초기화 및 리다이렉션
    useAuthStore.setState({ accessToken: '', isAuthenticated: false });
    window.location.href = '/auth/login';

    console.log('로그아웃 성공');
  } catch (error) {
    console.error('로그아웃 중 오류 발생:', error);
    throw error;
  }
};
