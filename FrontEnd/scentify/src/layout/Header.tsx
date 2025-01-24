import React from "react";
import Logo from "../assets/icons/scentify-green-logo.svg?react";
import FinishButton from "../components/Button/Button";
import BackBtn from "../assets/icons/back-arrow-btn.svg?react";
import AddBtn from "../assets/icons/add-btn.svg?react";

interface HeaderProps {
  showBack: boolean;
  showFinish: boolean;
  showDeviceManage: boolean;
  showAdd: boolean;
}

const Header = ({
  showBack,
  showFinish,
  showDeviceManage,
  showAdd,
}: HeaderProps) => {
  return (
    <header className="header flex w-full flex-row items-center justify-between px-5">
      {showBack ? (
        <button onClick={() => window.history.back()}>
          <BackBtn />
        </button>
      ) : (
        <div className="h-[30px] w-[65px]" />
      )}
      <div className="absolute left-1/2 -translate-x-1/2 transform">
        <Logo />
      </div>
      {showFinish ? (
        <FinishButton />
      ) : showDeviceManage ? (
        <button className="font-pre-light text-14 tracking-[-1px] text-black">
          기기 관리/추가
        </button>
      ) : showAdd ? (
        <button>
          <AddBtn />
        </button>
      ) : (
        <div className="h-[30px] w-[65px]" />
      )}
    </header>
  );
};

export default Header;
