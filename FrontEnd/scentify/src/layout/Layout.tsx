import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { useLocation, useNavigate } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  console.log('Current Path:', location.pathname); // 디버깅용

  const showHeaderPaths = ['/home', '/scent', '/control', '/my', '/user'];
  const showHeader = showHeaderPaths.some((path) =>
    location.pathname.startsWith(path)
  );

  const showBack =
    location.pathname.startsWith('/user/regist') ||
    location.pathname.startsWith('/device/set') ||
    location.pathname.startsWith('/combination/set') ||
    location.pathname.startsWith('/control/auto/detect') ||
    location.pathname.startsWith('/control/auto/deodorize') ||
    location.pathname.startsWith('/control/auto/behavior') ||
    location.pathname.startsWith('/control/reservation/create');
  location.pathname.startsWith('/home/registcapsule');
  const showFinish =
    location.pathname.startsWith('/home/capsule/set') ||
    location.pathname.startsWith('/home/combination/set') ||
    location.pathname.startsWith('/control/auto/detect') ||
    location.pathname.startsWith('/control/auto/deodorize') ||
    location.pathname.startsWith('/control/auto/behavior') ||
    location.pathname.startsWith('/control/reservation/create');
  location.pathname.startsWith('/home/registcapsule');
  const showDeviceManage = location.pathname.startsWith('/home');
  const showAdd =
    location.pathname.startsWith('/home/deviceManage') ||
    location.pathname.startsWith('/control');

  // 로고 대신 title 출력
  const getHeaderTitle = (pathname: string) => {
    if (pathname.includes('/auto/detect')) return '탐지 모드';
    if (pathname.includes('/auto/deodorize')) return '탈취 모드';
    if (pathname.includes('/auto/behavior')) return '동작모드';
    if (pathname.includes('/reservation/create')) return '예약하기';
    if (pathname.includes('/home/registcapsule')) return '캡슐 등록';
    return undefined;
  };

  // +버튼 클릭 이벤트
  const handleAddClick = () => {
    if (location.pathname === '/control') {
      navigate('/control/reservation/create');
    }
  };

  return (
    <div className="app">
      {showHeader && (
        <Header
          showBack={showBack}
          showFinish={showFinish}
          showDeviceManage={showDeviceManage}
          showAdd={showAdd}
          title={getHeaderTitle(location.pathname)}
          onAddClick={handleAddClick}
        />
      )}
      <main className="content flex justify-center">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
