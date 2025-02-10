// import React, { useEffect, useState } from "react";
// import { UserData } from "../../../feature/Home/mainhome/user/UserTypes";
// import GreenProfile from "../../../assets/userProfiles/green.svg";
// import navigateIcon from "../../../assets/icons/navigatewhite.svg";
// import { Link } from "react-router-dom";

// interface MyUserCardProps {
//   nickname: string;
//   imgNum: number;
//   mainDeviceId: number | null;
// }

// const MyUserCard: React.FC<MyUserCardProps> = ({
//   nickname,
//   imgNum,
//   mainDeviceId,
// }) => {
//   // userData 상태를 생성
//   // 초기 상태는 UserData 타입에 맞게 설정
//   // nickname, imgNum, mainDeviceId는 props로 받아온 값을 사용, mainDeviceId가 null인 경우 0을 기본값으로 사용
//   const [userData, setUserData] = useState<UserData>({
//     nickname: nickname, // 사용자 이름 하드코딩 (백엔드 연동 시 업데이트 가능)
//     imgNum: imgNum, // 기본 프로필 사진 번호
//     mainDeviceId: mainDeviceId ?? 0,
//     date: "",
//     weatherIcon: "",
//     weatherDescription: "",
//   });

//   // props가 변경될 때마다 userData 상태를 업데이트하기 위해 useEffect 사용
//   useEffect(() => {
//     // 이전 상태를 유지하면서 새로운 값들만 업데이트
//     setUserData((prev) => ({
//       ...prev,
//       nickname: nickname ?? "사용자", // nickname이 null 또는 undefined경우,"사용자" 기본값 사용
//       imgNum: imgNum ?? 1,
//       mainDeviceId: mainDeviceId ?? 0,
//     }));
//   }, [nickname, imgNum, mainDeviceId]);

//   return (
//     <Link
//       to="/my/manageaccount"
//       className="bg-sub rounded-3xl px-6 py-4 text-white h-[80px] flex items-center justify-between"
//     >
//       {/* 프로필이미지+닉네임 묶음 */}
//       <div className="flex items-center gap-4">
//         {/* 프로필 이미지 */}
//         <img
//           src={GreenProfile} // SVG 파일 사용
//           alt="Profile"
//           className="w-12 h-12 rounded-full"
//         />
//         {/* 닉네임 */}
//         <p className="text-[20px]">
//           <span className="font-pre-bold">{userData.nickname}</span>{" "}
//           {/* 홍길동만 pre-bold */}
//         </p>
//       </div>

//       {/* 오른쪽 끝으로 정렬된 아이콘 */}
//       <img src={navigateIcon} alt="navigateIcon" className="w-6 h-6" />
//     </Link>
//   );
// };

// export default MyUserCard;
import React from "react";
import navigateIcon from "../../../assets/icons/navigatewhite.svg";
import { Link } from "react-router-dom";
import { useUserStore } from "../../../stores/useUserStore";
// 유틸 함수로 프로필 이미지 번호에 따른 이미지 URL을 반환합니다.
import { getProfileImage } from "../../../utils/profileImageMapper";

/**
 * MyUserCard 컴포넌트는 현재 로그인한 사용자의 프로필 이미지와 닉네임을 표시합니다.
 * 프로필 이미지는 useUserStore에서 가져온 imgNum 값을 기반으로 getProfileImage 함수로 매핑됩니다.
 */
const MyUserCard = (): JSX.Element => {
  // Zustand 스토어에서 전체 사용자 정보를 가져옵니다.
  const user = useUserStore((state) => state);

  // getProfileImage 함수를 사용해, user.imgNum에 해당하는 이미지 URL을 얻어옵니다.
  // 이 함수는 utils/profileImageMapper 파일에서 정의되어 있으며, 이미지 배열을 기반으로 이미지를 반환합니다.
  const profileImg = getProfileImage(user.imgNum);

  return (
    <Link
      to="/my/manageaccount"
      className="bg-sub rounded-3xl px-6 py-4 text-white h-[80px] flex items-center justify-between"
    >
      {/* 프로필 이미지와 닉네임을 함께 표시하는 영역 */}
      <div className="flex items-center gap-4">
        <img
          src={profileImg}
          alt="Profile"
          className="w-12 h-12 rounded-full"
        />
        <p className="text-[20px]">
          <span className="font-pre-bold">{user.nickname}</span>
        </p>
      </div>

      {/* 오른쪽 끝에 위치한 내비게이션 아이콘 */}
      <img src={navigateIcon} alt="navigateIcon" className="w-6 h-6" />
    </Link>
  );
};

export default MyUserCard;
