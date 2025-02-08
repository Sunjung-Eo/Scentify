export interface UserInfoResponse {
  success: boolean; // 요청 성공 여부
  gender?: number; // 성별 (0: 여성, 1: 남성, 2: 선택하지 않음)
  birth?: string; // 생년월일 (YYYY-MM-DD)
  message?: string; // 실패 시 에러 메시지
}

// 회원 정보 조회 API 호출 함수
export const getUserInfo = async (
  accessToken: string
): Promise<UserInfoResponse> => {
  try {
    console.log("회원 정보 조회 요청:", accessToken);

    const response = await fetch("/v1/user/info/get", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "회원 정보 조회 실패");
    }

    const data = await response.json();
    return { success: true, ...data };
  } catch (error: any) {
    console.error("회원 정보 조회 오류:", error);
    return { success: false, message: error.message || "서버 오류 발생" };
  }
};
