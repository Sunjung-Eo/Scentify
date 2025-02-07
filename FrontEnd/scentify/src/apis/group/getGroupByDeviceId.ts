import { GroupInfoResponse } from "../../feature/my/groupTypes";

// 기기별 그룹 정보 조회 호출 API
export const getGroupByDeviceId = async (
  deviceId: number,
  accessToken: string
): Promise<GroupInfoResponse> => {
  try {
    const response = await fetch("/v1/group/info", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ deviceId }),
    });

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error("해당 그룹의 가입자가 아니기에 정보 권한이 없습니다.");
      }
      if (response.status === 400) {
        throw new Error("잘못된 요청입니다.");
      }
      throw new Error("서버 오류가 발생했습니다.");
    }

    return await response.json();
  } catch (error: any) {
    throw new Error(error.message || "서버 오류가 발생했습니다.");
  }
};
