// 찜 리스트 전체 조회
export const getAllFavorite = async (accessToken: string) => {
  try {
    const response = await fetch("/v1/favorite/all", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`API 호출 실패: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error("예약 데이터 가져오기 실패:", error);
    throw error;
  }
};
