// 기기 정보 얻기
export const getDeviceInfo = async (
  deviceIds: number[],
  accessToken: string
) => {
  const response = await fetch("/v1/device/info", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ deviceIds: deviceIds }),
  });

  const data = await response.json();
  return data;
};
