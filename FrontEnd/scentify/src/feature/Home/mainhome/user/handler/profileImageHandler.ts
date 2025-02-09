import profile0 from '../../../../../assets/userProfiles/green.svg';
import profile1 from '../../../../../assets/userProfiles/orange.svg';
import profile2 from '../../../../../assets/userProfiles/peach.svg';
import profile3 from '../../../../../assets/userProfiles/purple.svg';
import profile4 from '../../../../../assets/userProfiles/red.svg';
import profile5 from '../../../../../assets/userProfiles/yellowgreen.svg';

export const profileImages: Record<number, string> = {
  0: profile0,
  1: profile1,
  2: profile2,
  3: profile3,
  4: profile4,
  5: profile5,
};

/**
 * imgNum에 해당하는 프로필 이미지를 반환하는 함수
 * @param imgNum - 프로필 이미지 번호 (0-5)
 * @returns 프로필 이미지 경로
 */
export const getProfileImage = (imgNum: number): string => {
  return profileImages[imgNum] || profile0; // 유효하지 않은 번호일 경우 기본값으로 profile0 반환
};
