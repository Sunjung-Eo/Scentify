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
    location.pathname.startsWith('/control/reservation/create') ||
    location.pathname.startsWith('/control/reservation/modify') ||
    location.pathname.startsWith('/home/registcapsule') ||
    location.pathname.startsWith('/home/defaultscent') ||
    location.pathname.startsWith('/home/devicesetting') ||
    location.pathname.startsWith('/home/managedevice') ||
    location.pathname.startsWith('/home/registdevice1') || // 추가
    location.pathname.startsWith('/home/registdevice2') || // 추가
    location.pathname.startsWith('/scent/scentmain') ||
    location.pathname.startsWith('/my') ||
    location.pathname.startsWith('/my/manageaccount') ||
    location.pathname.startsWith('/my/editnickname') ||
    location.pathname.startsWith('/my/edituserinfo') ||
    location.pathname.startsWith('/my/editpassword') ||
    location.pathname.startsWith('/my/editprofileimg') ||
    location.pathname.startsWith('/scent') ||
    location.pathname.startsWith('/user/reset-password') ||
    location.pathname.startsWith('/user/find-password');

  const showFinish =
    location.pathname.startsWith('/home/capsule/set') ||
    location.pathname.startsWith('/home/combination/set') ||
    location.pathname.startsWith('/control/auto/detect') ||
    location.pathname.startsWith('/control/auto/deodorize') ||
    location.pathname.startsWith('/control/auto/behavior') ||
    location.pathname.startsWith('/control/reservation/create') ||
    location.pathname.startsWith('/control/reservation/modify') ||
    location.pathname.startsWith('/home/registcapsule') ||
    location.pathname.startsWith('/home/defaultscent');
  const showDeviceManage = location.pathname === '/home';
  const showAdd =
    location.pathname.startsWith('/home/managedevice') ||
    location.pathname.startsWith('/control');
  const nextDeviceEdit = location.pathname.startsWith('/home/devicesetting');

  // 로고 대신 title 출력
  const getHeaderTitle = (pathname: string) => {
    if (pathname.includes('/auto/detect')) return '탐지 모드';
    if (pathname.includes('/auto/deodorize')) return '탈취 모드';
    if (pathname.includes('/auto/behavior')) return '동작모드';
    if (pathname.includes('/reservation/create')) return '예약하기';
    if (pathname.includes('/reservation/modify')) return '예약 수정';
    if (pathname.includes('/home/registcapsule')) return '캡슐 등록';
    if (pathname.includes('/home/defaultscent')) return '기본향 등록';
    if (pathname.includes('/home/devicesetting')) return '기기 설정';
    if (pathname.includes('/home/managedevice')) return '기기 관리/추가';
    return undefined;
  };

  // +버튼 클릭 이벤트
  const handleAddClick = () => {
    if (location.pathname === '/control') {
      navigate('/control/reservation/create');
    } else if (location.pathname === '/home/managedevice') {
      navigate('/home/registdevice1');
    }
  };

  const handleDeviceManageClick = () => {
    navigate('/home/managedevice');
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
          onDeviceManageClick={handleDeviceManageClick}
          nextDeviceEdit={nextDeviceEdit}
        />
      )}
      <main className="content flex justify-center">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
