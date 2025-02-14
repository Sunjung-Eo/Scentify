import { ShareFavoriteResponse } from "../../feature/scent/scentmain/scenttypes";

export const shareFavoriteCombination = async (
  combinationId: number,
  accessToken: string // 🔹 토큰 추가
): Promise<ShareFavoriteResponse> => {
  try {
    const response = await fetch("/v1/favorite/share", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`, // 🔹 토큰 추가
      },
      body: JSON.stringify({ combinationId }),
    });

    if (!response.ok) {
      throw new Error(`API 호출 실패: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API호출 실패:", error);
    throw error;
  }
};
