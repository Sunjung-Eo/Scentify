import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuthStore } from "./stores/useAuthStore.ts";
import Layout from "./layout/Layout.tsx";
import Home from "./pages/Home/Home.tsx";
import Control from "./pages/Control/Control.tsx";
import Scent from "./pages/Scent/Scent.tsx";
import My from "./pages/My/My.tsx";
import Start from "./pages/Start/start.tsx";
import Login from "./pages/Login/Login.tsx";
import Regist from "./feature/user/register/Regist.tsx";

import UserRoutes from "./feature/user/UserRoutes.tsx";
import "./styles/global.css";

// 실제 뷰포트 높이를 기준으로 CSS 변수 설정
const setScreenSize = () => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
};

function App() {
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    setScreenSize(); // 초기 로드 시 실행
    window.addEventListener("resize", setScreenSize); // 창 크기 변경 시 업데이트

    return () => {
      window.removeEventListener("resize", setScreenSize); // 컴포넌트 언마운트 시 제거
    };
  }, []);

  return (
    <Router>
      <Routes>
        {/* 시작 페이지, 로그인 페이지지 */}
        <Route path="/" element={<Start />} />
        <Route path="/auth/login" element={<Login />} />

        {/* 회원가입 페이지 - 독립적인 페이지로 처리 */}
        <Route path="/user/regist" element={<Regist />} />

        <Route
          path="/user/*"
          element={
            <Layout>
              <UserRoutes />
            </Layout>
          }
        />

        {/* 인증 여부에 따른 라우팅 처리 */}
        {isAuthenticated ? (
          <Route
            path="/*"
            element={
              <Layout>
                <Routes>
                  <Route path="/home/*" element={<Home />} />
                  <Route path="/control/*" element={<Control />} />
                  <Route path="/scent" element={<Scent />} />
                  <Route path="/my" element={<My />} />
                </Routes>
              </Layout>
            }
          />
        ) : (
          <Route path="/*" element={<Navigate to="/auth/login" replace />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;
