import { checkId } from '../../../../apis/user/checkId';
import { getEmailCode } from '../../../../apis/user/getEmailCode';
import { checkEmailCode } from '../../../../apis/user/checkEmailCode';
import { validateEmail, validateId } from '../../../../utils/validation';

/**
 * 성별 선택 핸들러
 */
export const handleGenderSelect = (
  gender: string,
  setFormData: React.Dispatch<React.SetStateAction<any>>
) => {
  setFormData((prev: any) => ({ ...prev, gender }));
};

/**

/**
 * 아이디 중복 버튼 핸들러
 */
export const handleCheckDuplicate = async (
  id: string,
  setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>
) => {
  if (!id.trim()) {
    setErrors((prev) => ({ ...prev, id: '아이디를 입력해주세요.' }));
    return;
  }

  // ID 유효성 검사 추가
  const idValidationError = validateId(id);
  if (idValidationError) {
    setErrors((prev) => ({ ...prev, id: idValidationError }));
    return;
  }

  try {
    const result = await checkId(id);
    setErrors((prev) => ({
      ...prev,
      id: result ? result : '사용 가능한 아이디입니다.',
    }));
  } catch {
    setErrors((prev) => ({ ...prev, id: '사용할 수 없는 아이디입니다.' }));
  }
};

/**
 * 이메일 인증 요청 핸들러 (1)
 */
export const handleGetEmailCode = async (
  email: string,
  setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>,
  setShowAlert: (message: string) => void
) => {
  // 에러 메시지 초기화
  setErrors((prev) => ({ ...prev, email: '' }));

  if (!email) {
    setErrors((prev) => ({ ...prev, email: '이메일을 입력해주세요.' }));
    return;
  }

  // 이메일 유효성 검사 추가
  const emailValidationError = validateEmail(email);
  if (emailValidationError) {
    setErrors((prev) => ({ ...prev, email: emailValidationError }));
    return;
  }

  try {
    await getEmailCode(email);
    setShowAlert('인증 코드가 전송되었습니다.');
  } catch {
    setShowAlert('현재 인증 코드를 발송할 수 없습니다.');
  }
};

/**
 * 이메일 코드 검증 핸들러 (2)
 */
export const handleEmailVerification = async (
  code: string,
  setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>,
  setShowAlert: (message: string) => void
) => {
  if (!code) {
    setErrors((prev) => ({
      ...prev,
      verificationCode: '인증번호를 입력해주세요.',
    }));
    return;
  }

  try {
    const result = await checkEmailCode(code);

    setErrors((prev) => ({
      ...prev,
      verificationCode: result === '200' ? '인증이 완료되었습니다.' : result,
    }));
  } catch (error) {
    setShowAlert('현재 인증이 불가합니다. 잠시 후 다시 인증 바랍니다.');
  }
};
