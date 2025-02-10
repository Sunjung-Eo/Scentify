export const verifyEmailCodeForPassword = async (code: string) => {
  try {
    const response = await fetch("/v1/user/reset/password/verify-code", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    });

    // 응답 상태 코드가 OK가 아니라면 오류 처리
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("인증 코드가 일치하지 않습니다.");
      } else if (response.status === 400) {
        throw new Error("잘못된 요청입니다.");
      }
      throw new Error("서버 오류가 발생했습니다.");
    }

    // 응답 본문을 텍스트로 먼저 읽습니다.
    const text = await response.text();

    let data: any;
    if (text) {
      try {
        // 본문이 있으면 JSON 파싱을 시도합니다.
        data = JSON.parse(text);
      } catch (parseError) {
        console.error("Failed to parse JSON:", parseError);
        throw new Error("서버로부터 유효한 JSON 응답을 받지 못했습니다.");
      }
    } else {
      // 본문이 비어 있으면 기본값(빈 객체)을 반환합니다.
      data = {};
    }
    return data;
  } catch (error: unknown) {
    // error가 Error 객체인지 확인하고 메시지 출력
    if (error instanceof Error) {
      console.error("Error verifying email code:", error.message);
    } else {
      console.error(
        "An unknown error occurred while verifying email code:",
        error
      );
    }
    throw error;
  }
};
