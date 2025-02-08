import { behaviorData } from "../../feature/control/automation/AutoModeType";

// 탈취 모드
export const updateBehavior = async (
  behaviorData: behaviorData,
  accessToken: string
) => {
  const response = await fetch("/v1/auto/exercise/rest/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(behaviorData),
  });
  console.log("동작모드", behaviorData);

  return response.status;
};
