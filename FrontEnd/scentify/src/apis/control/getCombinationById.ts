export const getCombinationById = async (
  combinationId: number,
  accessToken: string
) => {
  try {
    const response = await fetch("/v1/custom/one", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ combinationId }),
    });

    if (!response.ok) {
      throw new Error(`API 호출 실패: ${response.status}`);
    }

    const data = await response.json();
    return data.combination;
  } catch (error) {
    console.error("조합 데이터 가져오기 실패:", error);
    throw error;
  }
};
