import React, { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { sendEmailCodeForPassword } from "../../../apis/user/sendEmailCodeForPassword";
import { verifyEmailCodeForPassword } from "../../../apis/user/verifyEmailCodeForPassword";

// FormData 인터페이스: 사용자가 입력할 데이터 구조 정의.
interface FormData {
  id: string;
  email: string;
  verificationCode: string; // 이메일로 전송된 인증 코드
}

const FindPassword = () => {
  // formData상태는 사용자가 입력하는 아이디, 이메일, 인증 코드를 저장.
  const [formData, setFormData] = useState<FormData>({
    id: "",
    email: "",
    verificationCode: "",
  });

  // 각 필드별 에러 메시지 별도 관리.
  const [idError, setIdError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [verificationCodeError, setVerificationCodeError] =
    useState<string>(""); // 인증 코드 관련 에러

  // 인증 상태 플래그들
  const [isVerified, setIsVerified] = useState<boolean>(false); // 이메일 인증(코드 전송) 성공 여부
  const [isCodeVerified, setIsCodeVerified] = useState<boolean>(false); // 인증 코드 확인 성공 여부

  const navigate = useNavigate();

  // 입력 필드 변경 시 formData 상태 업데이트하는 핸들러 함수.
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target; // 입력 필드의 name과 value 추출
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
      // API 호출: sendEmailCodeForPassword 함수를 호출해 이메일로 인증 코드를 전송.
      await sendEmailCodeForPassword(formData.id, formData.email);
      alert("인증 코드가 전송되었습니다."); // 전송 성공 시 사용자에게 알림
      // 성공 후, 관련 에러 메시지를 초기화.
      setIdError("");
      setEmailError("");
      // 전송 성공 시 isVerified를 true로 변경
      setIsVerified(true);
    } catch (error: unknown) {
      // 오류 발생 시, error 객체가 Error 타입인지 확인한 후, 그 메시지 사용
      if (error instanceof Error) {
        setEmailError(error.message);
      } else {
        setEmailError("알 수 없는 오류가 발생했습니다.");
      }
    }
  };

  // 인증 코드 확인 함수
  // 사용자가 입력한 인증 코드가 올바른지 API를 통해 확인
  const handleVerifyCode = async () => {
    if (!formData.verificationCode.trim()) {
      setVerificationCodeError("인증번호를 입력해주세요.");
      return;
    }

    try {
      // API 호출: verifyEmailCodeForPassword 함수를 호출해 인증 코드의 유효성 확인.
      await verifyEmailCodeForPassword(formData.verificationCode);
      // 인증 코드 확인 성공 시 플래그 업데이트
      setIsCodeVerified(true);
      setVerificationCodeError("");
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

  // 폼 제출 핸들러: 사용자가 "비밀번호 재설정" 버튼을 눌렀을 때 호출
  // 모든 필드의 유효성을 검사하고, 이메일 인증과 인증 코드 확인이 완료되었으면
  // /user/reset-password 페이지로 이동하며 아이디 정보 전달
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // 기본 폼 제출 동작(새로고침)막음
    // 제출 전 에러 메시지 모두 초기화.
    setIdError("");
    setEmailError("");
    setVerificationCodeError("");
    // 유효성 검사를 위해 임시 객체를 생성
    let newErrors: { [key: string]: string } = {};

    // 각 필드의 유효성 검사
    if (!formData.id.trim()) {
      newErrors.id = "아이디를 입력해주세요.";
    }
    if (!formData.email.trim()) {
      newErrors.email = "이메일을 입력해주세요.";
    }
    if (!formData.verificationCode.trim()) {
      newErrors.verificationCode = "인증 번호를 입력해주세요.";
    }

    // 유효성 검사에서 에러가 있으면 해당 필드에 에러 메시지를 설정하고 함수 실행 중단.
    if (Object.keys(newErrors).length > 0) {
      setIdError(newErrors.id || "");
      setEmailError(newErrors.email || "");
      setVerificationCodeError(newErrors.verificationCode || "");
      return;
    }

    // 이메일 인증(코드 전송)과 인증 코드 확인이 모두 완료되어야만 다음 페이지로 이동.
    if (!isVerified) {
      setVerificationCodeError("이메일 인증을 먼저 완료해주세요.");
      return;
    }
    if (!isCodeVerified) {
      setVerificationCodeError("인증번호를 먼저 확인해주세요.");
      return;
    }

    // 모든 조건이 충족되면 비밀번호 재설정 페이지로 이동하고,아이디정보도 전달.
    navigate("/user/reset-password", {
      state: {
        id: formData.id,
      },
    });
  };

  // 입력 필드와 버튼 css
  const inputStyles =
    "border h-9 flex-1 rounded-lg bg-component px-4 focus:outline-none focus:ring-2 focus:ring-brand";
  const miniBtnStyles =
    "h-9 px-4 rounded-lg border-0.5 focus:outline-none focus:ring-2 focus:ring-brand";

  return (
    <form
      id="registForm"
      onSubmit={handleSubmit} // 폼 제출 시 handleSubmit 함수 실행.
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
          onChange={handleChange} // 사용자 입력 변경시 handleChange 함수 호출돼 formData 업데이트.
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
          onChange={handleChange} // 이메일 값 업데이트
          placeholder="이메일"
          className={inputStyles}
        />
        <button
          type="button"
          className={miniBtnStyles}
          onClick={handleSendEmailCode} //버튼 클릭시 handleSendEmailCode 함수가 호출돼 이메일 인증 코드 전송
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
          onClick={handleVerifyCode} //버튼 클릭 시, handleVerifyCode 함수가 호출돼 인증 코드 확인 진행
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
          type="submit" // 폼 제출 시 handleSubmit 함수 실행.
          className="w-full h-[48px] mb-[32px] rounded-lg text-brand font-pre-bold border-[1px] border-brand"
        >
          비밀번호 재설정
        </button>
      </div>
    </form>
  );
};

export default FindPassword;
