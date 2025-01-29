import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { useLocation, useNavigate } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  console.log("Current Path:", location.pathname); // 디버깅용

  const showHeaderPaths = ["/home", "/scent", "/control", "/my", "/user"];
  const showHeader = showHeaderPaths.some((path) =>
    location.pathname.startsWith(path)
  );

  const showBack =
    location.pathname.startsWith("/user/regist") ||
    location.pathname.startsWith("/device/set") ||
    location.pathname.startsWith("/combination/set") ||
    location.pathname.startsWith("/control/auto/detect") ||
    location.pathname.startsWith("/control/auto/deodorize") ||
    location.pathname.startsWith("/control/auto/behavior") ||
    location.pathname.startsWith("/control/reservation/create") ||
    location.pathname.startsWith("/home/registcapsule") ||
    location.pathname.startsWith("/home/defaultscent") ||
    location.pathname.startsWith("/home/devicesetting") ||
    location.pathname.startsWith("/home/managedevice");

  const showFinish =
    location.pathname.startsWith("/home/capsule/set") ||
    location.pathname.startsWith("/home/combination/set") ||
    location.pathname.startsWith("/control/auto/detect") ||
    location.pathname.startsWith("/control/auto/deodorize") ||
    location.pathname.startsWith("/control/auto/behavior") ||
    location.pathname.startsWith("/control/reservation/create") ||
    location.pathname.startsWith("/home/registcapsule") ||
    location.pathname.startsWith("/home/defaultscent") ||
    location.pathname.startsWith("/home/devicesetting");

  const showDeviceManage = location.pathname === "/home"; // 정확히 "/home" 경로만 확인

  const showAdd =
    location.pathname.startsWith("/home/deviceManage") ||
    location.pathname.startsWith("/control") ||
    location.pathname.includes("/home/managedevice");

  // 로고 대신 title 출력
  const getHeaderTitle = (pathname: string) => {
    if (pathname.includes("/auto/detect")) return "탐지 모드";
    if (pathname.includes("/auto/deodorize")) return "탈취 모드";
    if (pathname.includes("/auto/behavior")) return "동작모드";
    if (pathname.includes("/reservation/create")) return "예약하기";
    if (pathname.includes("/home/registcapsule")) return "캡슐 등록";
    if (pathname.includes("/home/defaultscent")) return "기본향 등록";
    if (pathname.includes("/home/devicesetting")) return "기기 설정";
    if (pathname.includes("/home/managedevice")) return "기기 관리/추가";

    return undefined;
  };

  // +버튼 클릭 이벤트
  const handleAddClick = () => {
    if (location.pathname === "/control") {
      navigate("/control/reservation/create");
    } else if (location.pathname === "/home/managedevice") {
      navigate("/home/registdevice1");
    }
  };

  const handleDeviceManageClick = () => {
    navigate("/home/managedevice");
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
        />
      )}
      <main className="content flex flex-grow justify-center">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
