import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { joinGroupByCode } from "../../apis/invite/joinGroupByCode";
import { useAuthStore } from "../../stores/useAuthStore";

const InviteCodeInput = () => {
  const [inviteCode, setInviteCode] = useState("");
  // 오류 메시지를 관리하는 상태
  const [message, setMessage] = useState<string | null>(null);
  // 모달 창 표시 여부를 관리하는 상태
  const [showModal, setShowModal] = useState(false);
  // 모달에 표시할 메시지
  const [modalMessage, setModalMessage] = useState("");
  // '초대코드는 24시간 이내로 등록해주세요.' 메시지 표시 여부
  const [showNotice, setShowNotice] = useState(true);

  const authStore = useAuthStore();
  const accessToken = authStore.accessToken;
  const navigate = useNavigate();
  // console.log("초대코드:", inviteCode);
  // console.log("인증 토큰:", accessToken);
  const handleJoinGroup = async () => {
    // 초대코드 유효성 검사
    if (inviteCode.length !== 8) {
      // console.log("유효성 검사 실패: 초대코드의 길이가 8자리가 아님");
      setMessage("초대코드를 다시 입력해주세요.");
      setShowNotice(false); // 안내 메시지 숨기기
      return;
    }
    // API 호출로 초대코드 검증 및 그룹 가입 요청
    const result = await joinGroupByCode(inviteCode, accessToken);

    if (result.success) {
      // 성공 시 모달 메시지 설정 및 표시
      setModalMessage("초대코드가 인증되었습니다.");
      setShowModal(true);
      setMessage(null); // 성공 시 오류 메시지 초기화
      setShowNotice(false); // 성공 후 안내 메시지 숨김
      setTimeout(() => navigate("/home"), 2000); // 2초후 이동
    } else {
      // 실패 시 모달에 오류 메시지 표시
      setModalMessage(result.message || "알 수 없는 오류가 발생했습니다.");
      setShowModal(true);
    }
  };

  // 모달 닫기 함수
  const closeModal = () => {
    setShowModal(false);
    setModalMessage("");
  };

  return (
    <div className="flex flex-col">
      {/* 제목 */}
      <h1 className="text-20 font-pre-bold mb-[80px] text-center">
        초대코드 입력하기
      </h1>
      <div className="flex items-center mb-[8px]">
        {/* 초대코드 입력 필드 */}
        <input
          type="text"
          value={inviteCode}
          onChange={(e) => setInviteCode(e.target.value)}
          className="px-2 w-[235px] h-[34px] rounded-lg bg-component focus:outline-none focus:ring-2 focus:ring-brand"
        />
        {/* 등록 버튼 */}
        <button
          onClick={handleJoinGroup}
          className="ml-4 w-[65px] h-[30px] border-[1px] border-lightgray rounded-lg"
        >
          등록
        </button>
      </div>
      {/* 안내 메시지 또는 오류 메시지 표시 */}
      {showNotice ? (
        <p className="mt-4 text-12 font-pre-light">
          초대코드는 24시간 이내로 등록해주세요.
        </p>
      ) : (
        message && (
          <p className="mt-4 text-12 font-pre-light text-red-500">{message}</p>
        )
      )}

      {/* 모달창 */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="w-[260px] h-[120px] bg-white rounded-2xl border-[1px] border-lightgray flex flex-col items-center justify-center">
            {/* 모달 메시지 */}
            <p className="text-12 font-pre-regular mb-4">{modalMessage}</p>
            {/* 모달 닫기 버튼 */}
            <button
              onClick={closeModal}
              className="w-[60px] h-[30px] bg-sub font-pre-light text-12 text-white rounded-lg focus:outline-none"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InviteCodeInput;
