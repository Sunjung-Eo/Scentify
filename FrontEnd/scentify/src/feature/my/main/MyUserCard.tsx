import navigateIcon from "../../../assets/icons/navigatewhite.svg";
import { Link } from "react-router-dom";
import { useUserStore } from "../../../stores/useUserStore";
import { getProfileImage } from "../../../utils/profileImageMapper";

/**
 * MyUserCard 컴포넌트는 현재 로그인한 사용자의 프로필 이미지와 닉네임을 표시합니다.
 * 프로필 이미지는 useUserStore에서 가져온 imgNum 값을 기반으로 getProfileImage 함수로 매핑됩니다.
 */
const MyUserCard = (): JSX.Element => {
  // Zustand 스토어에서 전체 사용자 정보를 가져옵니다.
  const user = useUserStore((state) => state);

  // getProfileImage 함수를 사용해, user.imgNum에 해당하는 이미지 URL얻기.
  // utils/profileImageMapper의 함수를 써서 이미지 배열을 기반으로 이미지를 반환.
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
          className="w-[46px] h-[46px] rounded-full"
        />
        <p className="text-20">
          <span className="font-pre-medium">{user.nickname}</span>
        </p>
      </div>

      {/* 오른쪽 끝에 위치한 내비게이션 아이콘 */}
      <img src={navigateIcon} alt="navigateIcon" className="w-6 h-6" />
    </Link>
  );
};

export default MyUserCard;
