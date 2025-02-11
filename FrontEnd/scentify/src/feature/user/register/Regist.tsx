import { useNavigate } from 'react-router-dom';
import Layout from '../../../layout/Layout';
import kakaoLogo from '../../../assets/icons/kakao-logo.svg';
import googleLogo from '../../../assets/icons/google-logo.svg';

const Regist = () => {
  const navigate = useNavigate();

  const handleKakaoLogin = () => {
    // 백엔드 API 호출 후 카카오 로그인 페이지로 리디렉트됨
    window.location.href = '/v1/auth/kakao/login';
  };

  const handleGoogleLogin = () => {
    // 백엔드 API 호출 후 카카오 로그인 페이지로 리디렉트됨
    window.location.href = '/v1/auth/google/login';
  };

  return (
    <Layout>
      <div className="flex flex-col items-center mt-4">
        <p className="font-pre-bold text-20">회원가입</p>
        <div className="flex flex-col items-center justify-center mt-10">
          {/* 소셜 버튼 */}
          <div className="flex flex-col justify-center item-center">
            <p className="font-pre-light text-16 text-gray mt-20 pt-14">
              SNS 계정으로 시작하기
            </p>
            <div className="flex flex-row justify-between  p-4">
              <button onClick={handleKakaoLogin}>
                <img src={kakaoLogo} alt="Kakao Logo" className="h-12 w-12" />
              </button>
              <button onClick={handleGoogleLogin}>
                <img src={googleLogo} alt="Google Logo" className="h-12 w-12" />
              </button>
            </div>
          </div>
          {/* 일반 버튼 */}
          <button
            onClick={() => navigate('/user/regist/general')}
            className="mt-10 font-pre-medium bg-brand text-white px-6 py-2 rounded"
          >
            일반 회원가입하기
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Regist;
