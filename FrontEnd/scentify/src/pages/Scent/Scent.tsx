import { Routes, Route } from "react-router-dom";
import ScentMain from "../../feature/scent/scentmain/ScentMain";

const Scent = () => {
  return (
    <div className="flex h-full items-center justify-center">
      <Routes>
        <Route path="/scentmain" element={<ScentMain />} />
      </Routes>
    </div>
  );
};

export default Scent;
