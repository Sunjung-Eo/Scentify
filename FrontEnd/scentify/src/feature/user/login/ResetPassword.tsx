import React, { useState, FormEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  resetUserPassword,
  ResetPasswordResponse,
} from "../../../apis/user/resetPassword";

// 이전 페이지(FindPassword)전달한 state의 타입을 정의.
interface LocationState {
  id: string;
}

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation(); // 전달된 데이터를 받기 위한 useLocation 훅
  const { id } = location.state as LocationState; // location.state를 LocationState 타입으로 단언하여 id 값 추출

  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  // 입력값 변경 핸들러(입력값 변경시마다 호출돼 해당필드 상태업데이트, setter는 상태업데이트 함수)
  const handleInputChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
      setError(""); // 입력 변경 시 에러 메시지 초기화
    };

  // 폼 제출 핸들러(사용자가 "비밀번호 재설정" 버튼을 눌렀을 때 호출)
  // 유효성 검사 수행, 모든 조건 충족시 resetUserPassword API를 호출하여 비밀번호를 재설정
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 유효성 검사
    if (!newPassword.trim() || !confirmPassword.trim()) {
      setError("모든 필드를 입력해주세요.");
      return;
    }
    if (newPassword.length < 8) {
      setError("비밀번호는 최소 8자 이상이여야 합니다.");
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
        // 비밀번호 재설정 성공 시 사용자에게 알림을 띄우고 /home 페이지로 이동
        alert("비밀번호가 변경되었습니다.");
        navigate("/home");
      } else {
        // API 호출 결과가 success가 false인 경우, 에러 메시지를 상태에 설정
        setError(result.message || "비밀번호 변경에 실패했습니다.");
      }
    } catch (error: unknown) {
      // 에러 발생 시, error가 Error 객체인지 확인한 후 메시지를 출력하고 상태에 설정
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
    // <form> 요소의 onSubmit 이벤트에 handleSubmit 함수 연결
    // 이로 인해 버튼 클릭 시 폼 제출 이벤트가 발생하며, handleSubmit이 호출
    <form
      id="resetPasswordForm"
      onSubmit={handleSubmit} // 폼 제출 시 handleSubmit 함수가 실행
      noValidate
      className="flex w-full max-w-[360px] flex-col gap-3 font-pre-light text-12 px-4 mt-[16px]"
    >
      <div>
        <h1 className="text-20 font-pre-bold text-center mb-8">
          비밀번호 재설정
        </h1>
        <div className="mb-3">
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
        {/* 버튼 type을 submit으로 설정시, 클릭 시 폼의 onSubmit 이벤트가 발생 */}
        <button
          type="submit"
          className="w-full h-[48px] mb-[32px] rounded-lg text-brand font-pre-bold border-[1px] border-brand"
        >
          저장
        </button>
      </div>
    </form>
  );
};

export default ResetPassword;
