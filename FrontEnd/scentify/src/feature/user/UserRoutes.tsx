import { Routes, Route } from "react-router-dom";
import FindPassword from "./login/FindPassword";
import ResetPassword from "./login/ResetPassword";

const UserRoutes = () => {
  return (
    <Routes>
      {/* <Route path="/regist" element={<Regist />} /> */}
      <Route path="find-password" element={<FindPassword />} />
      <Route path="reset-password" element={<ResetPassword />} />
    </Routes>
  );
};

export default UserRoutes;
