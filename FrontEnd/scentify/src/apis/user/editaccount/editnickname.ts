export interface UpdateNicknameRequest {
  nickname: string;
}

export interface UpdateNicknameResponse {
  success: boolean;
  message?: string;
}

export const updateUserNickname = async (
  nickname: string,
  accessToken: string
): Promise<UpdateNicknameResponse> => {
  try {
    console.log("보낼 데이터:", JSON.stringify({ nickname }));
    console.log("토큰:", accessToken);
    const response = await fetch("/v1/user/nickname/update", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nickname }),
    });

    if (!response.ok) {
      throw response;
    }

    return { success: true };
  } catch (error: any) {
    if (error.status === 400) {
      return { success: false, message: "잘못된 요청입니다." };
    }
    return { success: false, message: "닉네임 변경 중 오류가 발생했습니다." };
  }
};
