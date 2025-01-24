import { Routes, Route } from "react-router-dom";
import Regist from "./register/Regist";

const UserRoutes = () => {
  return (
    <Routes>
      <Route path="/regist" element={<Regist />} />
      {/* <Route path="forgot-password" element={<FindPassword />} /> */}
    </Routes>
  );
};

export default UserRoutes;
