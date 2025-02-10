import { deodorizationData } from "../../feature/control/automation/AutoModeType";

// 탈취 모드
export const updateDeodorization = async (
  deodorizationData: deodorizationData,
  accessToken: string
) => {
  const response = await fetch("/v1/auto/deodorization/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(deodorizationData),
  });
  console.log("탈취모드", deodorizationData);

  return response.status;
};
