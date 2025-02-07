import { detectionData } from "../../feature/control/automation/AutoModeType";
// 탈취 모드
export const updateDetection = async (
  deodorizationData: detectionData,
  accessToken: string
) => {
  const response = await fetch("/v1/auto/detection/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(deodorizationData),
  });
  console.log("탐지모드", deodorizationData);

  return response.status;
};
