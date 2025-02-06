import { CreateInviteCodeResponse } from "../../feature/invite/invitetypes";

/**
 * 초대 코드를 생성하는 함수
 * @param deviceId 디바이스 ID (초대를 요청하는 기기의 고유 ID)
 * @param accessToken 사용자 인증 토큰
 * @returns 성공 시 초대 코드를 반환, 실패 시 null 반환
 */
export const createInviteCode = async (
  deviceId: number,
  accessToken: string
) => {
  try {
    // 초대 코드 생성 API 호출
    console.log("deviceId : ", deviceId);
    const response = await fetch("/v1/group/invite", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ deviceId: deviceId }), // 요청에 디바이스 ID 포함
    });

    console.log("deviceId2 : ", deviceId);
    if (!response.ok) {
      // 상태 코드에 따른 예외 처리
      if (response.status === 403) {
        throw new Error(
          "해당 디바이스의 ADMIN이 아니기에 초대 권한이 없습니다."
        );
      } else if (response.status === 400) {
        throw new Error("잘못된 요청입니다.");
      } else if (response.status === 401) {
        throw new Error("토큰이 만료되었습니다. 다시 로그인 해주세요.");
      }
      throw new Error("알 수 없는 오류가 발생했습니다.");
    }

    // 응답 데이터를 JSON 형식으로 반환
    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error("초대 코드 생성 중 오류 발생:", error.message);
    return null;
  }
};
