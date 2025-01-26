import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/useAuthStore';

const My = () => {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/auth/login'); // 로그아웃 후 로그인 페이지로 이동
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  return (
    <div className="flex h-full items-center justify-center">
      <button onClick={handleLogout}>로그아웃</button>
    </div>
  );
};

export default My;
