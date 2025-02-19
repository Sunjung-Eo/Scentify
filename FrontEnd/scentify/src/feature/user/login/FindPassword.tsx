import React, { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { sendEmailCodeForPassword } from "../../../apis/user/sendEmailCodeForPassword";
import { verifyEmailCodeForPassword } from "../../../apis/user/verifyEmailCodeForPassword";
import { validateId, validateEmail } from "../../../utils/validation";
import Alert from "../../../components/Alert/AlertMy";

interface FormData {
  id: string;
  email: string;
  verificationCode: string;
}

const FindPassword = () => {
  const [formData, setFormData] = useState<FormData>({
    id: "",
    email: "",
    verificationCode: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [alertMessage, setAlertMessage] = useState<string>("");

  // 인증 상태 플래그들
  const [isVerified, setIsVerified] = useState<boolean>(false); // 이메일 인증
  const [isCodeVerified, setIsCodeVerified] = useState<boolean>(false); // 인증 코드 확인

  const navigate = useNavigate();

  const setShowAlert = (message: string) => {
    setAlertMessage(message);
  };

  // 입력 필드 변경 시 formData 상태 업데이트하는 핸들러 함수
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
  const handleVerifyCode = async () => {
    if (!formData.verificationCode.trim()) {
      setErrors((prev) => ({
        ...prev,
        verificationCode: "인증번호를 입력해주세요.",
      }));
      return;
    }

    try {
      // API 호출: verifyEmailCodeForPassword 함수를 호출해 인증 코드의 유효성 확인
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
  // 페이지 이동하며 아이디 정보 전달
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

  const inputStyles =
    "flex-1 w-full border w-[150px] h-[34px] rounded-lg bg-component px-3 focus:outline-none focus:ring-2 focus:ring-brand";

  return (
    <div className="w-full h-full flex flex-col items-center">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-col w-full h-full gap-3 font-pre-light text-12 mt-[16px]"
      >
        <h1 className="text-20 font-pre-bold text-center mb-[52px]">
          비밀번호 찾기
        </h1>
        {/* 아이디 입력 필드 */}
        <div className="flex items-center gap-2 w-full">
          <label htmlFor="id" className="w-[80px] text-left">
            아이디
          </label>
          <input
            id="id"
            type="text"
            name="id"
            value={formData.id}
            onChange={handleChange}
            className={inputStyles}
          />
          <button
            type="button"
            className="ml-auto w-[80px] h-[34px] "
            onClick={handleVerifyCode}
          ></button>
        </div>
        {errors.id && <p className="text-[12px] text-red-500">{errors.id}</p>}
        {/* 이메일 입력 필드 */}
        <div className="flex items-center gap-2 w-full">
          <label htmlFor="email" className="w-[80px] text-left">
            이메일
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={inputStyles}
          />
          <button
            type="button"
            className="w-[80px] h-[34px] ml-auto text-12 font-pre-light rounded-lg border-[0.7px] border-gray active:text-component active:bg-brand active:border-0"
            onClick={handleSendEmailCode}
          >
            인증번호 전송
          </button>
        </div>
        {errors.email && (
          <p className="text-[12px] text-red-500">{errors.email}</p>
        )}
        {/* 인증번호 입력 필드 */}
        <div className="flex items-center gap-2 w-full">
          <label htmlFor="verificationCode" className="w-[80px] text-left">
            인증 번호
          </label>
          <input
            id="verificationCode"
            type="text"
            name="verificationCode"
            value={formData.verificationCode}
            onChange={handleChange}
            className={inputStyles}
          />
          <button
            type="button"
            className="ml-auto w-[80px] h-[34px] text-12 font-pre-light rounded-lg border-[0.7px] border-gray active:text-bg active:bg-brand active:border-0"
            onClick={handleVerifyCode}
          >
            확인
          </button>
        </div>
        {errors.verificationCode && (
          <p className="text-[12px] text-red-500">{errors.verificationCode}</p>
        )}
        {/* 비밀번호 재설정 버튼 */}
        <div className="mt-auto mb-[-10px]">
          <button
            type="submit"
            className="w-full h-[48px] rounded-lg text-brand text-16 font-pre-medium border-[1px] border-brand active:text-bg active:bg-brand active:border-0"
          >
            비밀번호 재설정
          </button>
        </div>
      </form>
      {alertMessage && (
        <Alert message={alertMessage} onClose={() => setAlertMessage("")} />
      )}
    </div>
  );
};

export default FindPassword;
