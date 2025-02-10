import React, { useState, FormEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  resetUserPassword,
  ResetPasswordResponse,
} from "../../../apis/user/resetPassword";
interface LocationState {
  id: string;
}

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = location.state as LocationState; // FindPassword 페이지에서 전달된 id

  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleInputChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
      setError(""); // 입력 시 에러 메시지 초기화
    };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("handleSubmit 호출됨", { id, newPassword, confirmPassword });

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

    try {
      console.log("API 호출: resetUserPassword", { id, newPassword });
      const result: ResetPasswordResponse = await resetUserPassword(
        id,
        newPassword
      );
      console.log("API 호출 결과:", result);
      if (result.success) {
        alert("비밀번호가 변경되었습니다.");
        navigate("/home");
      } else {
        setError(result.message || "비밀번호 변경에 실패했습니다.");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("handleSubmit 오류:", error.message);
        setError(error.message);
      } else {
        console.error("알 수 없는 오류 발생:", error);
        setError("알 수 없는 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div className="content pt-8 pb-8 h-full flex flex-col justify-between">
      <div>
        <h1 className="text-20 font-pre-bold text-center">비밀번호 재설정</h1>
        <div>
          <label htmlFor="new-password" className="text-12 font-pre-light mr-1">
            새 비밀번호
          </label>
          <input
            id="new-password"
            type="password"
            value={newPassword}
            onChange={handleInputChange(setNewPassword)}
            placeholder="새 비밀번호"
            className="w-[256px] h-[34px] px-3 text-12 font-pre-light rounded-lg bg-component"
          />
        </div>
        <div>
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
            placeholder="새 비밀번호 확인"
            className="w-[235px] h-[34px] px-3 text-12 font-pre-light rounded-lg bg-component"
          />
        </div>
        {error && (
          <div className="mt-6 text-center text-12 font-pre-light">
            <p className="text-red-500">{error}</p>
          </div>
        )}
      </div>
      <div className="mt-auto">
        <button
          type="submit"
          className="w-full h-[48px] mb-[32px] rounded-lg text-brand font-pre-bold border-[1px] border-brand"
        >
          비밀번호 재설정
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;
