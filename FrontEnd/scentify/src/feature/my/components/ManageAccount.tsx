import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import userprofileImg from "../../../assets/userProfiles/green.svg";
import arrowIcon from "../../../assets/icons/rightarrow-icon.svg";

const ManageAccount = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 창 상태
  const [inputPassword, setInputPassword] = useState(""); // 입력된 비밀번호
  const [error, setError] = useState(""); // 에러 메시지 상태
  const currentPassword = "123456"; // 기존 비밀번호 (예제)

  // 닉네임 변경 페이지로 이동
  const handleNicknameChangePage = () => {
    navigate("/my/editnickname");
  };

  // 프로필 이미지 변경 페이지로 이동
  const handleProfileImageChangePage = () => {
    navigate("/my/editprofileimg");
  };

  // 회원 정보 변경 페이지로 이동
  const handleMemberInfoChange = () => {
    navigate("/my/edituserinfo");
  };

  // 비밀번호 변경 페이지로 이동
  const handlePasswordChange = () => {
    navigate("/my/editpassword");
  };

  // 탈퇴 버튼 클릭 핸들러
  const handleAccountDeletion = () => {
    setIsModalOpen(true); // 모달 열기
  };

  // 모달 닫기 핸들러
  const closeModal = () => {
    setIsModalOpen(false);
    setInputPassword(""); // 입력값 초기화
    setError(""); // 에러 메시지 초기화
  };

  // 비밀번호 확인 핸들러
  const handlePasswordCheck = () => {
    if (inputPassword === currentPassword) {
      alert("회원 탈퇴가 완료되었습니다.");
      closeModal();
    } else {
      setError("비밀번호가 일치하지 않습니다.");
    }
  };

  return (
    <div className="content pt-8">
      {/* 프로필 정보 */}
      <div className="flex items-center mb-8">
        <img
          src={userprofileImg}
          alt="ProfileImg"
          className="w-[63px] h-[63px] mr-7"
        />
        <div>
          <p className="text-16 font-pre-medium">홍길동</p>
          <p className="text-12 text-gray font-pre-light">ID: jdlkdjaldj</p>
        </div>
      </div>

      {/* 버튼 그룹 */}
      <div className="flex justify-between gap-3 mb-8">
        <button
          onClick={handleProfileImageChangePage}
          className="w-[143px] h-[30px] text-12 font-pre-regular rounded-lg border-[1px] border-lightgray"
        >
          프로필 이미지 변경
        </button>
        <button
          onClick={handleNicknameChangePage}
          className="w-[143px] h-[30px] text-12 font-pre-regular rounded-lg border-[1px] border-lightgray"
        >
          닉네임 변경
        </button>
      </div>

      {/* 변경 항목 리스트 */}
      <div>
        {/* 구분선 */}
        <div className="border-t-[1px] border-b-[1px] border-lightgray">
          <div
            onClick={handleMemberInfoChange}
            className="flex justify-between items-center py-6"
          >
            <p className="text-sm">회원정보 변경</p>
            <img src={arrowIcon} alt="arrowIcon" />
          </div>
        </div>

        {/* 구분선 */}
        <div className="border-b-[1px] border-lightgray">
          <div
            onClick={handlePasswordChange}
            className="flex justify-between items-center py-6"
          >
            <p className="text-sm">비밀번호 변경</p>
            <img src={arrowIcon} alt="arrowIcon" />
          </div>
        </div>
      </div>

      {/* 탈퇴하기 버튼 */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={handleAccountDeletion}
          className="w-[65px] h-[25px] text-12 font-pre-regular border-[1px] border-lightgray rounded-lg"
        >
          탈퇴하기
        </button>
      </div>

      {/* 모달 창 */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-component w-[250px] h-[220px] p-4 rounded-lg flex flex-col items-center justify-between relative">
            {/* 닫기 버튼 */}
            <button onClick={closeModal} className="absolute top-3 right-4">
              ✕
            </button>
            {/* 제목 */}
            <div className="mt-12">
              <h2 className="text-12 font-pre-medium text-center">
                비밀번호를 입력해주세요
              </h2>
            </div>
            {/* 비밀번호 입력창 */}
            <div className="mt-0">
              <input
                type="password"
                value={inputPassword}
                onChange={(e) => setInputPassword(e.target.value)}
                className="w-[200px] h-[40px] text-12 px-3 font-pre-light rounded-lg bg-white border border-lightgray"
              />
            </div>
            {/* 에러 메시지 */}
            {error && (
              <p className="text-red-500 text-12 font-pre-light text-center">
                {error}
              </p>
            )}
            {/* 확인 버튼 */}
            <button
              onClick={handlePasswordCheck}
              className="w-[100px] h-[35px] text-12 font-pre-light rounded-lg border-[1px] border-lightgray bg-white"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAccount;
