import React, { useEffect, useState } from 'react';
import { UserData } from '../../../feature/Home/mainhome/user/UserTypes';
import GreenProfile from '../../../assets/userProfiles/green.svg';
import navigateIcon from '../../../assets/icons/navigatewhite.svg';
import { Link } from 'react-router-dom';

interface MyUserCardProps {
  nickname: string;
  imgNum: number;
  mainDeviceId: number | null;
}

const MyUserCard: React.FC<MyUserCardProps> = ({
  nickname,
  imgNum,
  mainDeviceId,
}) => {
  const [userData, setUserData] = useState<UserData>({
    nickname: nickname, // 사용자 이름 하드코딩 (백엔드 연동 시 업데이트 가능)
    imgNum: imgNum, // 기본 프로필 사진 번호
    mainDeviceId: mainDeviceId ?? 0,
    date: '',
    weatherIcon: '',
    weatherDescription: '',
  });

  useEffect(() => {
    setUserData((prev) => ({
      ...prev,
      nickname: nickname ?? '사용자',
      imgNum: imgNum ?? 1,
      mainDeviceId: mainDeviceId ?? 0,
    }));
  }, [nickname, imgNum, mainDeviceId]);

  return (
    <Link
      to="/my/manageaccount"
      className="bg-sub rounded-3xl px-6 py-4 text-white h-[80px] flex items-center justify-between"
    >
      {/* 프로필이미지+닉네임 묶음 */}
      <div className="flex items-center gap-4">
        {/* 프로필 이미지 */}
        <img
          src={GreenProfile} // SVG 파일 사용
          alt="Profile"
          className="w-12 h-12 rounded-full"
        />
        {/* 닉네임 */}
        <p className="text-[20px]">
          <span className="font-pre-bold">{userData.nickname}</span>{' '}
          {/* 홍길동만 pre-bold */}
        </p>
      </div>

      {/* 오른쪽 끝으로 정렬된 아이콘 */}
      <img src={navigateIcon} alt="navigateIcon" className="w-6 h-6" />
    </Link>
  );
};

export default MyUserCard;
