export interface UpdatePasswordRequest {
  password: string; // 변경할 새 비밀번호
}

export interface UpdatePasswordResponse {
  success: boolean; // 요청 성공 여부
  message?: string; // 실패 시 에러 메시지
}

//  비밀번호 변경 API 호출 함수
export const updateUserPassword = async (
  newPassword: string, // 새 비밀번호
  accessToken: string // 로그인된 사용자의 인증 토큰
): Promise<UpdatePasswordResponse> => {
  try {
    console.log("보낼 데이터:", JSON.stringify({ password: newPassword }));
    console.log("토큰:", accessToken);

    // API 요청
    const response = await fetch("/v1/user/password/update", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json", // 요청 본문(JSON 형식)
      },
      body: JSON.stringify({ password: newPassword }), // 새 비밀번호를 JSON 형식으로 변환하여 전송
    });

    // 응답이 정상적이지 않으면 에러 처리
    if (!response.ok) {
      const errorData = await response.json(); // 서버에서 반환한 에러 메시지 추출
      if (response.status === 401) {
        throw new Error("세션이 만료되었습니다. 다시 로그인해주세요.");
      }
      throw new Error(errorData.message || "비밀번호 변경 실패");
    }

    return { success: true }; // 요청이 성공하면 success: true 반환
  } catch (error: any) {
    console.error("API 요청 중 오류 발생:", error);
    return { success: false, message: error.message || "서버 오류 발생" }; // 오류 메시지를 반환
  }
};
