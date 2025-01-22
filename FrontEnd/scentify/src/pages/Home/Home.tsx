import React from "react";
import { Routes, Route } from "react-router-dom";
// import HomeMain from "./HomeMain.tsx"; // Home의 메인 화면
import RegistDevice1 from "./ReigistDevice1.tsx";
import RegistDevice2 from "./RegistDevice2.tsx";
import RegistConnecting from "./RegistConnecting.tsx";
import ConnectSuccess from "./ConnectSuccess.tsx";

const Home = () => {
  return (
    <Routes>
      {/* <Route path="/" element={<HomeMain />} /> */}
      <Route path="/registdevice1" element={<RegistDevice1 />} />
      <Route path="/registdevice2" element={<RegistDevice2 />} />
      <Route path="/registconnecting" element={<RegistConnecting />} />
      <Route path="/connectsuccess" element={<ConnectSuccess />} />
    </Routes>
  );
};

export default Home;
