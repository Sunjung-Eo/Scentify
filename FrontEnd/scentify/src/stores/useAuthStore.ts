import { create } from 'zustand';
import { AuthState } from '../types/AuthState';
import { loginUser, refreshAccessToken } from '../apis/user/login';
import { logoutUser } from '../apis/user/logout';
import { getAccessTokenFromCookie } from '../utils/token/getAccessTokenFromCookie';

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: '',
  isAuthenticated: false,

  // 일반 로그인
  login: async (id, password) => {
    try {
      const data = await loginUser(id, password);
      set({ accessToken: data.accessToken, isAuthenticated: true });
    } catch (error) {
      console.log('로그인 실패: ', error);
      throw error;
    }
  },

  // ✅ 소셜 로그인 (쿠키에서 직접 토큰을 가져오도록 변경)
  loginWithSocial: async (provider: 'kakao' | 'google') => {
    try {
      // ✅ 백엔드에서 쿠키로 토큰을 설정했으므로, fetch 대신 쿠키에서 직접 가져오기
      const token = getAccessTokenFromCookie(); // 🔥 쿠키에서 토큰 가져오기
      if (token) {
        set({ accessToken: token, isAuthenticated: true });
        console.log(`${provider.toUpperCase()} 로그인 성공, 토큰 저장:`, token);
        return token;
      } else {
        set({ accessToken: '', isAuthenticated: false });
        console.error(`${provider.toUpperCase()} 로그인 실패: 토큰 없음`);
        return null;
      }
    } catch (error) {
      console.error(`${provider.toUpperCase()} 로그인 처리 중 오류:`, error);
      return null;
    }
  },

  // 토큰을 직접 받아 로그인 처리
  loginWithToken: (token: string) => {
    set({ accessToken: token, isAuthenticated: true });
    console.log('🔑 토큰 기반 로그인 성공:', token);
  },

  // 로그아웃
  logout: async () => {
    try {
      await logoutUser();
      set({ accessToken: '', isAuthenticated: false });
    } catch (error) {
      console.error('로그아웃 실패:', error);
      throw error;
    }
  },

  getAccessToken: () => {
    return get().accessToken;
  },

  reissueAccessToken: async () => {
    try {
      const data = await refreshAccessToken();
      set({ accessToken: data.accessToken, isAuthenticated: true });
    } catch (error) {
      console.error('토큰 갱신 실패:', error);
      set({ accessToken: '', isAuthenticated: false });
    }
  },
}));
