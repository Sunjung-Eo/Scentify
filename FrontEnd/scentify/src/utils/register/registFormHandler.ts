import { FormEvent, ChangeEvent } from 'react';
import { registUser } from '../../apis/user/regist';
import { checkId } from '../../apis/user/checkId';
import { getEmailCode } from '../../apis/user/getEmailCode';
import { checkEmailCode } from '../../apis/user/checkEmailCode';

/**
 * 입력 필드 변경 핸들러
 */
export const handleChange = (
  e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  formData: FormData,
  setFormData: React.Dispatch<React.SetStateAction<FormData>>
) => {
  const { name, value } = e.target;
  const updatedFormData = new FormData();

  // 기존 데이터를 유지하면서 새로운 값 추가
  formData.forEach((val, key) => updatedFormData.append(key, val));
  updatedFormData.set(name, value);

  setFormData(updatedFormData);
};

/*
 * 폼 제출 핸들러
 */
export const handleSubmit = async (
  e: FormEvent<HTMLFormElement>, // 폼 요소에서 이벤트 발생
  setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>,
  onRegist: () => void
) => {
  e.preventDefault();

  setErrors({}); // 에러 상태 초기화

  const formData = new FormData(e.currentTarget); // HTMLFormElement에서 FormData 생성
  let errors: { [key: string]: string } = {};

  // 생년월일 조합
  const year = formData.get('birthYear') as string;
  const month = formData.get('birthMonth') as string;
  const day = formData.get('birthDay') as string;

  console.log('입력된 값:', { year, month, day });

  if (year && month && day) {
    const formattedBirth = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    formData.set('birth', formattedBirth);
  } else {
    errors.birth = '생년월일을 정확히 입력하세요.';
  }

  // 필수 필드 유효성 검사
  if (!formData.get('id')) {
    errors.id = '아이디를 입력하세요';
  }
  if (formData.get('password') !== formData.get('confirmPassword')) {
    errors.confirmPassword = '비밀번호가 일치하지 않습니다';
  }

  if (Object.keys(errors).length > 0) {
    setErrors(errors);
    return;
  }

  try {
    // regist.ts에서 API 호출
    const result = await registUser(formData);
    if (result == 200) {
      console.log('회원가입 성공:', result);
      onRegist();
    } else {
      setErrors({ server: '회원가입에 실패했습니다. 다시 시도해주세요.' });
    }
  } catch (error) {
    setErrors({ server: '서버에 문제가 발생했습니다.' });
  }
};

/**
 * 성별 선택 핸들러
 */
export const handleGenderSelect = (
  gender: string,
  formData: FormData,
  setFormData: React.Dispatch<React.SetStateAction<FormData>>
) => {
  // 새로운 FormData 객체 생성 및 기존 데이터 복사
  const updatedFormData = new FormData();
  formData.forEach((value, key) => updatedFormData.append(key, value));

  // 새 값 설정
  updatedFormData.set('gender', gender);

  // 상태 업데이트
  setFormData(updatedFormData);
};

/**

/**
 * 아이디 중복 버튼 핸들러
 */
export const handleCheckDuplicate = async (
  id: string,
  setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>
) => {
  if (!id) {
    setErrors((prev) => ({ ...prev, id: '아이디를 입력해주세요.' }));
    return;
  }

  try {
    const result = await checkId(id);
    setErrors((prev) => ({
      ...prev,
      id: result || '사용 가능한 아이디입니다.',
    }));
  } catch (error) {
    alert('서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
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
    setErrors((prev) => ({ ...prev, email: '' })); // 오류 메시지 초기화
  } catch (error) {
    alert('서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
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
      verificationCode: '이메일 인증 코드를 입력해주세요.',
    }));
    return;
  }

  try {
    const result = await checkEmailCode(code);
    setErrors((prev) => ({
      ...prev,
      verificationCode: result || '코드 인증이 완료되었습니다.',
    }));
  } catch (error) {
    alert('서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
  }
};
