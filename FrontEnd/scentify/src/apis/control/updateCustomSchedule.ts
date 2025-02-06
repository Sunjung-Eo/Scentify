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
  console.log(reservationData);

  return response.status;
};
