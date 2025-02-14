import { ReservationData } from "../../feature/control/reservation/ReservationType";

// 예약하기
export const createCustomSchedule = async (
  reservationData: ReservationData,
  accessToken: string
) => {
  const response = await fetch("/v1/custom/add", {
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

  return response.status;
};
