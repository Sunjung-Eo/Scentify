import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Logo from '../assets/icons/scentify-green-logo.svg?react';
import FinishButton from '../components/Button/Button';
import BackBtn from '../assets/icons/back-arrow-btn.svg?react';
import AddBtn from '../assets/icons/add-btn.svg?react';
import { useControlStore } from '../stores/useControlStore';
import NextButton from '../components/Button/NextButton';

interface HeaderProps {
  showBack: boolean;
  showFinish: boolean;
  showDeviceManage: boolean;
  showAdd: boolean;
  title?: string;
  nextDeviceEdit: boolean;
  onAddClick?: () => void;
  onDeviceManageClick?: () => void;
}

const Header = ({
  showBack,
  showFinish,
  showDeviceManage,
  showAdd,
  title,
  nextDeviceEdit,
  onAddClick,
  onDeviceManageClick,
}: HeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  // 뒤로가기 핸들러:
  const handleBackClick = () => {
    if (location.pathname === 'home/managedevice') {
      navigate('/home');
    } else if (location.pathname === '/user/regist/social') {
      navigate('/login');
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

  // 다음 버튼 핸들러:
  // 다음 버튼 핸들러:
  const handleNextClick = () => {
    console.log('🛑 Next 버튼 클릭됨!');

    if (completeHandler) {
      console.log('✅ completeHandler 실행됨!');
      completeHandler(); // 🚀 `handleSubmit` 실행
    } else {
      console.log('❌ completeHandler가 없음! 직접 navigate 실행');
      navigate('/home/devicesetting/defaultscent', { state: location.state });
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
      ) : nextDeviceEdit ? ( // ✅ nextDeviceEdit이 true일 때 NextButton 표시
        <NextButton onClick={handleNextClick} />
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
