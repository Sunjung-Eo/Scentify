export interface ValidatePasswordRequest {
  password: string; // 사용자가 입력한 현재 비밀번호
}

export interface ValidatePasswordResponse {
  success: boolean; // 비밀번호 검증 성공 여부
  message?: string; // 실패 시 에러 메시지
}

// 현재 비밀번호 검증 API 호출 함수

export const validatePassword = async (
  password: string,
  accessToken: string
): Promise<ValidatePasswordResponse> => {
  try {
    console.log("현재 비밀번호 검증 요청:", JSON.stringify({ password }));
    console.log("토큰:", accessToken);

    const response = await fetch("/v1/user/password/verify", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }), // 현재 비밀번호를 JSON 형식으로 전송
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "비밀번호 검증 실패");
    }

    return { success: true };
  } catch (error: any) {
    console.error("현재 비밀번호 검증 오류:", error);
    return { success: false, message: error.message || "서버 오류 발생" };
  }
};
