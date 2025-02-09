// 유효성 검사 정규식
const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_]{3,19}$/;
const passwordRegex =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

// 유효성 검사 함수
export const validateId = (id: string): string | null => {
  if (!usernameRegex.test(id)) {
    return '아이디는 영문자로 시작하고, 4~20자 사이여야 합니다.';
  }
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!passwordRegex.test(password)) {
    return '비밀번호는 영문자, 숫자, 특수문자(@$!%*?&#)를 포함하여\n8~20자 사이여야 합니다.';
  }
  return null;
};

export const validateEmail = (email: string): string | null => {
  if (!emailRegex.test(email)) {
    return '올바른 이메일 형식이 아닙니다.';
  }
  return null;
};
