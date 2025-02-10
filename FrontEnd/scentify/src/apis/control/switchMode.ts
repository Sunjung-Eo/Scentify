// 기기 모드 변경
export const switchMode = async (
  deviceId: number,
  mode: boolean,
  accessToken: string
) => {
  try {
    const response = await fetch("/v1/device/mode/set", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ deviceId: deviceId, mode: mode }),
    });

    if (!response.ok) {
      throw new Error(`API 호출 실패: ${response.status}`);
    }

    return response.status;
  } catch (error) {
    console.error("모드 변경 실패:", error);
    throw error;
  }
};
