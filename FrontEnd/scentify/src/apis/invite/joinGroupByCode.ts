export interface JoinGroupResponse {
  success: boolean;
  message?: string;
}

/**
 * 초대 코드를 검증하고 그룹 가입 요청을 보냅니다.
 * @param inviteCode 초대 코드 (8자리)
 * @param accessToken 사용자 인증 토큰
 * @returns 성공 여부 및 메시지
 */

export const joinGroupByCode = async (
  inviteCode: string,
  accessToken: string
): Promise<JoinGroupResponse> => {
  try {
    console.log("API 요청 시작:", inviteCode, accessToken);
    const response = await fetch("/v1/group/verify-code", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inviteCode }),
    });
    console.log("API 응답 상태 코드:", response.status);

    if (response.ok) {
      return { success: true };
    }

    if (response.status === 409) {
      return { success: false, message: "빈 멤버 자리가 없습니다." };
    } else if (response.status === 410) {
      return { success: false, message: "초대코드가 만료되었습니다." };
    }

    throw new Error("알 수 없는 오류가 발생했습니다.");
  } catch (error: any) {
    console.error("API 호출 중 오류:", error);
    return { success: false, message: "서버 오류가 발생했습니다." };
  }
};
