import kakaoLogo from '../../assets/icons/kakao-logo.svg';
import googleLogo from '../../assets/icons/google-logo.svg';
import { useNavigate } from 'react-router-dom';

const SocialLogoBtn = () => {
  // const navigate = useNavigate();

  const handleSocialLogin = (provider: 'kakao' | 'google') => {
    // 백엔드 API 호출 후 해당 소셜 로그인 페이지로 리디렉트됨
    // feature/user/social/SocialLoginCallback
    window.location.href = `/v1/auth/${provider}/login`;
  };

  return (
    <div className="flex gap-5 pt-4">
      <button onClick={() => handleSocialLogin('kakao')}>
        <img src={kakaoLogo} alt="Kakao Logo" className="h-10 w-10" />
      </button>
      <button>
        <img src={googleLogo} alt="Google Logo" className="h-10 w-10" />
      </button>
    </div>
  );
};

export default SocialLogoBtn;
