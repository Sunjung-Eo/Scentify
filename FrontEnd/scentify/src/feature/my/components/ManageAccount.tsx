import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import arrowIcon from "../../../assets/icons/rightarrow-icon.svg";
import { useUserStore } from "../../../stores/useUserStore";
import { getProfileImage } from "../../../utils/profileImageMapper";
import { validatePassword } from "../../../apis/user/editaccount/validatepassword";
import { deleteUserAccount } from "../../../apis/user/editaccount/deleteUserAccount"; // 회원 탈퇴 API
import { useAuthStore } from "../../../stores/useAuthStore"; // 인증 상태 (accessToken)
import Modal from "../../../components/Alert/Modal";

const ManageAccount = () => {
  const navigate = useNavigate();
  const { nickname, imgNum } = useUserStore();

  console.log("현재 상태 확인:", { nickname, imgNum }); // 상태 확인

  const { accessToken } = useAuthStore(); // 토큰 가져오기

  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 창 상태
  const [inputPassword, setInputPassword] = useState(""); // 입력된 비밀번호
  const [error, setError] = useState(""); // 에러 메시지 상태

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

  // 비밀번호 확인 후 탈퇴 진행
  const handlePasswordCheck = async () => {
    if (!inputPassword.trim()) {
      setError("비밀번호를 입력해주세요.");
      return;
    }

    const passwordResult = await validatePassword(inputPassword, accessToken);

    if (!passwordResult.success) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    // 비밀번호 확인 성공 -> 회원 탈퇴 진행
    const deleteResult = await deleteUserAccount(accessToken);

    if (deleteResult.success) {
      alert("회원 탈퇴가 완료되었습니다.");
      closeModal();
      // 로그아웃 후 홈 화면으로 이동
      navigate("/");
    } else {
      setError(deleteResult.message || "회원 탈퇴에 실패했습니다.");
    }
  };

  return (
    <div className="content pt-8">
      {/* 프로필 정보 */}
      <div className="flex items-center mb-8">
        <img
          src={getProfileImage(imgNum)} // 유틸 함수에서 이미지 배열을 가져옴
          alt="ProfileImg"
          className="w-[63px] h-[63px] mr-7"
        />
        <div>
          <p className="text-16 font-pre-medium">{nickname}</p>
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
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="flex flex-col max-w-[260px] w-full h-[300px] p-6 rounded-2xl border-black/10 bg-white shadow-lg relative">
            <p className="text-center text-12 text-gray-700 mt-[60px]">
              탈퇴하시겠습니까?<br></br> 비밀번호를 입력해주세요.
            </p>
            <input
              type="password"
              value={inputPassword}
              onChange={(e) => setInputPassword(e.target.value)}
              className="w-full p-2 bg-component rounded-lg mt-4  focus:outline-none focus:ring-2 focus:ring-brand"
            />
            {/* 에러 메시지 영역의 높이를 고정 */}
            <div className="min-h-[20px] mt-2 text-center">
              {error && (
                <p className="text-red-500 font-pre-light text-10">{error}</p>
              )}
            </div>
            <div className="flex p-3 pt-[25px] justify-between gap-2">
              <button
                className="w-[60px] py-2 border-0.2 border-sub rounded-lg bg-gray-300 text-sub text-12 hover:opacity-90"
                onClick={closeModal}
              >
                취소
              </button>
              <button
                className="w-[60px] py-2 rounded-lg bg-[#2D3319] text-white text-12 hover:opacity-90"
                onClick={handlePasswordCheck}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAccount;
