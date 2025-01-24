import React from "react";
import Logo from "../assets/icons/scentify-green-logo.svg?react";
import FinishButton from "../components/Button/Button";
import CancelBtn from "../assets/icons/cancel-btn.svg";
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
    <header className="header w-full flex flex-row justify-between items-center px-5">
      {showBack ? (
        <button onClick={() => window.history.back()}>
          <BackBtn />
        </button>
      ) : (
        <div className="w-[65px] h-[30px]" />
      )}
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <Logo />
      </div>
      {showFinish ? (
        <FinishButton />
      ) : showDeviceManage ? (
        <button className="text-14 text-black font-pre-light tracking-[-1px]">
          기기 관리/추가
        </button>
      ) : showAdd ? (
        <button>
          <AddBtn />
        </button>
      ) : (
        <div className="w-[65px] h-[30px]" />
      )}
    </header>
  );
};

export default Header;
