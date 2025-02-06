import React from "react";

const InviteCodeInput = () => {
  return (
    <div className="flex flex-col">
      <h1 className="text-20 font-pre-bold mb-[80px] text-center">
        초대코드 입력하기
      </h1>
      <div className="flex items-center mb-[8px]">
        <input
          type="text"
          className="px-2 w-[235px] h-[34px] rounded-lg bg-component focus:outline-none focus:ring-2 focus:ring-brand"
        />
        <button className="ml-4 w-[65px] h-[30px] border-[1px] border-lightgray rounded-lg">
          등록
        </button>
      </div>
      <p className="mt-4 text-12 font-pre-light">
        초대코드는 24시간 이내로 등록해주세요.
      </p>
    </div>
  );
};

export default InviteCodeInput;
