import React, { useEffect, useState } from 'react';
import { UserData } from '../../../feature/Home/mainhome/user/UserTypes';
import GreenProfile from '../../../assets/userProfiles/green.svg';

export const MyUserCard: React.FC = () => {
  const [userData, setUserData] = useState<UserData>({
    userId: 'aaaa',
    userName: '홍길동', // 사용자 이름 하드코딩 (백엔드 연동 시 업데이트 가능)
    imgNum: 1, // 기본 프로필 사진 번호
    mainDeviceId: 0,
    date: '',
    weatherIcon: '',
    weatherDescription: '',
  });

  const [error, setError] = useState<string | null>(null); // 에러 상태

  // 1. 현재 날짜 가져오기
  const getCurrentDate = (): string => {
    const today = new Date();
    const day = today.getDate();
    const month = today.toLocaleString('en-US', { month: 'long' });
    const year = today.getFullYear();
    return `Today ${day} ${month} ${year}`;
  };

  return (
    <div className="bg-sub rounded-3xl px-6 py-4 text-white h-[80px] flex flex-col">
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
          <span className="font-pre-bold">{userData.userName}</span>{' '}
          {/* 홍길동만 pre-bold */}
        </p>
      </div>
    </div>
  );
};

export default MyUserCard;
