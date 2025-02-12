import React from 'react';
import { Routes, Route } from 'react-router-dom';
import RegistDevice1 from '../../feature/Home/deviceregistration/ReigistDevice1.tsx';
import RegistDevice2 from '../../feature/Home/deviceregistration/RegistDevice2.tsx';
import RegistConnecting from '../../feature/Home/deviceregistration/RegistConnecting.tsx';
import ConnectSuccess from '../../feature/Home/deviceregistration/ConnectSuccess.tsx';
import HomeMain from './HomeMain.tsx';
import RegistCapsule from '../../feature/Home/capsule/RegistCapsule.tsx';
import DefaultScent from '../../feature/Home/defaultscent/DefaultScent.tsx';
import EditCapsule from '../../feature/Home/edit/EditCapsule.tsx';
import EditDefaultScent from '../../feature/Home/edit/EditDefaultScent.tsx';
import ManageDevice from '../../feature/Home/managedevice/ManageDevice.tsx';

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
      <Route path="/devicesetting/capsule" element={<EditCapsule />} />
      <Route path="/managedevice" element={<ManageDevice />} />
      <Route
        path="/devicesetting/defaultscent"
        element={<EditDefaultScent />}
      />
    </Routes>
  );
};

export default Home;
