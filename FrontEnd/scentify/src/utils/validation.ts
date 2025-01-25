export const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_]{3,19}$/;
export const passwordRegex =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;

export const validateUsername = (id: string): string | null => {
  if (!usernameRegex.test(id)) {
    return "아이디는 영문자로 시작하고, 4~20자 사이여야 합니다.";
  }
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!passwordRegex.test(password)) {
    return "비밀번호는 영문자, 숫자, 특수문자를 포함하여 8~20자 사이여야 합니다.";
  }
  return null;
};
