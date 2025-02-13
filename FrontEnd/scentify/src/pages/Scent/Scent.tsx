import { Routes, Route } from "react-router-dom";
import ScentMain from "../../feature/scent/scentmain/ScentMain";
import ShareFavorite from "../../feature/scent/ShareFavorite";
const Scent = () => {
  return (
    <Routes>
      {/* 기본 경로에서 ScentMain 렌더링 */}
      <Route path="/" element={<ScentMain />} />

      {/* 공유 페이지 라우트 추가 */}
      <Route path="/share" element={<ShareFavorite />} />
    </Routes>
  );
};

export default Scent;
