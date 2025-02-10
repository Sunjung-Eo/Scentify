import React from 'react';

const NoDeviceInfo: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <p className="text-brand font-pre-medium text-14 mb-3">
        현재 등록된 기기가 없습니다.
      </p>
      <div className="p-5 rounded-xl text-gray font-pre-light text-12 leading-6 bg-white">
        <p>기기를 등록하려면</p>
        <p>
          상단 네비게이션에 있는
          <span className="text-brand font-pre-medium "> 기기관리/추가</span>를
          눌러주세요.
        </p>
      </div>
    </div>
  );
};

export default NoDeviceInfo;
