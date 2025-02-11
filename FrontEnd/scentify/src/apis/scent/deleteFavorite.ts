// 단일 향 삭제
export const deleteFavorite = async (
  deleteFavoriteId: number,
  accessToken: string
) => {
  try {
    const response = await fetch("/v1/favorite/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ combinationId: deleteFavoriteId }),
    });

    if (!response.ok) {
      throw new Error(`API 호출 실패: ${response.status}`);
    }
    // 빈 값이 온 경우 처리
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return response.json();
    }
    return response.status;
  } catch (error) {
    console.error("예약 데이터 가져오기 실패:", error);
    throw error;
  }
};

// 향 리스트 한번에 삭제
export const deleteAllFavorite = async (
  deleteFavoriteIds: number[],
  accessToken: string
) => {
  try {
    await Promise.all(
      deleteFavoriteIds.map((id) => deleteFavorite(id, accessToken))
    );
    console.log("모든 항목 삭제 완료");
  } catch (error) {
    console.error("일괄 삭제 실패:", error);
    throw error;
  }
};
