import React from "react";

const LinkInvite = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-bg p-6">
      <p className="text-lg font-pre-medium text-black mb-6">
        님이 멤버로 초대합니다.
      </p>
      <div className="w-48 h-48 border-2 border-dashed border-lightgray rounded-lg flex items-center justify-center mb-8">
        {/* 이미지 자리 */}
      </div>
      <button className="px-8 py-3 bg-brand text-white font-pre-medium rounded-lg hover:bg-sub transition">
        그룹 멤버로 참여하기
      </button>
    </div>
  );
};

export default LinkInvite;
