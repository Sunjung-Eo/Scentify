export const sendEmailCodeForPassword = async (id: string, email: string) => {
  try {
    const response = await fetch("/v1/user/reset/password/send-code", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, email }),
    });

    // 응답이 정상적이지 않으면 오류 처리
    if (!response.ok) {
      // 상태 코드에 따른 기본 오류 메시지 설정
      let errorMessage = "서버 오류가 발생했습니다.";
      if (response.status === 401) {
        errorMessage = "이메일이 등록된 이메일과 일치하지 않습니다.";
      } else if (response.status === 400) {
        errorMessage = "잘못된 요청입니다.";
      }

      // 응답 본문을 텍스트 형식으로 읽어서 로깅
      const errorText = await response.text();
      console.error("Error details:", errorText);

      // 오류 메시지를 던짐
      throw new Error(errorMessage);
    }

    // 정상적인 응답인 경우, 응답 본문을 텍스트로 받아본 후 JSON 파싱 시도
    const text = await response.text();
    let data: any;
    if (text) {
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error("Failed to parse JSON:", parseError);
        throw new Error("서버로부터 유효한 JSON 응답을 받지 못했습니다.");
      }
    } else {
      // 응답 본문이 비어 있을 경우, 기본값 반환 (필요에 따라 변경)
      data = {};
    }
    return data;
  } catch (error: unknown) {
    // error 객체가 Error 타입인지 확인하여 메시지 출력
    if (error instanceof Error) {
      console.error("Error sending email code:", error.message);
    } else {
      console.error("An unknown error occurred:", error);
    }
    // 호출한 쪽으로 오류 전달
    throw error;
  }
};
