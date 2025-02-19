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
  showCancel: boolean;
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
  showCancel,
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

  // 취소 버튼 핸들러 추가
  const handleCancelClick = () => {
    navigate('/home', { replace: true });
  };

  // 다음 버튼 핸들러:
  // 다음 버튼 핸들러:
  const handleNextClick = () => {
    if (completeHandler) {
      completeHandler(); // `handleSubmit` 실행
    } else {
      navigate('/home/edit/capsule', { state: location.state });
    }
  };

  return (
    <header className="header px-4 flex w-full flex-row items-center justify-between">
      {showBack ? (
        <button onClick={handleBackClick}>
          <BackBtn />
        </button>
      ) : showCancel ? (
        <button
          onClick={handleCancelClick}
          className="border-0.2 h-[30px] w-[65px] border-[#AFB1B6] text-center font-[Pretendard] text-[12px] font-light text-black rounded-lg hover:bg-brand hover:text-white transition-colors"
        >
          취소
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
          className="font-pre-light text-12 tracking-[-1px] text-black px-2 py-1 border-[0.2px] border-gray-300 rounded-lg"
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
