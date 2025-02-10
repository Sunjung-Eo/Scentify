import React, { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { sendEmailCodeForPassword } from "../../../apis/user/sendEmailCodeForPassword";
import { verifyEmailCodeForPassword } from "../../../apis/user/verifyEmailCodeForPassword";

// FormData 인터페이스: 사용자가 입력할 데이터 구조를 정의합니다.
interface FormData {
  id: string; // 사용자 아이디
  email: string; // 사용자 이메일
  verificationCode: string; // 이메일로 전송된 인증 코드
}

const FindPassword = () => {
  // formData: 아이디, 이메일, 인증 코드를 저장합니다.
  const [formData, setFormData] = useState<FormData>({
    id: "",
    email: "",
    verificationCode: "",
  });

  // 각 필드별 에러 메시지를 별도로 관리합니다.
  const [idError, setIdError] = useState<string>(""); // 아이디 입력 관련 에러
  const [emailError, setEmailError] = useState<string>(""); // 이메일 입력 관련 에러
  const [verificationCodeError, setVerificationCodeError] =
    useState<string>(""); // 인증 코드 관련 에러

  // 인증 상태 플래그들:
  const [isVerified, setIsVerified] = useState<boolean>(false); // 이메일 인증(코드 전송) 성공 여부
  const [isCodeVerified, setIsCodeVerified] = useState<boolean>(false); // 인증 코드 확인 성공 여부

  // 페이지 이동을 위한 useNavigate 훅
  const navigate = useNavigate();

  // 입력 필드 변경 시 formData 상태를 업데이트하는 핸들러 함수입니다.
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target; // 이벤트 대상의 name과 value를 추출
    setFormData((prev) => ({ ...prev, [name]: value })); // 해당 필드 업데이트
  };

  // 이메일 인증 코드 전송 함수
  const handleSendEmailCode = async () => {
    // 필수 입력값(아이디, 이메일)이 비어 있으면 에러 메시지를 설정합니다.
    if (!formData.id || !formData.email) {
      if (!formData.id) {
        setIdError("아이디를 입력해주세요.");
      }
      if (!formData.email) {
        setEmailError("이메일을 입력해주세요.");
      }
      return; // 유효성 검사가 실패하면 함수 종료
    }

    try {
      // API 호출: sendEmailCodeForPassword 함수를 호출하여 이메일로 인증 코드를 전송합니다.
      await sendEmailCodeForPassword(formData.id, formData.email);
      alert("인증 코드가 전송되었습니다."); // 전송 성공 시 사용자에게 알림
      // 성공 후, 관련 에러 메시지를 초기화합니다.
      setIdError("");
      setEmailError("");
      // 전송 성공 시 isVerified를 true로 변경 (API 설계에 따라 다를 수 있음)
      setIsVerified(true);
    } catch (error: unknown) {
      // 에러 처리: error가 Error 객체이면 그 메시지를 사용하고, 아니면 일반 메시지 표시
      if (error instanceof Error) {
        setEmailError(error.message);
      } else {
        setEmailError("알 수 없는 오류가 발생했습니다.");
      }
    }
  };

  // 인증 코드 확인 함수 (수정됨)
  const handleVerifyCode = async () => {
    // 인증 코드 입력값이 비어 있으면 에러 메시지 설정
    if (!formData.verificationCode.trim()) {
      setVerificationCodeError("인증번호를 입력해주세요.");
      return;
    }

    try {
      // API 호출: verifyEmailCodeForPassword 함수를 호출하여 인증 코드의 유효성을 확인합니다.
      await verifyEmailCodeForPassword(formData.verificationCode);
      // 인증 코드 확인 성공 시 플래그 업데이트
      setIsCodeVerified(true);
      // 에러 메시지 초기화
      setVerificationCodeError("");
      // 인증이 성공했다면 성공 메시지를 사용자에게 표시합니다.
      alert("인증이 완료되었습니다.");
    } catch (error: unknown) {
      // 에러 처리: error가 Error 객체이면 그 메시지를 사용하고, 아니면 일반 메시지 표시
      if (error instanceof Error) {
        setVerificationCodeError(error.message);
      } else {
        setVerificationCodeError("알 수 없는 오류가 발생했습니다.");
      }
    }
  };

  // 폼 제출 핸들러: 모든 필드의 유효성을 확인하고, 인증이 완료된 경우 비밀번호 재설정 페이지로 이동합니다.
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // 기본 폼 제출 동작을 막습니다.

    // 제출 전 에러 메시지를 모두 초기화합니다.
    setIdError("");
    setEmailError("");
    setVerificationCodeError("");

    let newErrors: { [key: string]: string } = {};

    // 각 필드의 유효성을 검사합니다.
    if (!formData.id.trim()) {
      newErrors.id = "아이디를 입력해주세요.";
    }
    if (!formData.email.trim()) {
      newErrors.email = "이메일을 입력해주세요.";
    }
    if (!formData.verificationCode.trim()) {
      newErrors.verificationCode = "인증 번호를 입력해주세요.";
    }

    // 유효성 검사에서 에러가 있으면 해당 필드에 에러 메시지를 설정하고 함수 실행을 중단합니다.
    if (Object.keys(newErrors).length > 0) {
      setIdError(newErrors.id || "");
      setEmailError(newErrors.email || "");
      setVerificationCodeError(newErrors.verificationCode || "");
      return;
    }

    // 이메일 인증(코드 전송)과 인증 코드 확인이 모두 완료되어야만 다음 페이지로 이동합니다.
    if (!isVerified) {
      setVerificationCodeError("이메일 인증을 먼저 완료해주세요.");
      return;
    }
    if (!isCodeVerified) {
      setVerificationCodeError("인증번호를 먼저 확인해주세요.");
      return;
    }

    // 모든 조건이 충족되면 비밀번호 재설정 페이지로 이동하고, 아이디정보도 전달합니다.
    navigate("/user/reset-password", {
      state: {
        id: formData.id,
      },
    });
  };

  // 공통 스타일: 입력 필드와 버튼에 적용될 CSS 클래스 문자열입니다.
  const inputStyles =
    "border h-9 flex-1 rounded-lg bg-component px-4 focus:outline-none focus:ring-2 focus:ring-brand";
  const miniBtnStyles =
    "h-9 px-4 rounded-lg border-0.5 focus:outline-none focus:ring-2 focus:ring-brand";

  return (
    <form
      id="registForm"
      onSubmit={handleSubmit} // 폼 제출 시 handleSubmit 함수가 실행됩니다.
      noValidate
      className="flex w-full max-w-[360px] flex-col gap-3 font-pre-light text-12 px-4 mt-[16px]"
    >
      <h1 className="text-20 font-pre-bold text-center mb-8">비밀번호 찾기</h1>
      {/* 아이디 입력 필드 */}
      <div className="flex items-center gap-2">
        <label htmlFor="id">아이디</label>
        <input
          id="id"
          type="text"
          name="id"
          value={formData.id}
          onChange={handleChange} // 사용자가 입력을 변경하면 handleChange 함수가 호출됩니다.
          placeholder="아이디"
          className={inputStyles}
        />
      </div>
      {idError && <p className="text-[12px] text-red-500">{idError}</p>}{" "}
      {/* 아이디 관련 오류 메시지 */}
      {/* 이메일 입력 필드 */}
      <div className="flex items-center gap-2">
        <label htmlFor="email">이메일</label>
        <input
          id="email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange} // 이메일 값이 업데이트됩니다.
          placeholder="이메일"
          className={inputStyles}
        />
        <button
          type="button"
          className={miniBtnStyles}
          onClick={handleSendEmailCode} // "인증하기" 버튼: 이메일 인증 코드 전송
        >
          인증하기
        </button>
      </div>
      {emailError && <p className="text-[12px] text-red-500">{emailError}</p>}{" "}
      {/* 이메일 관련 오류 메시지 */}
      {/* 인증번호 입력 필드 */}
      <div className="flex items-center gap-2">
        <label htmlFor="verificationCode">인증 번호</label>
        <input
          id="verificationCode"
          type="text"
          name="verificationCode"
          value={formData.verificationCode}
          onChange={handleChange} // 인증번호 값이 업데이트됩니다.
          placeholder="인증번호"
          className={inputStyles}
        />
        <button
          type="button"
          className={miniBtnStyles}
          onClick={handleVerifyCode} // "확인" 버튼: 인증 코드 확인
        >
          확인
        </button>
      </div>
      {verificationCodeError && (
        <p className="text-[12px] text-red-500">{verificationCodeError}</p>
      )}{" "}
      {/* 인증번호 관련 오류 메시지 */}
      {/* 비밀번호 재설정 버튼 */}
      <div className="mt-auto">
        <button
          type="submit" // 폼 제출 시 handleSubmit 함수가 실행됩니다.
          className="w-full h-[48px] mb-[32px] rounded-lg text-brand font-pre-bold border-[1px] border-brand"
        >
          비밀번호 재설정
        </button>
      </div>
    </form>
  );
};

export default FindPassword;
