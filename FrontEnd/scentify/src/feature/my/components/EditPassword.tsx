import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { validatePassword as verifyCurrentPassword } from "../../../apis/user/editaccount/validatepassword"; // 현재 비밀번호 검증 API
import { updateUserPassword } from "../../../apis/user/editaccount/updatepassword";
import { useAuthStore } from "../../../stores/useAuthStore";
import { validatePassword as validateNewPassword } from "../../../utils/validation";
import Alert from "../../../components/Alert/AlertMy";

function EditPassword() {
  const authStore = useAuthStore();
  const navigate = useNavigate();
  const accessToken = authStore.accessToken;

  const [currentPassword, setCurrentPassword] = useState<string>(""); // 현재 비밀번호 입력값
  const [newPassword, setNewPassword] = useState<string>(""); // 변경할 새 비밀번호 입력값
  const [confirmPassword, setConfirmPassword] = useState<string>(""); // 새 비밀번호 확인 입력값

  // 에러 상태 분리
  const [passwordError, setPasswordError] = useState<string>(""); // 새 비밀번호 에러
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>(""); // 비밀번호 확인 에러
  const [passwordCheckMessage, setPasswordCheckMessage] = useState<string>(""); // 현재 비밀번호 검증 메시지
  const [passwordVerified, setPasswordVerified] = useState<boolean>(false); // 현재 비밀번호 검증 상태

  // 모달창 상태 추가
  const [showAlert, setShowAlert] = useState<boolean>(false);

  // 입력값 변경 핸들러 (공통)
  const handleInputChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
      setPasswordCheckMessage(""); // 입력 시 기존 메시지 초기화
    };

  // 새 비밀번호 입력
  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
  };

  // 비밀번호 확인 입력
  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(e.target.value);
  };

  // 현재 비밀번호 확인 API 호출
  const handlePasswordCheck = async () => {
    if (!currentPassword.trim()) {
      setPasswordCheckMessage("기존 비밀번호를 입력해주세요.");
      setPasswordVerified(false);
      return;
    }

    const result = await verifyCurrentPassword(currentPassword, accessToken);
    if (result.success) {
      setPasswordCheckMessage("기존 비밀번호가 확인되었습니다.");
      setPasswordVerified(true);
    } else {
      setPasswordCheckMessage("기존 비밀번호와 일치하지 않습니다.");
      setPasswordVerified(false);
    }
  };

  // 저장 버튼 클릭 시 실행되는 함수 (여기만 에러 메시지 설정)
  const handleSave = async () => {
    if (!passwordVerified) {
      setPasswordCheckMessage("기존 비밀번호를 확인해주세요.");
      return;
    }

    let errorFlag = false;

    // 새 비밀번호 유효성 검사
    const passwordValidationError = validateNewPassword(newPassword);
    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      errorFlag = true;
    } else {
      setPasswordError("");
    }
    // 비밀번호 확인 검사
    if (newPassword !== confirmPassword) {
      setConfirmPasswordError(
        "새 비밀번호와 확인 비밀번호가 일치하지 않습니다."
      );
      errorFlag = true;
    } else {
      setConfirmPasswordError("");
    }
    // 에러가 있으면 진행 중지
    if (errorFlag) return;
    // 비밀번호 변경 API 호출
    const result = await updateUserPassword(newPassword, accessToken);
    if (result.success) {
      setShowAlert(true);
    } else {
      setPasswordCheckMessage(
        result.message || "비밀번호 변경에 실패했습니다."
      );
    }
  };

  return (
    <div className="pt-4 pb-5 h-full w-full flex flex-col justify-between">
      <div>
        <h1 className="text-20 font-pre-bold text-center">비밀번호 변경</h1>
        <div className="mt-10 w-full space-y-4">
          {/* 기존 비밀번호 입력 */}
          <div className="flex flex-col w-full">
            <div className="flex items-center w-full">
              <div className="flex items-center w-full">
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
                  className="flex-1 w-full h-[34px] text-12 font-pre-light rounded-lg bg-component mr-4 px-4 focus:outline-none focus:ring-2 focus:ring-brand"
                />
                <button
                  onClick={handlePasswordCheck} // 현재 비밀번호 검증 API 호출
                  className="w-[65px] h-[30px] text-12 font-pre-light border-[1px] border-lightgray rounded-lg"
                >
                  확인
                </button>
              </div>
            </div>
            {passwordCheckMessage && (
              <p
                className={`text-12 font-pre-light mt-2 ${
                  passwordVerified ? "text-brand" : "text-red-500"
                }`}
              >
                {passwordCheckMessage}
              </p>
            )}
          </div>

          {/* 새 비밀번호 입력 */}
          <div className="flex flex-col w-full">
            <div className="flex items-center w-full">
              <label
                className="text-12 font-pre-light mr-2"
                htmlFor="new-password"
              >
                새 비밀번호
              </label>
              <input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={handleNewPasswordChange} // 유효성 검사 적용
                className="flex-1 w-full h-[34px] text-12 font-pre-light rounded-lg bg-component px-4 focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>
            {passwordError && (
              <p className="text-12 font-pre-light mt-2 text-red-500">
                {passwordError}
              </p>
            )}
          </div>

          {/* 새 비밀번호 확인 입력 */}
          <div className="flex flex-col w-full">
            <div className="flex items-center w-full">
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
                onChange={handleConfirmPasswordChange}
                className="flex-1 w-fulls h-[34px] text-12 font-pre-light rounded-lg bg-component px-4 focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>
            {confirmPasswordError && (
              <p className="text-12 font-pre-light mt-2 text-red-500">
                {confirmPasswordError}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 저장 버튼 */}
      <div className="mt-auto">
        <button
          onClick={handleSave} // 저장 버튼 클릭 시 API 호출
          className="w-full h-[48px] rounded-lg text-brand text-16 font-pre-medium border-[1px] border-brand active:text-bg active:bg-brand active:border-0"
        >
          저장
        </button>
      </div>
      {/* 비밀번호 변경 성공 모달창 */}
      {showAlert && (
        <Alert
          message="비밀번호가 변경되었습니다."
          onClose={() => {
            setShowAlert(false);
            navigate("/my/manageaccount");
          }}
        />
      )}
    </div>
  );
}

export default EditPassword;
