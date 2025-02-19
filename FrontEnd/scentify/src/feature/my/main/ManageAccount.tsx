import { useState } from "react";
import { useNavigate } from "react-router-dom";
import arrowIcon from "../../../assets/icons/rightarrow-icon.svg";
import { useUserStore } from "../../../stores/useUserStore";
import { getProfileImage } from "../../../utils/profileImageMapper";
import { validatePassword } from "../../../apis/user/editaccount/validatepassword";
import { deleteUserAccount } from "../../../apis/user/editaccount/deleteUserAccount";
import { useAuthStore } from "../../../stores/useAuthStore";

const ManageAccount = () => {
  const navigate = useNavigate();
  const { nickname, imgNum } = useUserStore();

  const { accessToken } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputPassword, setInputPassword] = useState("");
  const [error, setError] = useState("");

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

  // 초대코드 입력 페이지로 이동
  const handleInviteCodeInputPage = () => {
    navigate("/my/invitecodeinput");
  };

  // 탈퇴 버튼 클릭 핸들러
  const handleAccountDeletion = () => {
    setIsModalOpen(true);
  };

  // 모달 닫기 핸들러
  const closeModal = () => {
    setIsModalOpen(false);
    setInputPassword("");
    setError("");
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

    const deleteResult = await deleteUserAccount(accessToken);

    if (deleteResult.success) {
      alert("회원 탈퇴가 완료되었습니다.");
      closeModal();
      // 로그아웃 후 홈 화면 이동
      navigate("/");
    } else {
      setError(deleteResult.message || "회원 탈퇴에 실패했습니다.");
    }
  };

  return (
    <div className="flex flex-col relative h-full mt-[30px]">
      {/* 프로필 정보 */}
      <div className="flex items-center mb-8">
        <img
          src={getProfileImage(imgNum)} // 유틸 함수에서 이미지 배열을 가져옴
          alt="ProfileImg"
          className="w-[46px] h-[46px] mr-3"
        />
        <div>
          <p className="text-20 font-pre-medium">{nickname}</p>
        </div>
      </div>
      {/* 버튼 그룹 */}
      <div className="flex justify-between gap-3">
        <button
          onClick={handleProfileImageChangePage}
          className="w-[143px] h-[30px] text-12 font-pre-light rounded-lg border-[0.7px] border-gray active:text-component active:bg-brand active:border-0"
        >
          프로필 이미지 변경
        </button>
        <button
          onClick={handleNicknameChangePage}
          className="w-[143px] h-[30px] text-12 font-pre-light rounded-lg border-[0.7px] border-gray active:text-component active:bg-brand active:border-0"
        >
          닉네임 변경
        </button>
      </div>
      {/* 변경 항목 리스트 */}
      <div className="mt-3">
        {/* 회원정보 변경 박스 */}
        <div
          onClick={handleMemberInfoChange}
          className="w-full h-[70px] flex justify-between items-center border-b-0.2 border-lightgray"
        >
          <p className="text-16 font-pre-medium">회원정보 변경</p>
          <img src={arrowIcon} alt="arrowIcon" className="mr-2" />
        </div>
        {/* 비밀번호 변경 박스 */}
        <div
          onClick={handlePasswordChange}
          className="w-full h-[70px] flex justify-between items-center border-b-0.2 border-lightgray"
        >
          <p className="text-16 font-pre-medium">비밀번호 변경</p>
          <img src={arrowIcon} alt="arrowIcon" className="mr-2" />
        </div>
        {/* 초대코드 입력 박스  */}
        <div
          onClick={handleInviteCodeInputPage}
          className="w-full h-[70px] flex justify-between items-center border-b-0.2 border-lightgray"
        >
          <p className="text-16 font-pre-medium">초대코드 입력</p>
          <img src={arrowIcon} alt="arrowIcon" className="mr-2" />
        </div>
      </div>
      {/* 탈퇴하기 버튼 */}
      <div className="absolute bottom-[40px] w-full flex justify-end">
        <button
          onClick={handleAccountDeletion}
          className="w-[65px] h-[30px] text-12 font-pre-light rounded-lg border-[0.7px] border-gray active:text-bg active:bg-brand active:border-0"
        >
          탈퇴하기
        </button>
      </div>
      {/* 모달 창 */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="flex flex-col items-center justify-center max-w-[260px] w-full h-[300px] p-6 rounded-2xl border-black/10 bg-white shadow-lg relative">
            <p className="text-center text-12 font-pre-light mt-[40px]">
              탈퇴하시겠습니까?
              <br /> 비밀번호를 입력해주세요.
            </p>
            <input
              type="password"
              value={inputPassword}
              onChange={(e) => setInputPassword(e.target.value)}
              className="w-[200px] h-[34px] px-3 bg-component rounded-lg mt-4 focus:outline-none focus:ring-2 focus:ring-brand"
            />
            {/* 에러 메시지 영역의 높이를 고정 */}
            <div className="min-h-[20px] mt-2 text-center">
              {error && (
                <p className="text-red-500 font-pre-light text-10">{error}</p>
              )}
            </div>
            {/* 버튼 컨테이너 - 200px 안에서 양 끝 배치 */}
            <div className="flex w-[200px] mt-[40px] justify-between">
              <button
                className="w-[60px] h-[30px] py-2 border-0.2 border-sub rounded-lg bg-gray-300 text-sub text-12 hover:opacity-90 flex items-center justify-center"
                onClick={closeModal}
              >
                취소
              </button>

              <button
                className="w-[60px] h-[30px] py-2 rounded-lg bg-[#2D3319] text-white text-12 hover:opacity-90 flex items-center justify-center"
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
