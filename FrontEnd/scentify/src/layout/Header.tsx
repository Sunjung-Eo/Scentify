import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Logo from '../assets/icons/scentify-green-logo.svg?react';
import FinishButton from '../components/Button/Button';
import BackBtn from '../assets/icons/back-arrow-btn.svg?react';
import AddBtn from '../assets/icons/add-btn.svg?react';
import { useControlStore } from '../stores/useControlStore';

interface HeaderProps {
  showBack: boolean;
  showFinish: boolean;
  showDeviceManage: boolean;
  showAdd: boolean;
  title?: string;
  onAddClick?: () => void;
  onDeviceManageClick?: () => void;
}

const Header = ({
  showBack,
  showFinish,
  showDeviceManage,
  showAdd,
  title,
  onAddClick,
  onDeviceManageClick,
}: HeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  // 뒤로가기 핸들러:
  const handleBackClick = () => {
    if (location.pathname === 'home/managedevice') {
      navigate('/home');
    } else if (window.history.length > 1) {
      navigate(-1); // 기본적으로 이전 페이지로 이동
    } else {
      navigate('/auth/login'); // 만약 이전 페이지가 없으면 로그인 페이지로 이동
    }
  };

  // 완료 버튼 핸들러:
  const { completeHandler } = useControlStore();
  const handleFinishClick = () => {
    if (completeHandler) {
      completeHandler();
    }
  };

  return (
    <header className="header flex w-full flex-row items-center justify-between px-5">
      {showBack ? (
        <button onClick={handleBackClick}>
          <BackBtn />
        </button>
      ) : (
        <div className="h-[30px] w-[65px]" />
      )}
      <div className="absolute left-1/2 -translate-x-1/2 transform">
        {title ? (
          <h1 className="font-pre-bold text-20 text-black">{title}</h1>
        ) : (
          <Logo />
        )}
      </div>
      {showFinish ? (
        <FinishButton onClick={handleFinishClick} />
      ) : showDeviceManage ? (
        <button
          className="font-pre-light text-14 tracking-[-1px] text-black"
          onClick={onDeviceManageClick}
        >
          기기 관리/추가
        </button>
      ) : showAdd ? (
        <button onClick={onAddClick}>
          <AddBtn />
        </button>
      ) : (
        <div className="h-[30px] w-[65px]" />
      )}
    </header>
  );
};

export default Header;
