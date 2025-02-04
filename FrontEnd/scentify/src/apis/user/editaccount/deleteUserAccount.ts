export interface DeleteUserAccountResponse {
  success: boolean; // 요청 성공 여부
  message?: string; // 실패 시 에러 메시지
}

// 회원 탈퇴 API 호출 함수
export const deleteUserAccount = async (
  accessToken: string
): Promise<DeleteUserAccountResponse> => {
  try {
    console.log("회원 탈퇴 요청");
    console.log("토큰:", accessToken);

    const response = await fetch("/v1/user/delete", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "회원 탈퇴 실패");
    }

    return { success: true };
  } catch (error: any) {
    console.error("회원 탈퇴 오류:", error);
    return { success: false, message: error.message || "서버 오류 발생" };
  }
};
