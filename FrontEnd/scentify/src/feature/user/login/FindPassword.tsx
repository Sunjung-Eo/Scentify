import React, { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { sendEmailCodeForPassword } from "../../../apis/user/sendEmailCodeForPassword";
import { verifyEmailCodeForPassword } from "../../../apis/user/verifyEmailCodeForPassword";
import { validateId, validateEmail } from "../../../utils/validation";
import Alert from "../../../components/Alert/AlertMy";

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
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [alertMessage, setAlertMessage] = useState<string>("");

  // 인증 상태 플래그들
  const [isVerified, setIsVerified] = useState<boolean>(false); // 이메일 인증(코드 전송) 성공 여부
  const [isCodeVerified, setIsCodeVerified] = useState<boolean>(false); // 인증 코드 확인 성공 여부

  const navigate = useNavigate();

  const setShowAlert = (message: string) => {
    setAlertMessage(message);
  };

  // 입력 필드 변경 시 formData 상태 업데이트하는 핸들러 함수.
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target; // 입력 필드의 name과 value 추출
    setFormData((prev) => ({ ...prev, [name]: value })); // 해당 필드 업데이트
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // 이메일 인증 코드 전송 함수
  const handleSendEmailCode = async () => {
    const idValidationMessage = validateId(formData.id);
    const emailValidationMessage = validateEmail(formData.email);
    if (idValidationMessage)
      setErrors((prev) => ({ ...prev, id: idValidationMessage }));
    if (emailValidationMessage)
      setErrors((prev) => ({ ...prev, email: emailValidationMessage }));
    if (idValidationMessage || emailValidationMessage) return;

    try {
      await sendEmailCodeForPassword(formData.id, formData.email);
      setShowAlert("인증 코드가 전송되었습니다.");
      setIsVerified(true);
    } catch (error: unknown) {
      setErrors((prev) => ({
        ...prev,
        email:
          error instanceof Error
            ? error.message
            : "알 수 없는 오류가 발생했습니다.",
      }));
    }
  };

  // 인증 코드 확인 함수
  // 사용자가 입력한 인증 코드가 올바른지 API를 통해 확인
  const handleVerifyCode = async () => {
    if (!formData.verificationCode.trim()) {
      setErrors((prev) => ({
        ...prev,
        verificationCode: "인증번호를 입력해주세요.",
      }));
      return;
    }

    try {
      // API 호출: verifyEmailCodeForPassword 함수를 호출해 인증 코드의 유효성 확인.
      await verifyEmailCodeForPassword(formData.verificationCode);
      // 인증 코드 확인 성공 시 플래그 업데이트
      setShowAlert("인증이 완료되었습니다.");
      setIsCodeVerified(true);
    } catch (error: unknown) {
      setErrors((prev) => ({
        ...prev,
        verificationCode:
          error instanceof Error
            ? error.message
            : "알 수 없는 오류가 발생했습니다.",
      }));
    }
  };

  // 폼 제출 핸들러: 사용자가 "비밀번호 재설정" 버튼을 눌렀을 때 호출
  // 모든 필드의 유효성을 검사하고, 이메일 인증과 인증 코드 확인이 완료되었으면
  // /user/reset-password 페이지로 이동하며 아이디 정보 전달
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isVerified) {
      setErrors((prev) => ({
        ...prev,
        verificationCode: "이메일 인증을 먼저 완료해주세요.",
      }));
      return;
    }
    if (!isCodeVerified) {
      setErrors((prev) => ({
        ...prev,
        verificationCode: "인증번호를 먼저 확인해주세요.",
      }));
      return;
    }
    navigate("/user/reset-password", { state: { id: formData.id } });
  };

  // 입력 필드와 버튼 css
  const inputStyles =
    "border h-9 flex-1 rounded-lg bg-component px-4 focus:outline-none focus:ring-2 focus:ring-brand";
  const miniBtnStyles =
    "h-9 px-4 rounded-lg border-0.5 focus:outline-none focus:ring-2 focus:ring-brand";

  return (
    <>
      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex w-full max-w-[360px] flex-col gap-3 font-pre-light text-12 px-4 mt-[16px]"
      >
        <h1 className="text-20 font-pre-bold text-center mb-8">
          비밀번호 찾기
        </h1>
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
        {errors.id && <p className="text-[12px] text-red-500">{errors.id}</p>}
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
        {errors.email && (
          <p className="text-[12px] text-red-500">{errors.email}</p>
        )}
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
        {errors.verificationCode && (
          <p className="text-[12px] text-red-500">{errors.verificationCode}</p>
        )}
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
      {alertMessage && (
        <Alert message={alertMessage} onClose={() => setAlertMessage("")} />
      )}
    </>
  );
};

export default FindPassword;
