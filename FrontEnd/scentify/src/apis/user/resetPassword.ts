// 서버로부터 받을 응답 데이터 타입을 정의합니다.
export interface ResetPasswordResponse {
  success: boolean;
  message?: string;
}

/**
 * resetUserPassword
 * 사용자 비밀번호 재설정을 위한 API 호출 함수입니다.
 *
 * @param id - 사용자 아이디
 * @param password - 새로 설정할 비밀번호
 * @returns 서버에서 받은 JSON 응답 (ResetPasswordResponse)
 *
 * API 엔드포인트: /v1/user/reset/password
 * 요청:
 *  {
 *    "id": "사용자 id",
 *    "password": "입력 비밀번호"
 *  }
 * 응답:
 *  200: { success: true, ... }
 *  401: Unauthorized (세션 없음)
 *  400: Bad Request
 */
export const resetUserPassword = async (
  id: string,
  password: string
): Promise<ResetPasswordResponse> => {
  try {
    const response = await fetch("/v1/user/reset/password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, password }),
    });

    // 응답이 정상적이지 않으면 상태 코드에 따라 에러 메시지를 생성합니다.
    if (!response.ok) {
      let errorMessage = "서버 오류가 발생했습니다.";
      if (response.status === 401) {
        errorMessage = "세션이 존재하지 않습니다.";
      } else if (response.status === 400) {
        errorMessage = "잘못된 요청입니다.";
      }

      // 응답 본문을 텍스트로 읽어 추가 정보를 로깅합니다.
      const errorText = await response.text();
      console.error("Reset password error details:", errorText);

      // 에러 메시지를 포함하는 Error 객체를 던집니다.
      throw new Error(errorMessage);
    }

    // 정상적인 응답을 받은 경우, JSON 파싱 후 반환합니다.
    const data = await response.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error resetting user password:", error.message);
      throw error;
    } else {
      console.error("Unknown error resetting user password:", error);
      throw new Error("알 수 없는 오류가 발생했습니다.");
    }
  }
};
