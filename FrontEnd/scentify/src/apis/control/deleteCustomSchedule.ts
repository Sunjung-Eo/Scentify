// 예약 삭제
export const deleteCustomSchedule = async (
  customScheduleId: number,
  selectedDevice: number,
  accessToken: string
) => {
  const response = await fetch("/v1/custom/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ id: customScheduleId, deviceId: selectedDevice }),
  });

  return response.status;
};
