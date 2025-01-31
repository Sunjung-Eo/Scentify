/**
 * 찜한 향기 조합 삭제 API 요청
 */
export const removeCombinationFromFavorites = async (
  combinationId: string
): Promise<number> => {
  try {
    const response = await fetch("/v1/favorite/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ combinationId: combinationId }),
      credentials: "include", // 리프레시 토큰 HttpOnly 쿠키 전달
    });

    if (response.ok) {
      console.log("찜한 향기 조합 삭제 성공: 상태 코드 200");
      return 200; // 성공 시 200 반환
    } else if (response.status === 400) {
      throw new Error("잘못된 요청입니다.");
    } else {
      throw new Error(`서버 오류 발생: ${response.status}`);
    }
  } catch (error) {
    console.error("찜한 향기 조합 삭제 요청 실패:", error);
    throw error; // 호출한 쪽에서 예외 처리하도록 throw
  }
};
