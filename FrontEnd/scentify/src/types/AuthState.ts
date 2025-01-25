/**
 * 사용자 인증 상태 인터페이스
 */

export interface AuthState {
  accessToken: string;
  isAuthenticated: boolean; // 로그인 상태, 토큰 발급 등
  login: (id: string, password: string) => Promise<void>;
  logout: () => void;
  getAccessToken: () => string;
  reissueAccessToken: () => Promise<void>;
}
