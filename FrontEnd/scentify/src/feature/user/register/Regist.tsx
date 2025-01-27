import { useNavigate } from 'react-router-dom';
import RegistForm from './components/RegistForm';
import Header from '../../../layout/Header';

const Regist = () => {
  const navigate = useNavigate();

  // 회원가입 완료 후 실행할 함수 정의
  const handleRegistrationComplete = () => {
    alert('회원가입이 완료되었습니다.');
    navigate('/auth/login');
  };

  return (
    <div className="app">
      <Header
        showBack={true} // 뒤로가기 버튼 활성화
        showFinish={false}
        showDeviceManage={false}
        showAdd={false}
      />
      <main className="content flex flex-grow justify-center">
        <div className="flex flex-col items-center justify-between">
          <div className="top-4 pt-4 font-pre-bold text-20">회원가입</div>
          <RegistForm onRegist={handleRegistrationComplete} />
          <button
            type="submit"
            form="registForm"
            className="mb-8 h-12 w-full rounded-lg bg-brand text-white"
          >
            Scentify 시작하기
          </button>
        </div>
      </main>
    </div>
  );
};

export default Regist;
