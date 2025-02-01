import { useAuthStore } from '../../stores/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import LoginForm from '../../feature/user/login/components/LoginForm';
import '../../styles/global.css';
import { useState } from 'react';
import Logo from '../../assets/icons/scentify-green-logo.svg';
import SocialLogoBtn from '../../components/Social/SocialLogoBtn';
import { useUserStore } from '../../stores/useUserStore';
import { useDeviceStore } from '../../stores/useDeviceStore';

const Login = () => {
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await login(id, password); // 1. 로그인 수행
      navigate('/home');
    } catch (error) {
      alert('로그인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <main className="content flex w-full flex-col items-center justify-center">
        <img
          src={Logo}
          alt="Scentify Logo"
          className="mb-6 h-[32px] w-[110px]"
        />
        <div className="auth-container flex items-center justify-center">
          <LoginForm
            id={id}
            password={password}
            setId={setId}
            setPassword={setPassword}
            onLogin={handleLogin}
          />
        </div>
        <div className="flex py-6 font-pre-medium text-14">
          <Link to="/user/regist">회원가입 하기</Link>
          <span className="w-[56px]"></span>
          <Link to="/user/forgot-password">비밀번호 찾기</Link>
        </div>
        <span className="py-1 font-pre-light text-12 text-gray">
          SNS 계정으로 로그인
        </span>
        <SocialLogoBtn />
      </main>
    </div>
  );
};

export default Login;
