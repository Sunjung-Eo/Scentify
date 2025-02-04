export interface UpdateUserInfoRequest {
  gender: number; // 성별 (0: 여성, 1: 남성, 2: 선택하지 않음)
  birth: string; // 생년월일 (YYYY-MM-DD)
}

export interface UpdateUserInfoResponse {
  success: boolean; // 요청 성공 여부
  message?: string; // 실패 시 에러 메시지
}

// 회원 정보 수정 API 호출 함수
export const updateUserInfo = async (
  userInfo: UpdateUserInfoRequest,
  accessToken: string
): Promise<UpdateUserInfoResponse> => {
  try {
    console.log("회원 정보 수정 요청:", JSON.stringify(userInfo));
    console.log("토큰:", accessToken);

    const response = await fetch("/v1/user/info/update", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userInfo),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "회원 정보 수정 실패");
    }

    return { success: true };
  } catch (error: any) {
    console.error("회원 정보 수정 오류:", error);
    return { success: false, message: error.message || "서버 오류 발생" };
  }
};
