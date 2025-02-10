import { CreateInviteCodeResponse } from "../../feature/invite/invitetypes";

/**
 * 초대 코드를 생성하는 함수
 * @param deviceId 디바이스 ID (초대를 요청하는 기기의 고유 ID)
 * @param accessToken 사용자 인증 토큰
 * @returns 성공 시 초대 코드 (`CreateInviteCodeResponse`), 실패 시 오류 발생
 */
export const createInviteCode = async (
  deviceId: number,
  accessToken: string
): Promise<CreateInviteCodeResponse> => {
  try {
    if (!deviceId) {
      throw new Error("디바이스 ID가 제공되지 않았습니다.");
    }

    console.log("🔹 초대 코드 생성 요청 - deviceId:", deviceId);

    const response = await fetch("/v1/group/invite", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ deviceId }),
    });

    if (!response.ok) {
      console.error("🔹 서버 응답 오류:", response.status, response.statusText);
      switch (response.status) {
        case 400:
          throw new Error("잘못된 요청입니다.");
        case 401:
          throw new Error("토큰이 만료되었습니다. 다시 로그인 해주세요.");
        case 403:
          throw new Error(
            "해당 디바이스의 ADMIN이 아니기에 초대 권한이 없습니다."
          );
        default:
          throw new Error("알 수 없는 오류가 발생했습니다.");
      }
    }

    const data: CreateInviteCodeResponse = await response.json();
    console.log("✅ 초대 코드 생성 성공:", data);

    return data;
  } catch (error: any) {
    console.error("❌ 초대 코드 생성 중 오류 발생:", error.message);
    throw new Error(error.message || "초대 코드 생성에 실패했습니다.");
  }
};
