const BASE_URL = "http://localhost:8000/v1";

// 로그인 API 호출
export const loginUser = async (id: string, password: string) => {
  try {
    const response = await fetch(`${BASE_URL}/user/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, password }),
      credentials: "include", // 리프레시 토큰 HttpOnly 쿠키 전달
    });

    if (!response.ok) {
      throw new Error("로그인 실패");
    }

    // json payload 
    const data = await response.json(); 
    return data; // { accessToken: string }
                  
  } catch (error) {
    console.error("로그인 요청 중 오류 발생:", error);
    throw error; // 에러를 호출한 쪽으로 전달
  }
};

// 액세스 토큰 재발급 API 호출
export const refreshAccessToken = async () => {
  try {
    const response = await fetch(`${BASE_URL}/user/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("토큰 갱신 실패");
    }

    const data = await response.json(); 
    return data; // { accessToken: string }

  } catch (error) {
    console.error("토큰 갱신 요청 중 오류 발생:", error);
    throw error; // 에러를 호출한 쪽으로 전달
  }
};
