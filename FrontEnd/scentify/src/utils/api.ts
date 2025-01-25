import { useAuthStore } from "../stores/useAuthStore";

/**
 * API 요청 시 토큰 자동 추가 및 재발급 처리
 */

export const apiFetch = async (url: string, options: RequestInit = {}) => {
  const { getAccessToken, reissueAccessToken } = useAuthStore.getState();

  let accessToken = getAccessToken();

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${accessToken}`,
  };

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    try {
      await reissueAccessToken();
      accessToken = useAuthStore.getState().getAccessToken();

      const retryHeaders = {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
      };

      return fetch(url, { ...options, headers: retryHeaders });
    } catch (error) {
      console.error("재로그인이 필요합니다.");
      throw error;
    }
  }

  return response;
};
