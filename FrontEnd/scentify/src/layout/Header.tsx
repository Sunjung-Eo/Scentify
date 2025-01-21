import React from 'react';
import Logo from '../assets/icons/scentify-green-logo.svg?react';
import FinishButton from '../components/Button/Button';
import CancelIcon from '../assets/icons/cancel-icon.svg';

interface HeaderProps {
  isFinish: boolean;
  isCancel: boolean;
}


const Header = ({ isFinish, isCancel }: HeaderProps) => {
  return (
    <header className="header w-full flex flex-row justify-between items-center">
      { isFinish? (
        <FinishButton />
      ) : (
        <div className='w-[65px] h-[30px]'/>
      )}
      <div className="w-full flex flex-1 justify-center items-center flex-row">
        <Logo/>
      </div>
      { isCancel? (
        <CancelIcon />
      ) : (
        <div className='w-[65px] h-[30px]'/>
      )}
    </header>
  );
};

export default Header;
