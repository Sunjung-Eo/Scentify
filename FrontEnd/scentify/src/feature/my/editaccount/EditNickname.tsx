import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateUserNickname } from "../../../apis/user/editaccount/editnickname";
import { useAuthStore } from "../../../stores/useAuthStore";
import { useUserStore } from "../../../stores/useUserStore";
import Alert from "../../../components/Alert/AlertMy";
import { validateNickname } from "../../../utils/validation";

function EditNickname() {
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const authStore = useAuthStore();
  const userStore = useUserStore();
  const accessToken = authStore.accessToken;
  const [showAlert, setShowAlert] = useState<boolean>(false);

  // 닉네임 입력 변경 핸들러
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newNickname = e.target.value;
    setNickname(newNickname);

    // 닉네임 유효성 검사 실행
    const validationMessage = validateNickname(newNickname);
    if (validationMessage) {
      setError(validationMessage);
    } else {
      setError("");
    }
  }
  // 저장 버튼 클릭 핸들러 (API 호출)
  async function handleSave() {
    const validationMessage = validateNickname(nickname);
    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    const result = await updateUserNickname(nickname, accessToken);

    if (result.success) {
      userStore.setUser({ nickname }); // 유저 상태 업데이트
      setShowAlert(true);
    } else {
      setError(result.message || "닉네임 변경에 실패했습니다.");
    }
  }

  return (
    <div className="pt-4 pb-5 h-full flex flex-col justify-between w-full">
      <div>
        {/* 제목 */}
        <h1 className="text-20 font-pre-bold text-center">닉네임 변경</h1>
        {/* 입력 필드 */}
        <div className="mt-10 w-full">
          <div className="flex justify-between items-center gap-x-6 w-full">
            <label
              className="text-12 font-pre-light whitespace-nowrap"
              htmlFor="nickname"
            >
              닉네임
            </label>
            <input
              id="nickname"
              type="text"
              value={nickname}
              onChange={handleInputChange}
              placeholder="10자 이하, 완성된 한글, 영문, 숫자만 입력"
              className="w-full h-[34px] text-12 font-pre-light rounded-lg bg-component px-3 focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
          {/* 에러 메시지 */}
          {error && (
            <p className="text-red-500 text-12 font-pre-light mt-2">{error}</p>
          )}
        </div>
      </div>

      {/* 저장 버튼 */}
      <div>
        <button
          onClick={handleSave}
          className="w-full h-[48px] rounded-lg text-brand text-16 font-pre-medium border-[1px] border-brand active:text-bg active:bg-brand active:border-0"
        >
          저장
        </button>
      </div>

      {/* 닉네임 변경 성공 모달창 */}
      {showAlert && (
        <Alert
          message="닉네임이 변경되었습니다."
          onClose={() => {
            setShowAlert(false);
            navigate("/my/manageaccount");
          }}
        />
      )}
    </div>
  );
}

export default EditNickname;
