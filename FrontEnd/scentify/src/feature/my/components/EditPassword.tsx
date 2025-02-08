import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { validatePassword } from "../../../apis/user/editaccount/validatepassword";
import { updateUserPassword } from "../../../apis/user/editaccount/updatepassword";
import { useAuthStore } from "../../../stores/useAuthStore"; // 인증 상태 (accessToken)

function EditPassword() {
  const authStore = useAuthStore();
  const navigate = useNavigate();
  const accessToken = authStore.accessToken; // 로그인된 사용자의 인증 토큰

  const [currentPassword, setCurrentPassword] = useState<string>(""); // 현재 비밀번호 입력값
  const [newPassword, setNewPassword] = useState<string>(""); // 변경할 새 비밀번호 입력값
  const [confirmPassword, setConfirmPassword] = useState<string>(""); // 새 비밀번호 확인 입력값
  const [error, setError] = useState<string>(""); // 에러 메시지 상태
  const [passwordVerified, setPasswordVerified] = useState<boolean>(false); // 현재 비밀번호 검증 상태

  /**
   * 입력값 변경 핸들러
   * @param setter - 상태 업데이트 함수
   */
  const handleInputChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
      setError(""); // 입력 시 에러 메시지 초기화
    };

  /**
   * 현재 비밀번호 확인 버튼 클릭 시 실행
   * 서버에서 현재 비밀번호 검증을 수행
   */
  const handlePasswordCheck = async () => {
    if (!currentPassword.trim()) {
      setError("현재 비밀번호를 입력해주세요.");
      setPasswordVerified(false);
      return;
    }

    const result = await validatePassword(currentPassword, accessToken);

    if (result.success) {
      setError("비밀번호가 확인되었습니다.");
      setPasswordVerified(true);
    } else {
      setError("비밀번호가 일치하지 않습니다.");
      setPasswordVerified(false);
    }
  };

  /**
   * 저장 버튼 클릭 시 실행되는 함수
   * 비밀번호 유효성 검사 후 API 호출
   */
  const handleSave = async () => {
    if (!passwordVerified) {
      setError("현재 비밀번호를 확인해주세요.");
      return;
    }

    if (!newPassword.trim() || !confirmPassword.trim()) {
      setError("모든 필드를 입력해주세요.");
      return;
    }

    if (newPassword.length < 8) {
      setError("비밀번호는 최소 8자 이상이어야 합니다.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("새 비밀번호와 확인 비밀번호가 일치하지 않습니다.");
      return;
    }

    const result = await updateUserPassword(newPassword, accessToken);

    if (result.success) {
      alert("비밀번호가 변경되었습니다.");
      navigate("/my/manageaccount");
    } else {
      setError(result.message || "비밀번호 변경에 실패했습니다.");
    }
  };

  return (
    <div className="content pt-8 pb-8 h-full flex flex-col justify-between">
      <div>
        <h1 className="text-20 font-pre-bold text-center">비밀번호 변경</h1>

        {/* 현재 비밀번호 입력 */}
        <div className="mt-10 space-y-4">
          <div className="flex items-center">
            <label
              className="text-12 font-pre-light mr-5"
              htmlFor="current-password"
            >
              비밀번호
            </label>
            <input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={handleInputChange(setCurrentPassword)}
              className="w-[170px] h-[34px] px-3 text-12 font-pre-light rounded-lg bg-component mr-4"
            />
            <button
              onClick={handlePasswordCheck} // 현재 비밀번호 검증 API 호출
              className="w-[65px] h-[30px] text-12 font-pre-light border-[1px] border-lightgray rounded-lg"
            >
              확인
            </button>
          </div>

          {/* 새 비밀번호 입력 */}
          <div>
            <label
              className="text-12 font-pre-light mr-1"
              htmlFor="new-password"
            >
              새 비밀번호
            </label>
            <input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={handleInputChange(setNewPassword)}
              className="w-[256px] h-[34px] px-3 text-12 font-pre-light rounded-lg bg-component"
            />
          </div>

          {/* 새 비밀번호 확인 입력 */}
          <div>
            <label
              className="text-12 font-pre-light mr-1"
              htmlFor="confirm-password"
            >
              새 비밀번호 확인
            </label>
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={handleInputChange(setConfirmPassword)}
              className="w-[235px] h-[34px] px-3 text-12 font-pre-light rounded-lg bg-component"
            />
          </div>
        </div>

        {/* 에러 메시지 출력 */}
        {error && (
          <div className="mt-6 text-center text-12 font-pre-light">
            <p
              className={
                error === "비밀번호가 확인되었습니다."
                  ? "text-green-500"
                  : "text-red-500"
              }
            >
              {error}
            </p>
          </div>
        )}
      </div>

      {/* 저장 버튼 */}
      <div className="mt-auto">
        <button
          onClick={handleSave} // 저장 버튼 클릭 시 API 호출
          className="w-full h-[48px] rounded-lg text-brand font-pre-bold border-[1px] border-brand"
        >
          저장
        </button>
      </div>
    </div>
  );
}

export default EditPassword;
