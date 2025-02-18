export interface RegisterDeviceResponse {
  id: number; // 등록된 디바이스의 PK
}

export const registDevice = async (
  serial: string,
  ipAddress: string,
  accessToken: string
) => {
  try {
    const response = await fetch('/v1/device/add', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ serial: serial, ipAddress: ipAddress }),
    });

    if (!response.ok) {
      throw response; // 오류 발생 시 response 객체 자체를 throw
    }

    return await response.json(); // 성공 시, 디바이스 ID 반환
  } catch (error: any) {
    console.error('디바이스 등록 실패:', error);
    throw error; // 오류를 그대로 던져서 UI에서 처리할 수 있도록 함
  }
};
