import { Routes, Route } from "react-router-dom";
import ScentMain from "../../feature/scent/scentmain/ScentMain";
import ShareFavorite from "../../feature/scent/ShareFavorite";
const Scent = () => {
  return (
    <Routes>
      <Route path="/" element={<ScentMain />} />
      <Route path="/share" element={<ShareFavorite />} />
    </Routes>
  );
};

export default Scent;
