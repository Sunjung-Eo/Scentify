import { ReadShareFavoriteResponse } from "../../feature/scent/scentmain/scenttypes";

// 공유된 향기 조합 정보를 가져오는 API 호출 함수
export const readShareFavorite = async (
  combinationId: number,
  imageName: string
): Promise<ReadShareFavoriteResponse | null> => {
  try {
    const response = await fetch(
      `/v1/favorite/share/read?combinationId=${combinationId.toString()}&imageName=${encodeURIComponent(imageName)}`
    );

    if (!response.ok) {
      throw new Error(`API 호출 실패: ${response.status}`);
    }

    const data: ReadShareFavoriteResponse = await response.json();

    if (!data.combination || !data.s3Url) {
      console.error("❌ API 응답 데이터 오류:", data);
      return null;
    }

    return data;
  } catch (error) {
    console.error("❌ API 호출 오류:", error);
    return null;
  }
};
