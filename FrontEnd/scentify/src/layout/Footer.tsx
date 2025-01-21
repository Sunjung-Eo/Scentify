import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import HomeIcon from '../assets/icons/home-icon.svg?react';
import ControlIcon from '../assets/icons/control-icon.svg?react';
import ScentIcon from '../assets/icons/home-icon.svg?react';
import MyIcon from '../assets/icons/my-icon.svg?react';
import '../styles/footer.css';

const Footer = () => {
  const location = useLocation();

  const tabs = [
    { id: 'home', icon: HomeIcon, path: '/' },
    { id: 'control', icon: ControlIcon, path: '/control' },
    { id: 'scent', icon: ScentIcon, path: '/scent' },
    { id: 'my', icon: MyIcon, path: '/my' },
  ];

  return (
    <nav className="footer">
      {tabs.map((tab) => {
        const IconComponent = tab.icon;
        return (
        <Link
          key={tab.id}
          to={tab.path}
          className='flex-1 py-3'
        >
          <IconComponent 
          className={`w-11 h-10 mx-auto fill-[#5E5E5E] ${
            location.pathname === tab.path ? 'fill-[#EE9D7F]' : 'fill-[#5E5E5E]'
          }`} />
        </Link>
        )
})}
    </nav>
  );
};

export default Footer;
