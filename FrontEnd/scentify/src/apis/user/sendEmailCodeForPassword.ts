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
      // 기본 오류 메시지 설정
      let errorMessage = "서버 오류가 발생했습니다.";
      // HTTP 상태 코드에 따라 구체적인 오류 메시지 재설정
      if (response.status === 401) {
        errorMessage = "이메일이 등록된 이메일과 일치하지 않습니다.";
      } else if (response.status === 400) {
        errorMessage = "잘못된 요청입니다.";
      }

      // 오류가 발생 시, 서버에서 반환한 응답 본문을 텍스트 형식으로 읽기.
      // 이렇게 하면 응답 본문이 빈 문자열이거나 JSON 형식이 아닐 때도 내용을 확인할 수 있음
      const errorText = await response.text();
      console.error("Error details:", errorText);

      // 설정한 오류 메시지로 Error 객체를 생성하고, 이를 던져서 catch 블록으로 이동
      throw new Error(errorMessage);
    }

    // 응답이 정상적인 경우, 우선 응답 본문을 텍스트로 읽음
    const text = await response.text();
    let data: any;
    if (text) {
      // 응답 본문에 내용이 있다면, JSON 파싱 시도
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        // JSON 파싱에 실패하면, 파싱 오류를 콘솔에 출력
        console.error("Failed to parse JSON:", parseError);
        throw new Error("서버로부터 유효한 JSON 응답을 받지 못했습니다.");
      }
    } else {
      // 응답 본문이 비어 있을 경우, 기본값으로 빈 객체({})를 반환합니다.
      // 이 경우 서버에서 본문 없이 성공 상태(200 OK)만 반환했음을 의미
      data = {};
    }
    // 최종적으로 파싱한 data반환
    return data;
  } catch (error: unknown) {
    // try 블록 내에서 발생한 오류 catch로 처리합니다.
    // error 타입은 기본적으로 unknown이므로, 먼저 Error 객체인지 확인
    if (error instanceof Error) {
      // error가 Error 객체인 경우, error.message를 사용하여 오류 메시지를 콘솔에 출력
      console.error("Error sending email code:", error.message);
    } else {
      console.error("An unknown error occurred:", error);
    }
    // catch된 오류를 호출한 쪽으로 다시 던져서, 추가적인 오류 처리
    throw error;
  }
};
