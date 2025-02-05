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
  console.log(reservationData);

  return response.status;
};
