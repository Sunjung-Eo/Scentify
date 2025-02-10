// 서버로부터 받을 응답 데이터 타입 정의
export interface ResetPasswordResponse {
  success: boolean; // 비밀번호 재설정 성공 여부
  message?: string; // 에러 메시지
}

/**
 * resetUserPassword
 * 사용자 비밀번호 재설정을 위한 API 호출 함수.
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

    // 응답이 정상적이지 않은 경우 처리
    if (!response.ok) {
      // 기본 오류 메시지를 설정
      let errorMessage = "서버 오류가 발생했습니다.";
      // 상태 코드에 따라 구체적인 오류 메시지를 설정
      if (response.status === 401) {
        errorMessage = "세션이 존재하지 않습니다.";
      } else if (response.status === 400) {
        errorMessage = "잘못된 요청입니다.";
      }

      // 응답 본문을 텍스트로 읽어 추가적인 오류 정보 확인
      //서버가 본문 없이 응답을 반환할 경우 JSON 파싱 오류를 방지하기 위해, 먼저 response.text()로 응답 내용을 확인
      const errorText = await response.text();
      console.error("Reset password error details:", errorText);
      // 설정된 오류 메시지를 포함한 Error 객체를 던짐
      throw new Error(errorMessage);
    }

    // 정상적인 응답을 받은 경우, 응답 본문을 텍스트로 먼저 읽기.
    const text = await response.text();
    let data: ResetPasswordResponse;
    // 응답 본문에 내용이 있다면 JSON으로 파싱
    if (text) {
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        // JSON 파싱 중 오류가 발생하면 오류를 로깅하고, 에러 메시지 던짐
        console.error("Failed to parse JSON:", parseError);
        throw new Error("서버로부터 유효한 JSON 응답을 받지 못했습니다.");
      }
    } else {
      // 응답 본문이 비어 있으면, 기본 성공 응답으로 처리
      data = { success: true };
    }
    // 파싱된 데이터를 반환
    return data;
  } catch (error: unknown) {
    // catch 블록: 발생한 오류를 처리
    if (error instanceof Error) {
      // error가 Error 객체인 경우, 에러 메시지를 로깅(error instanceof Error는 error가 new Error()로 생성된 객체인지 검사)
      console.error("Error resetting user password:", error.message);
      throw error; // 호출한 쪽으로 에러를 전달
    } else {
      // error가 Error 객체가 아닌 경우, 일반 오류 메시지를 로깅하고 Error 객체를 던짐
      console.error("Unknown error resetting user password:", error);
      throw new Error("알 수 없는 오류가 발생했습니다.");
    }
  }
};
