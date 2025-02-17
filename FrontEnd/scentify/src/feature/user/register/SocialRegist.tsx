import { useNavigate } from 'react-router-dom';
import Header from '../../../layout/Header';
import RegistFormSocial from './components/RegistFormSocial';
import { useSearchParams } from 'react-router-dom';

const SocialRegist = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email'); // 쿼리 스트링에서 email 가져오기

  // 회원가입 완료 후 실행할 함수 정의
  const handleSocialRegistrationComplete = () => {
    console.log('✅ onRegist() 실행됨!');
    alert('회원가입이 완료되었습니다.');
    navigate('/login');
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
          <div className="pt-4 pb-5 font-pre-bold text-20">소셜 회원가입</div>
          <div className="flex-1 overflow-y-auto w-full">
            <RegistFormSocial
              onRegist={handleSocialRegistrationComplete}
              email={email || ''}
            />
          </div>
          <button
            type="submit"
            form="registFormSocial"
            className="h-12 w-full rounded-lg bg-brand text-white font-pre-light text-16"
          >
            Scentify 시작하기
          </button>
        </div>
      </main>
    </div>
  );
};

export default SocialRegist;
