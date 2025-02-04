// 프로필 이미지 파일 import (utils에서 모든 이미지 관리)
import greenProfile from "../assets/userProfiles/green.svg";
import orangeProfile from "../assets/userProfiles/orange.svg";
import peachProfile from "../assets/userProfiles/peach.svg";
import purpleProfile from "../assets/userProfiles/purple.svg";
import redProfile from "../assets/userProfiles/red.svg";
import yellowGreenProfile from "../assets/userProfiles/yellowgreen.svg";

// 이미지 배열 생성
const profileImages = [
  greenProfile,
  orangeProfile,
  peachProfile,
  purpleProfile,
  redProfile,
  yellowGreenProfile,
];

// 이미지 매핑 함수
export const getProfileImage = (imgNum: number) => {
  return profileImages[imgNum]; // imgNum이 항상 유효한 값이므로 기본값 필요 없음
};
