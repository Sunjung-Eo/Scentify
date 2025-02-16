import React, { useState, FormEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  resetUserPassword,
  ResetPasswordResponse,
} from "../../../apis/user/resetPassword";
import { validatePassword } from "../../../utils/validation";
import Alert from "../../../components/Alert/AlertMy";

// 이전 페이지(FindPassword)전달한 state 타입 정의
interface LocationState {
  id: string;
}

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation(); // 전달된 데이터를 받기 위한 useLocation
  const { id } = location.state as LocationState;

  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [showAlert, setShowAlert] = useState<boolean>(false);

  // 입력값 변경 핸들러
  const handleInputChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
      setError("");
    };

  // 폼 제출 핸들러
  // 유효성 검사 수행, 모든 조건 충족시 resetUserPassword API를 호출하여 비밀번호를 재설정
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 유효성 검사
    const passwordValidationMessage = validatePassword(newPassword);
    if (passwordValidationMessage) {
      setError(passwordValidationMessage);
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("새 비밀번호와 확인 비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      // resetUserPassword 함수를 호출하여 비밀번호 재설정
      const result: ResetPasswordResponse = await resetUserPassword(
        id,
        newPassword
      );
      console.log("API 호출 결과:", result);
      if (result.success) {
        setShowAlert(true);
      } else {
        setError(result.message || "비밀번호 변경에 실패했습니다.");
      }
    } catch (error: unknown) {
      // 에러 발생 시, Error객체인지 확인 후 메시지를 출력하고 상태에 설정
      setError(
        error instanceof Error
          ? error.message
          : "알 수 없는 오류가 발생했습니다."
      );
    }
  };

  return (
    <>
      <form
        id="resetPasswordForm"
        onSubmit={handleSubmit}
        noValidate
        className="flex w-full max-w-[360px] flex-col gap-3 font-pre-light text-12 px-4 mt-[16px]"
      >
        <div>
          <h1 className="text-20 font-pre-bold text-center mb-[52px]">
            비밀번호 재설정
          </h1>
          {/* 새 비밀번호 입력 필드 */}
          <div className="flex items-center justify-between mb-3">
            <label
              htmlFor="new-password"
              className="text-12 font-pre-light mr-1"
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
          {/* 새 비밀번호 확인 입력 필드 */}
          <div className="flex items-center justify-between">
            <label
              htmlFor="confirm-password"
              className="text-12 font-pre-light mr-1"
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
          {error && (
            <p className="mt-3 text-red-500 text-12 font-pre-light">{error}</p>
          )}
        </div>
        <div className="mt-auto">
          <button
            type="submit"
            className="w-full h-[48px] mb-[20px] rounded-lg text-brand text-16 font-pre-medium border-[1px] border-brand active:text-component active:bg-brand active:border-0"
          >
            저장
          </button>
        </div>
      </form>
      {/* 비밀번호 변경 성공 모달창 */}
      {showAlert && (
        <Alert
          message="비밀번호가 변경되었습니다."
          onClose={() => {
            setShowAlert(false);
            navigate("/home");
          }}
        />
      )}
    </>
  );
};

export default ResetPassword;
