import navigateIcon from '../../../assets/icons/navigatewhite.svg';
import { Link } from 'react-router-dom';
import { useUserStore } from '../../../stores/useUserStore';
import { getProfileImage } from '../../../utils/profileImageMapper';

const MyUserCard = (): JSX.Element => {
  const user = useUserStore((state) => state);

  const profileImg = getProfileImage(user.imgNum);

  return (
    <Link
      to="/my/manageaccount"
      className="bg-sub rounded-[20px] px-4 py-4 text-white h-[74px] flex items-center justify-between"
    >
      <div className="flex items-center gap-3">
        <img
          src={profileImg}
          alt="Profile"
          className="w-[46px] h-[46px] rounded-full"
        />
        <p className="text-20">
          <span className="font-pre-medium">{user.nickname}</span>
        </p>
      </div>
      <img src={navigateIcon} alt="navigateIcon" className="w-6 h-6" />
    </Link>
  );
};

export default MyUserCard;
