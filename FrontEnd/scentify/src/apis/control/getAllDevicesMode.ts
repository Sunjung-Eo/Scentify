// 단일 기기 예약 전체 조회
const fetchReservations = async (deviceId: number, accessToken: string) => {
  try {
    const response = await fetch("/v1/custom/all", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ deviceId: deviceId }),
    });

    if (!response.ok) {
      throw new Error(`API 호출 실패: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error("예약 데이터 가져오기 실패:", error);
    throw error;
  }
};
// const fetchReservations = async (deviceId: number, accessToken: string) => {
//   const bodyData = JSON.stringify({ deviceId: deviceId });
//   console.log("📡 예약 조회 요청 데이터:", bodyData); // 전송되는 데이터 확인

//   const response = await fetch("/v1/custom/all", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${accessToken}`,
//     },
//     body: bodyData,
//   });

//   if (!response.ok) {
//     const errorText = await response.text(); // 서버 응답 내용 확인
//     console.error(`🚨 예약 조회 실패 (deviceId: ${deviceId}):`, errorText);
//     throw new Error(`예약 조회 실패 (HTTP ${response.status})`);
//   }

//   return response.json();
// };

// 단일 기기 자동화 모드 전체 조회
const fetchAutomations = async (deviceId: number, accessToken: string) => {
  const response = await fetch("/v1/auto/all", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ deviceId: deviceId }),
  });
  return response.json();
};

// 모든 기기 조회
export const getAllDevicesMode = async (
  deviceIds: number[],
  accessToken: string
) => {
  try {
    const deviceData = await Promise.all(
      deviceIds.map(async (id) => {
        const reservations = await fetchReservations(id, accessToken);
        return {
          deviceId: id,
          reservations,
        };
      })
    );
    return deviceData;
  } catch (error) {
    console.error("기기 데이터 가져오기 실패:", error);
    return [];
  }
};
// 현재 자동화모드 api 구현x
// // 모든 기기 조회
// export const getAllDevicesMode = async (
//   deviceIds: number[],
//   accessToken: string
// ) => {
//   try {
//     const deviceData = await Promise.all(
//       deviceIds.map(async (id) => {
//         const [reservations, automations] = await Promise.all([
//           fetchReservations(id, accessToken),
//           fetchAutomations(id, accessToken),
//         ]);
//         return {
//           deviceId: id,
//           reservations,
//           automations,
//         };
//       })
//     );
//     return deviceData;
//   } catch (error) {
//     console.error("기기 데이터 가져오기 실패:", error);
//     return [];
//   }
// };
