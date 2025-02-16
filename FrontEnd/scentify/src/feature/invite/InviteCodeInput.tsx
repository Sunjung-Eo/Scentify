import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { joinGroupByCode } from "../../apis/invite/joinGroupByCode";
import { useAuthStore } from "../../stores/useAuthStore";
import Alert from "../../components/Alert/Alert";

const InviteCodeInput = () => {
  const [inviteCode, setInviteCode] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [showNotice, setShowNotice] = useState(true);

  const authStore = useAuthStore();
  const accessToken = authStore.accessToken;
  const navigate = useNavigate();

  const handleJoinGroup = async () => {
    // 초대코드 유효성 검사
    if (inviteCode.length !== 8) {
      setMessage("초대코드를 다시 입력해주세요.");
      setShowNotice(false);
      return;
    }

    // API 호출로 초대코드 검증 및 그룹 가입 요청
    const result = await joinGroupByCode(inviteCode, accessToken);

    if (result.success) {
      setAlertMessage("초대코드가 인증되었습니다.");
      setTimeout(() => navigate("/home"), 2000);
    } else {
      setAlertMessage(result.message || "오류가 발생했습니다.");
    }
  };

  return (
    <div className="flex flex-col mt-4">
      {/* 제목 */}
      <h1 className="text-20 font-pre-bold mb-[80px] text-center">
        초대코드 입력하기
      </h1>
      <div className="flex justify-between w-full items-center mb-[8px]">
        {/* 초대코드 입력 필드 */}
        <input
          type="text"
          value={inviteCode}
          onChange={(e) => setInviteCode(e.target.value)}
          className="px-3 w-[235px] h-[34px] rounded-lg bg-component focus:outline-none focus:ring-2 focus:ring-brand"
        />
        {/* 등록 버튼 */}
        <button
          onClick={handleJoinGroup}
          className="w-[65px] h-[34px] text-12 font-pre-light rounded-lg border-[0.7px] border-gray active:text-component active:bg-brand active:border-0"
        >
          등록
        </button>
      </div>
      {/* 안내 메시지 또는 오류 메시지 표시 */}
      {showNotice ? (
        <p className="mt-4 text-12 font-pre-light">
          초대코드는 30분 이내로 등록해주세요.
        </p>
      ) : (
        message && (
          <p className="mt-4 text-12 font-pre-light text-red-500">{message}</p>
        )
      )}

      {/* 모달창 */}
      {alertMessage && (
        <Alert message={alertMessage} onClose={() => setAlertMessage(null)} />
      )}
    </div>
  );
};

export default InviteCodeInput;
