import { Routes, Route } from "react-router-dom";
import FindPassword from "./login/FindPassword";

const UserRoutes = () => {
  return (
    <Routes>
      {/* <Route path="/regist" element={<Regist />} /> */}
      <Route path="forgot-password" element={<FindPassword />} />
    </Routes>
  );
};

export default UserRoutes;
