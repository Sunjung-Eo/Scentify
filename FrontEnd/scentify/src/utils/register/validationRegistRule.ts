import { FormDataType } from '../../types/FormUserType';

export interface ValidationRule {
  value: string;
  message: string;
  validate?: (value: string) => boolean;
}

export type ValidationRules = {
  [key in keyof FormDataType]: ValidationRule;
};

export const validationRegistRules = (
  formData: FormDataType
): ValidationRules => ({
  id: {
    value: formData.id.trim(),
    message: '아이디를 입력하세요',
  },
  password: {
    value: formData.password.trim(),
    message: '비밀번호는 최소 8자 이상이어야 합니다.',
    validate: (value: string) => value.length >= 8,
  },
  confirmPassword: {
    value: formData.confirmPassword.trim(),
    message: '비밀번호가 일치하지 않습니다',
    validate: (value: string) => value === formData.password,
  },
  nickname: {
    value: formData.nickname.trim(),
    message: '닉네임을 입력하세요',
  },
  email: {
    value: formData.email.trim(),
    message: '이메일을 입력하세요',
    validate: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  },
  birthYear: {
    value: formData.birthYear.trim(),
    message: '생년월일을 입력하세요',
  },
  birthMonth: {
    value: formData.birthMonth.trim(),
    message: '생년월일을 입력하세요',
  },
  birthDay: {
    value: formData.birthDay.trim(),
    message: '생년월일을 입력하세요',
  },
  gender: {
    value: formData.gender.trim(),
    message: '성별을 선택하세요',
  },
  verificationCode: {
    value: formData.verificationCode.trim(),
    message: '인증번호를 입력하세요',
  },
});
