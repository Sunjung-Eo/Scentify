import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { useLocation } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  console.log("Current Path:", location.pathname); // 디버깅용

  const showHeaderPaths = ["/home", "/scent", "/control", "/my", "/user"];
  const showHeader = showHeaderPaths.some((path) =>
    location.pathname.startsWith(path)
  );

  const showBack =
    location.pathname.startsWith("/user/regist") ||
    location.pathname.startsWith("/device/set") ||
    location.pathname.startsWith("/combination/set");
  const showFinish =
    location.pathname.startsWith("/home/capsule/set") ||
    location.pathname.startsWith("/home/combination/set");
  const showDeviceManage = location.pathname.startsWith("/home");
  const showAdd = location.pathname.startsWith("/home/deviceManage");

  return (
    <div className="app">
      {showHeader && (
        <Header
          showBack={showBack}
          showFinish={showFinish}
          showDeviceManage={showDeviceManage}
          showAdd={showAdd}
        />
      )}
      <main className="content flex flex-grow justify-center">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
