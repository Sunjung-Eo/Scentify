import { DeleteGroupRequest } from "../../feature/my/editaccount/groupTypes";

export const deleteGroup = async (
  requestData: DeleteGroupRequest,
  accessToken: string
): Promise<void> => {
  try {
    const response = await fetch("/v1/group/delete", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error("해당 그룹의 관리자만 그룹을 삭제할 수 있습니다.");
      }
      if (response.status === 404) {
        throw new Error("삭제하려는 그룹이 존재하지 않습니다.");
      }
      if (response.status === 400) {
        throw new Error("잘못된 요청입니다.");
      }
      throw new Error("서버 오류가 발생했습니다.");
    }
  } catch (error: any) {
    throw new Error(error.message || "서버 오류가 발생했습니다.");
  }
};
