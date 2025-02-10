import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import HomeIcon from '../assets/icons/home-icon.svg?react';
import ControlIcon from '../assets/icons/control-icon.svg?react';
import ScentIcon from '../assets/icons/scent-icon.svg?react';
import MyIcon from '../assets/icons/my-icon.svg?react';
import '../styles/footer.css';

const Footer = () => {
  const location = useLocation();

  // 특정 경로에서 Footer 숨김
  const hideFooterPaths =
    /^\/(?:user\/regist(?:\/.*)?|home\/(?:registdevice2|connectsuccess|registcapsule|defaultscent))$/;

  const tabs = [
    { id: 'home', icon: HomeIcon, path: '/home' },
    { id: 'control', icon: ControlIcon, path: '/control' },
    { id: 'scent', icon: ScentIcon, path: '/scent' },
    { id: 'my', icon: MyIcon, path: '/my' },
  ];

  if (hideFooterPaths.test(location.pathname)) {
    return null;
  }

  return (
    <nav className="footer">
      {tabs.map((tab) => {
        const IconComponent = tab.icon;
        return (
          <Link key={tab.id} to={tab.path} className="flex-1 py-3">
            <IconComponent
              className={`mx-auto h-10 w-11 ${
                location.pathname.includes(tab.path)
                  ? 'text-[#EE9D7F]'
                  : 'text-[#5E5E5E]'
              }`}
            />
          </Link>
        );
      })}
    </nav>
  );
};

export default Footer;
