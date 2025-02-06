import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuthStore } from "./stores/useAuthStore.ts";

// 레이아웃
import Layout from "./layout/Layout.tsx";
import "./styles/global.css";

// 탭
import Home from "./pages/Home/Home.tsx";
import Control from "./pages/Control/Control.tsx";
import Scent from "./pages/Scent/Scent.tsx";
import My from "./pages/My/My.tsx";

// 시작 페이지, 로그인 페이지
import Start from "./pages/Start/start.tsx";
import Login from "./pages/Login/Login.tsx";

import UserRoutes from "./feature/user/UserRoutes.tsx";

import GeneralRegist from "./feature/user/register/GeneralRegist.tsx";
import SocialRegist from "./feature/user/register/SocialRegist.tsx";
import Regist from "./feature/user/register/Regist.tsx";
import SocialLoginCallback from "./feature/user/social/SocialLoginCallback.tsx";
import InviteCodeInput from "./feature/invite/InviteCodeInput.tsx";
import LinkInvite from "./feature/invite/LinkInvite.tsx";
import Invite from "./feature/invite/Invite.tsx";

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
        {/*
        <Route
          path="/home/*"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route
          path="/my/*"
          element={
            <Layout>
              <My />
            </Layout>
          }
        />
        <Route
          path="/scent/*"
          element={
            <Layout>
              <Scent />
            </Layout>
          }
        />
        <Route
          path="/control/*"
          element={
            <Layout>
              <Control />
            </Layout>
          }
        />
        */}
        <Route
          path="/invite/*"
          element={
            <Layout>
              <Invite />
            </Layout>
          }
        />
        <Route
          path="/invite/invitecodeinput"
          element={
            <Layout>
              <InviteCodeInput />
            </Layout>
          }
        />
        {/* 시작 페이지, 로그인 페이지 */}
        <Route path="/" element={<Start />} />
        <Route path="/login" element={<Login />} />

        {/* 회원가입 페이지 - 독립적인 페이지로 처리 */}
        <Route path="/user/regist/" element={<Regist />} />
        <Route path="/user/regist/general" element={<GeneralRegist />} />
        <Route path="/user/regist/social" element={<SocialRegist />} />

        {/* ✅ 소셜 로그인 콜백 경로 추가 */}
        <Route path="/login/social" element={<SocialLoginCallback />} />

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
          <>
            <Route
              path="/home/*"
              element={
                <Layout>
                  <Home />
                </Layout>
              }
            />
            <Route
              path="/scent/*"
              element={
                <Layout>
                  <Scent />
                </Layout>
              }
            />
            <Route
              path="/control/*"
              element={
                <Layout>
                  <Control />
                </Layout>
              }
            />
            <Route
              path="/my/*"
              element={
                <Layout>
                  <My />
                </Layout>
              }
            />
          </>
        ) : (
          <Route path="/*" element={<Navigate to="/login" replace />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;
