import { checkId } from '../../../../apis/user/checkId';
import { getEmailCode } from '../../../../apis/user/getEmailCode';
import { checkEmailCode } from '../../../../apis/user/checkEmailCode';

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

  try {
    const result = await checkId(id);
    setErrors((prev) => ({
      ...prev,
      id: result ? result : '사용 가능한 아이디입니다.',
    }));
  } catch {
    setErrors((prev) => ({ ...prev, id: '서버 오류가 발생했습니다.' }));
  }
};

/**
 * 이메일 인증 요청 핸들러 (1)
 */
export const handleGetEmailCode = async (
  email: string,
  setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>
) => {
  if (!email) {
    setErrors((prev) => ({ ...prev, email: '이메일을 입력해주세요.' }));
    return;
  }

  try {
    await getEmailCode(email);
    alert('인증 코드가 전송되었습니다.');
    setErrors((prev) => ({ ...prev, email: '' }));
  } catch {
    alert('서버에 문제가 발생했습니다.');
  }
};

/**
 * 이메일 코드 검증 핸들러 (2)
 */
export const handleEmailVerification = async (
  code: string,
  setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>
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
      verificationCode: result
        ? '인증이 완료되었습니다.'
        : '잘못된 인증번호입니다.',
    }));
  } catch {
    alert('서버에 문제가 발생했습니다.');
  }
};
