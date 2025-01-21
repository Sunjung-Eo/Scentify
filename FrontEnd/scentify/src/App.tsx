import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './layout/Layout.tsx';
import Home from './pages/Home/Home.tsx';
import Control from './pages/Control/Control.tsx';
import Scent from './pages/Scent/Scent.tsx';
import My from './pages/My/My.tsx';
import './styles/global.css';


const setScreenSize = () => {
  // 실제 뷰포트 높이를 기준으로 CSS 변수 설정
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
};
function App() {
  useEffect(() => {
    setScreenSize(); // 초기 로드 시 실행
    window.addEventListener('resize', setScreenSize); // 창 크기 변경 시 업데이트

    return () => {
      window.removeEventListener('resize', setScreenSize); // 컴포넌트 언마운트 시 제거
    };
  }, []);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/control" element={<Control />} />
          <Route path="/scent" element={<Scent />} />
          <Route path="/my" element={<My />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;