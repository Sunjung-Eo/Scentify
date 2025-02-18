import { useNavigate } from 'react-router-dom';
import RegistForm from './components/RegistForm';
import Header from '../../../layout/Header';
import { useState } from 'react';
import Alert from '../../../components/Alert/Alert';

const GeneralRegist = () => {
  const navigate = useNavigate();
  const [alertMessage, setAlertMessage] = useState<string>('');
  // 회원가입 완료 후 실행할 함수 정의
  const handleRegistrationComplete = () => {
    setAlertMessage('회원가입이 완료되었습니다.');
    console.log('회원가입 완료 후 login으로 이동!');
    setTimeout(() => {
      navigate('/login');
    }, 1000);
  };

  return (
    <div className="app">
      <Header
        showBack={true} // 뒤로가기 버튼 활성화
        showFinish={false}
        showDeviceManage={false}
        showAdd={false}
        showCancel={false}
        nextDeviceEdit={false}
      />
      <main className="content flex flex-col w-full min-h-screen mx-auto">
        <div className="flex flex-col items-center justify-between h-full">
          <div className="pt-4 pb-5 font-pre-bold text-20">일반 회원가입</div>
          <div className="flex-1 overflow-y-auto w-full">
            <RegistForm onRegist={handleRegistrationComplete} />
          </div>

          <div className="w-full pt-4">
            <button
              type="submit"
              form="registForm"
              className="h-12 w-full rounded-lg bg-brand text-white font-pre-light text-16"
            >
              Scentify 시작하기
            </button>
          </div>
        </div>
      </main>
      {alertMessage && (
        <Alert
          message={alertMessage}
          onClose={() => setAlertMessage('')}
          showButtons={false} // 모든 버튼 숨기기
        />
      )}
    </div>
  );
};

export default GeneralRegist;
