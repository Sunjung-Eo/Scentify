import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Footer = () => {
  const location = useLocation();

  const tabs = [
    { id: 'home', label: 'Home', path: '/' },
    { id: 'control', label: 'Control', path: '/control' },
    { id: 'scent', label: 'Scent', path: '/scent' },
    { id: 'my', label: 'My', path: '/my' },
  ];

  return (
    <nav className="footer">
      {tabs.map((tab) => (
        <Link
          key={tab.id}
          to={tab.path}
          className={`text-sm flex-1 text-center py-3 ${
            location.pathname === tab.path ? 'text-blue-500 font-bold' : 'text-gray-500'
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
};

export default Footer;
