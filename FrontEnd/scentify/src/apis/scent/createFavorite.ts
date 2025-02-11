import { combinationIds } from "../../feature/scent/scentmain/scenttypes";

// 찜 내역 보내기
// export const createFavorite = async (
//   combinationIds: combinationIds,
//   accessToken: string
// ) => {
//   const response = await fetch("/v1/favorite/create", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${accessToken}`,
//     },
//     body: JSON.stringify(combinationIds),
//   });
//   // console.log(reservationData);

//   return response.status;
// };
export const createFavorite = async (
  combinationIds: combinationIds,
  accessToken: string
) => {
  const uniqueIds = Array.from(new Set(combinationIds.combinationIds));

  const response = await fetch("/v1/favorite/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ combinationIds: uniqueIds }),
  });
  return response.status;
};
