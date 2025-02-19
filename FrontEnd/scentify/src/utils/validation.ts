// 유효성 검사 정규식
const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_]{3,19}$/; // 아이디 길이 제한 추가

/*
비밀번호 정규식식
최소 하나의 영문자 포함
최소 하나의 숫자 포함
최소 하나의 특수문자(@$!%*?&#) 포함
길이는 8~20자
특수문자는 @$!%*?&# 만 가능, 그 외 특수문자는 안됨.
*/
const passwordRegex =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,20}$/;
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

// 자음 또는 모음 단독 입력 제한 정규식
const hangulConsonantOnlyRegex = /^[ㄱ-ㅎ]+$/; // 자음만 있는 경우
const hangulVowelOnlyRegex = /^[ㅏ-ㅣ]+$/; // 모음만 있는 경우

// 닉네임 정규식
const nicknameRegex = /^[가-힣a-zA-Z0-9]{2,10}$/;
const hangulJamoRegex = /[\u1100-\u11FF\u3130-\u318F]/;

// 유효성 검사 함수
export const validateId = (id: string): string | null => {
  if (!usernameRegex.test(id)) {
    return '아이디는 영문자로 시작하고, 영어, 숫자, _ 만 포함하며\n4~20자 사이여야 합니다.';
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

export const validateNickname = (nickname: string): string | null => {
  if (!nickname) {
    return '닉네임을 입력해주세요.';
  }

  // 자음 또는 모음만 단독으로 입력되었을 경우 처리
  if (
    hangulConsonantOnlyRegex.test(nickname) ||
    hangulVowelOnlyRegex.test(nickname)
  ) {
    return '자음 또는 모음만 단독으로 입력할 수 없습니다.';
  }

  // 기존의 한글, 영문, 숫자 제한 검사
  if (!nicknameRegex.test(nickname)) {
    return '닉네임은 2~10자의 완성된 한글, 영문, 숫자만 사용 가능합니다.';
  }

  return null;
};
