import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../../../stores/useAuthStore';
import { useUserStore } from '../../../stores/useUserStore';

const SocialLoginCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams(); // useSearchParams로 URL의 쿼리 파라미터 처리
  const loginWithSocial = useAuthStore((state) => state.loginWithSocial);
  const setUser = useUserStore((state) => state.setUser); // useUse

  useEffect(() => {
    const handleLogin = async () => {
      // 쿼리 스트링 파싱 함수
      const provider = searchParams.get('provider');
      const social = searchParams.get('social');
      const status = searchParams.get('status');
      const email = searchParams.get('email');
      const id = searchParams.get('id');
      const group = searchParams.get('group');

      console.log('Parsed Params:', {
        social,
        status,
        email,
        provider,
        id,
        group,
      });

      if (!provider || (provider !== 'kakao' && provider !== 'google')) {
        console.error('잘못된 소셜 로그인 제공자:', provider);
        navigate('/login');
        return;
      }

      if (social === 'false') {
        // (이메일 정보는 있으나) 카카오 소셜 회원 아님 => 회원가입
        alert('기존에 회원가입한 계정이 있습니다.');
        navigate('/login');
        return;
      }

      if (social === 'true' && status === 'login') {
        if (!provider || (provider !== 'kakao' && provider !== 'google')) {
          console.error('잘못된 소셜 로그인 제공자:', provider);
          navigate('/login');
          return;
        }

        try {
          const token = await loginWithSocial(provider as 'kakao' | 'google');
          if (token) {
            if (group === 'false') {
              alert('그룹의 멤버 정원이 초과되었습니다.');
              navigate('/home');
            }
            if (id) {
              setUser({ id }); // 로그인 성공시 id 저장
            }
            navigate('/home');
          } else {
            navigate('/login');
          }
        } catch (error) {
          console.error(
            `${provider.toUpperCase()} 로그인 처리 중 오류:`,
            error
          );
          navigate('/login');
        }
        return;
      }

      if (social === 'true' && status === 'regist' && email) {
        // 회원 가입이 필요한 경우 / 로그인 시 썻던 이메일 담아서 줌
        alert(`${provider?.toUpperCase()} 회원가입이 필요합니다.`);
        navigate(`/user/regist/social?email=${encodeURIComponent(email)}`);
        return;
      }

      console.error('예기치 않은 오류 발생:', {
        social,
        provider,
        status,
        email,
      });
      navigate('/login');
    };

    handleLogin();
  }, [searchParams, navigate, loginWithSocial, setUser]);

  return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-lg">카카오 로그인 처리 중...</p>
    </div>
  );
};

export default SocialLoginCallback;
