import React, { useState, FormEvent } from "react";
import {
  handleGetEmailCode,
  handleEmailVerification,
} from "../../user/register/handler/registFormHandler";
import { useNavigate } from "react-router-dom";

interface FormData {
  email: string;
  verificationCode: string;
}

///백엔드에 이메일 코드 인증하는 API만들어달라고 요청하기.

const FindPassword = () => {
  // 폼 입력값을 관리하는 상태: 이메일과 인증번호
  const [formData, setFormData] = useState<FormData>({
    email: "",
    verificationCode: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  // 이메일 인증이 성공여부 상태
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const navigate = useNavigate();

  // 입력 변경 핸들러
  // 이벤트 대상의 name과 value를 추출하여 formData 상태를 업데이트
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 폼 제출 핸들러
  //모든 유효성 검사를 통과하고 이메일 인증이 완료된 경우, 비밀번호 재설정 페이지로 이동
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({}); // 에러 초기화

    let newErrors: { [key: string]: string } = {};

    // 이메일과 인증번호 입력값 유효성 검사 적용
    if (!formData.email.trim()) {
      newErrors.email = "이메일을 입력해주세요.";
    }
    if (!formData.verificationCode.trim()) {
      newErrors.verificationCode = "인증 번호를 입력해주세요.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // 이메일 인증이 완료되지 않은 경우 에러 메시지 표시 후 중단
    if (!isVerified) {
      setErrors((prev) => ({
        ...prev,
        verificationCode: "이메일 인증을 먼저 완료해주세요.",
      }));
      return;
    }
    // 인증이 완료되었으면 비밀번호 재설정 페이지로 이동합니다.
    navigate("/reset-password");
  };

  const inputStyles =
    "border h-9 flex-1 rounded-lg bg-component px-4 focus:outline-none focus:ring-2 focus:ring-brand";

  const miniBtnStyles =
    "h-9 px-4 rounded-lg border-0.5 focus:outline-none focus:ring-2 focus:ring-brand";

  return (
    <form
      id="registForm"
      onSubmit={handleSubmit}
      noValidate
      className="flex w-full max-w-[360px] flex-col gap-3 font-pre-light text-12 px-4 mt-[16px]"
    >
      <h1 className="text-20 font-pre-bold text-center mb-8">비밀번호 찾기</h1>
      {/* 이메일 인증번호 요청 */}
      <div className="flex items-center gap-2">
        <label htmlFor="email">이메일</label>
        <input
          id="email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="이메일"
          className="border h-9 flex-1 rounded-lg bg-component px-4 focus:outline-none focus:ring-2 focus:ring-brand"
        />
        <button
          type="button"
          className={miniBtnStyles}
          onClick={() => handleGetEmailCode(formData.email, setErrors)}
        >
          인증하기
        </button>
      </div>
      {errors.email && (
        <p className="text-[12px] text-red-500">{errors.email}</p>
      )}

      {/* 인증번호 검증하기 */}
      <div className="flex items-center gap-2">
        <label htmlFor="verificationCode">인증 번호</label>
        <input
          id="verificationCode"
          type="text"
          name="verificationCode"
          value={formData.verificationCode}
          onChange={handleChange}
          placeholder="인증번호"
          className={inputStyles}
        />
        <button
          type="button"
          className={miniBtnStyles}
          onClick={() =>
            handleEmailVerification(formData.verificationCode, setErrors)
          }
        >
          확인
        </button>
      </div>
      {errors.verificationCode && (
        <p className="text-[12px] text-red-500">{errors.verificationCode}</p>
      )}
      {/* 비밀번호 재설정 버튼 영역 */}
      <div className="mt-auto">
        <button
          //  onClick={handleSave} // 저장 버튼 클릭 시 API 호출
          className="w-full h-[48px] mb-[32px] rounded-lg text-brand font-pre-bold border-[1px] border-brand"
        >
          비밀번호 재설정
        </button>
      </div>
    </form>
  );
};

export default FindPassword;
