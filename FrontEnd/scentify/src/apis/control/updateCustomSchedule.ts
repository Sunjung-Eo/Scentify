import { ReservationData } from "../../feature/control/reservation/ReservationType";

// 예약 수정
export const updateCustomSchedule = async (
  reservationData: ReservationData,
  accessToken: string
) => {
  const response = await fetch("/v1/custom/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(reservationData),
  });
  // 기존 스케줄과 시간이 겹치는 경우
  if (response.status === 403) {
    throw new Error("403");
  }
  if (response.status === 409) {
    throw new Error("409");
  }

  return response.status;
};
