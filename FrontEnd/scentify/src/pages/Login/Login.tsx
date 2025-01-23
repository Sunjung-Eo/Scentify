import { useAuthStore } from '../../stores/useAuthStore';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../../feature/user/user/loginForm';
import '../../styles/global.css';
import { useState } from 'react';

const Login = () => {
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  
  const handleLogin = async () => {
    setLoading(true);
    try {
      await login(id, password);  // 사용자 입력값 사용
      navigate("/home");
    } catch (error) {
      alert("로그인에 실패했습니다.");
    } finally {
      setLoading(false);
    }

    // 임시 토큰을 하드코딩 (실제 백엔드 연결 전까지 사용)
    // const mockToken = 'mock-access-token-123456';
    // const id = "a@a.com";
    // const password = "a";
    // Zustand 상태 업데이트
    // login(id, password);

    // 홈 페이지로 이동
    // navigate('/home');
  };

  return (
    <div className="app flex justify-center items-center min-h-screen">
      <div className="auth-container flex justify-center items-center">
        <LoginForm 
          id={id}
          password={password}
          setId={setId}
          setPassword={setPassword}
          onLogin={handleLogin}
        />
      </div>
    </div>
  );
};

export default Login;