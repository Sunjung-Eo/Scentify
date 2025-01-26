import { create } from 'zustand';
import { AuthState } from '../types/AuthState';
import { loginUser, refreshAccessToken } from '../apis/user/login';
import { logoutUser } from '../apis/user/logout';

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: '',
  isAuthenticated: false,

  login: async (id, password) => {
    try {
      const data = await loginUser(id, password);
      set({ accessToken: data.accessToken, isAuthenticated: true });
    } catch (error) {
      console.log('로그인 실패: ', error);
      throw error;
    }

    // 임시로 유효성 검사를 통과한 경우 로그인 성공 처리
    // set({ accessToken: `mock-token-${id}`, isAuthenticated: true });
  },

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
