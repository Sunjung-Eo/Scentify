import kakaoLogo from '../../assets/icons/kakao-logo.svg';
import googleLogo from '../../assets/icons/google-logo.svg';
import { useNavigate } from 'react-router-dom';

const SocialLogoBtn = () => {
  // const navigate = useNavigate();

  const handleKakaoSocialLogin = (provider: 'kakao') => {
    // 백엔드 API 호출 후 해당 소셜 로그인 페이지로 리디렉트됨
    // feature/user/social/SocialLoginCallback
    window.location.href = `/v1/auth/${provider}/login`;
  };

  const handleGoogleSocialLogin = (provider: 'google') => {
    // 백엔드 API 호출 후 해당 소셜 로그인 페이지로 리디렉트됨
    console.log('구글 클릭!');
    window.location.href = `/v1/auth/${provider}/login`;
  };

  return (
    <div className="flex gap-5 pt-4">
      <button onClick={() => handleKakaoSocialLogin('kakao')}>
        <img src={kakaoLogo} alt="Kakao Logo" className="h-10 w-10" />
      </button>
      <button onClick={() => handleGoogleSocialLogin('google')}>
        <img src={googleLogo} alt="Google Logo" className="h-10 w-10" />
      </button>
    </div>
  );
};

export default SocialLogoBtn;
