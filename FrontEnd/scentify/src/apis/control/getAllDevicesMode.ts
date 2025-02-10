// 단일 기기 예약 전체 조회
export const fetchReservations = async (
  deviceId: number,
  accessToken: string
) => {
  try {
    const response = await fetch('/v1/custom/all', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ deviceId: deviceId }),
    });

    if (!response.ok) {
      throw new Error(`API 호출 실패: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('예약 데이터 가져오기 실패:', error);
    throw error;
  }
};

// 모든 기기 예약 전체 조회
export const getAllDevicesReservationMode = async (
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
    console.log('기기호출데이터', deviceData);
    return deviceData;
  } catch (error) {
    console.error('기기 데이터 가져오기 실패:', error);
    return [];
  }
};

// 단일 기기 자동화 전체 조회
export const fetchAutomations = async (
  deviceId: number,
  accessToken: string
) => {
  const response = await fetch('/v1/auto/all', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ deviceId: deviceId }),
  });
  return response.json();
};

// 모든 기기 자동화 전체 조회
export const getAllDevicesAutomationMode = async (
  deviceIds: number[],
  accessToken: string
) => {
  try {
    const deviceData = await Promise.all(
      deviceIds.map(async (id) => {
        const automations = await fetchAutomations(id, accessToken);
        return {
          deviceId: id,
          automations,
        };
      })
    );
    console.log('기기호출데이터', deviceData);
    return deviceData;
  } catch (error) {
    console.error('기기 데이터 가져오기 실패:', error);
    return [];
  }
};
