export interface UpdateProfileImgRequest {
  imgNum: number; //사용자가 선택한 이미지 번호
}

export interface UpdateProfileImgResponse {
  success: boolean; // 요청 성공 여부 (true: 성공, false: 실패)
  message?: string; // 실패 시 에러 메시지 (선택적)
}

//   프로필 이미지 변경 API 호출 함수
export const updateUserImg = async (
  imgNum: number, // 사용자가 선택한 이미지 번호
  accessToken: string // 로그인된 사용자의 인증 토큰
): Promise<UpdateProfileImgResponse> => {
  try {
    console.log("보낼 데이터:", JSON.stringify({ imgNum }));
    console.log("토큰:", accessToken);

    // API 요청
    const response = await fetch("/v1/user/img/update", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imgNum }),
    });

    // 응답이 정상적이지 않으면 에러 처리
    if (!response.ok) {
      const errorData = await response.json(); // 서버에서 반환한 에러 메시지 추출
      throw new Error(errorData.message || "프로필 이미지 변경 실패"); // 에러 메시지를 예외 발생
    }

    return { success: true }; // 요청이 성공하면 success: true 반환
  } catch (error: any) {
    console.error("API 요청 중 오류 발생:", error);
    return { success: false, message: error.message || "서버 오류 발생" }; // 오류 메시지를 반환
  }
};
