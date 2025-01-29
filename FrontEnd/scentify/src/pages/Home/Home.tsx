import React from "react";
import { Routes, Route } from "react-router-dom";
// import HomeMain from "./HomeMain.tsx"; // Home의 메인 화면
import RegistDevice1 from "../../feature/Home/device/ReigistDevice1.tsx";
import RegistDevice2 from "../../feature/Home/device/RegistDevice2.tsx";
import RegistConnecting from "../../feature/Home/device/RegistConnecting.tsx";
import ConnectSuccess from "../../feature/Home/device/ConnectSuccess.tsx";
import HomeMain from "../../feature/Home/device/HomeMain.tsx";
import RegistCapsule from "../../feature/Home/device/RegistCapsule.tsx";
import DefaultScent from "../../feature/Home/device/DefaultScent.tsx";
import DevicieSetting from "../../feature/Home/device/DeviceSetting.tsx";
import ManageDevice from "../../feature/Home/device/ManageDevice.tsx";

const Home = () => {
  return (
    <Routes>
      <Route path="/" element={<HomeMain />} />
      <Route path="/registdevice1" element={<RegistDevice1 />} />
      <Route path="/registdevice2" element={<RegistDevice2 />} />
      <Route path="/registconnecting" element={<RegistConnecting />} />
      <Route path="/connectsuccess" element={<ConnectSuccess />} />
      <Route path="/registcapsule" element={<RegistCapsule />} />
      <Route path="/defaultscent" element={<DefaultScent />} />
      <Route path="/devicesetting" element={<DevicieSetting />} />
      <Route path="/managedevice" element={<ManageDevice />} />
    </Routes>
  );
};

export default Home;
