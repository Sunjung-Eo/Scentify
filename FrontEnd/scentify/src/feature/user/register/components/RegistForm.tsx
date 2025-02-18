import React, { useState, FormEvent } from 'react';
import {
  handleCheckDuplicate,
  handleGetEmailCode,
  handleEmailVerification,
} from '../handler/registFormHandler';
import { registUser } from '../../../../apis/user/regist';
import { validatePassword, validateId } from '../../../../utils/validation';
import Alert from '../../../../components/Alert/Alert';

const RegistForm = ({ onRegist }: { onRegist: () => void }) => {
  // 단순 상태 객체로 변경
  const [formData, setFormData] = useState({
    id: '',
    nickname: '',
    password: '',
    confirmPassword: '',
    birthYear: '',
    birthMonth: '',
    birthDay: '',
    gender: '',
    email: '',
    verificationCode: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [alertMessage, setAlertMessage] = useState<string>('');

  const setShowAlert = (message: string) => {
    setAlertMessage(message);
  };

  // 입력 변경 핸들러
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({}); // 에러 초기화

    let newErrors: { [key: string]: string } = {};

    // ID 중복 확인만 체크 (유효성 검사는 중복 확인 시 이미 완료)
    if (!errors.id || errors.id !== '사용 가능한 아이디입니다.') {
      newErrors.id = '아이디 중복 확인이 필요합니다.';
    }

    if (!formData.nickname.trim()) {
      newErrors.nickname = '닉네임을 입력해주세요.';
    }

    const passwordError = validatePassword(formData.password);
    if (passwordError) newErrors.password = passwordError;

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    }

    if (!formData.birthYear || !formData.birthMonth || !formData.birthDay) {
      newErrors.birth = '생년월일을 정확히 입력하세요.';
    }
    if (!formData.email.trim()) {
      newErrors.email = '이메일을 입력해주세요.';
    }
    if (!formData.verificationCode.trim()) {
      newErrors.verificationCode = '인증 번호를 입력해주세요.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // 생년월일 조합 및 서버 요청
    const birthDate = `${formData.birthYear}-${formData.birthMonth.padStart(2, '0')}-${formData.birthDay.padStart(2, '0')}`;

    const userData = {
      id: formData.id,
      password: formData.password,
      nickname: formData.nickname,
      email: formData.email,
      imgNum: 0, // 기본값 0
      socialType: 0,
      gender: Number(formData.gender) || 2, // 기본값 2
      birth: birthDate,
      mainDeviceId: 0, // 기본값 0
    };

    try {
      // 일반 회원가입 API 호출
      const result = await registUser(userData);
      onRegist(); // 성공 시 부모 컴포넌트의 핸들러 호출
    } catch (error: any) {
      console.error('회원가입 에러:', error);
      const errorMessage =
        error.response?.data?.message ||
        '회원가입 처리 중 오류가 발생했습니다.';
      setAlertMessage(errorMessage); // 실패 시에만 RegistForm에서 alert 표시
      setErrors({ server: errorMessage });
    }
  };

  const inputStyles =
    'flex-1 border h-9 min-w-[40px] rounded-lg bg-component px-4 focus:outline-none focus:ring-2 focus:ring-brand';

  const miniBtnStyles =
    'h-9 px-4 rounded-lg border-0.5 focus:outline-none focus:ring-2 focus:ring-brand whitespace-nowrap';

  return (
    <>
      <form
        id="registForm"
        onSubmit={handleSubmit}
        noValidate
        className="flex w-full flex-col p-2 gap-3 font-pre-light text-12 overflow-y-auto"
      >
        {/* 아이디 */}
        <div className="flex flex-wrap items-center gap-2 w-full">
          <label htmlFor="id" className="flex text-12 shrink-0">
            아이디
          </label>
          <input
            id="id"
            type="text"
            name="id"
            value={formData.id}
            onChange={handleChange}
            placeholder="아이디"
            className={inputStyles}
          />
          <button
            type="button"
            className={miniBtnStyles}
            onClick={() => handleCheckDuplicate(formData.id, setErrors)}
          >
            중복 확인
          </button>
        </div>
        {errors.id && (
          <p
            className={`text-[12px] ${
              errors.id === '사용 가능한 아이디입니다.'
                ? 'text-brand'
                : 'text-red-500'
            }`}
          >
            {errors.id}
          </p>
        )}

        {/* 닉네임 */}
        <div className="flex items-center gap-2 ">
          <label htmlFor="nickname">닉네임</label>
          <input
            id="nickname"
            type="text"
            name="nickname"
            value={formData.nickname}
            onChange={handleChange}
            placeholder="닉네임"
            className={inputStyles}
          />
        </div>

        {/* 비밀번호 */}
        <div className="flex items-center gap-2">
          <label htmlFor="password">비밀번호</label>
          <input
            id="password"
            type="password"
            name="password"
            onChange={handleChange}
            placeholder="비밀번호"
            className={inputStyles}
          />
        </div>
        {errors.password && (
          <p className="text-[12px] text-red-500 break-words whitespace-pre-line">
            {errors.password}
          </p>
        )}

        {/* 비밀번호 확인 */}
        <div className="flex items-center gap-2 ">
          <label htmlFor="confirmPassword">비밀번호 확인</label>
          <input
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="비밀번호 확인"
            className={inputStyles}
          />
        </div>
        {errors.confirmPassword && (
          <p className="text-[12px] text-red-500">{errors.confirmPassword}</p>
        )}

        {/* 생년월일 */}
        <fieldset id="birth" className="flex items-center gap-2 w-full">
          <label className="flex text-12 shrink-0">생년월일</label>
          <input
            type="text"
            name="birthYear"
            value={formData.birthYear}
            placeholder="년(4자)"
            maxLength={4}
            onChange={handleChange}
            className="border w-full h-9 rounded-lg bg-component px-4 focus:outline-none focus:ring-2 focus:ring-brand"
          />
          <select
            id="birthMonth"
            name="birthMonth"
            value={formData.birthMonth}
            onChange={handleChange}
            className={`${inputStyles} w-full min-w-[72px]`}
          >
            <option value="">월</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                {i + 1}월
              </option>
            ))}
          </select>
          <input
            id="birthDay"
            type="text"
            name="birthDay"
            value={formData.birthDay}
            placeholder="일"
            maxLength={2}
            onChange={handleChange}
            className="border h-9 w-full max-w-[80px] rounded-lg bg-component px-4 focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </fieldset>
        {errors.birth && (
          <p className="text-[12px] text-red-500">{errors.birth}</p>
        )}

        {/* 성별 선택 */}
        <div className="flex items-center gap-2">
          <p className="flex text-12 shrink-0">성별</p>
          {[
            { label: '남성', value: '0' },
            { label: '여성', value: '1' },
            { label: '선택하지 않음', value: '2' },
          ].map((gender) => (
            <button
              key={gender.value}
              type="button"
              onClick={() =>
                setFormData((prev) => ({ ...prev, gender: gender.value }))
              }
              className={`h-9 rounded-lg px-4 border-brand border-0.5 ${
                formData.gender === gender.value ? 'bg-sub text-white' : 'bg-bg'
              }`}
            >
              {gender.label}
            </button>
          ))}
        </div>

        {/* 이메일 인증번호 요청 */}
        <div className="flex items-center gap-2">
          <label htmlFor="email">이메일</label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="이메일"
            className={inputStyles}
          />
          <button
            type="button"
            className={miniBtnStyles}
            onClick={() =>
              handleGetEmailCode(formData.email, setErrors, setShowAlert)
            }
          >
            인증하기
          </button>
        </div>
        {errors.email && (
          <p className="text-[12px] text-red-500">{errors.email}</p>
        )}

        {/* 인증번호 검증하기 */}
        <div className="flex items-center gap-2">
          <label htmlFor="verificationCode">인증 번호</label>
          <input
            id="verificationCode"
            type="text"
            name="verificationCode"
            value={formData.verificationCode}
            onChange={handleChange}
            placeholder="인증번호"
            className={inputStyles}
          />
          <button
            type="button"
            className={miniBtnStyles}
            onClick={() =>
              handleEmailVerification(
                formData.verificationCode,
                setErrors,
                setShowAlert
              )
            }
          >
            확인
          </button>
        </div>
        {errors.verificationCode && (
          <p
            className={`text-[12px] ${
              errors.verificationCode === '인증이 완료되었습니다.'
                ? 'text-brand'
                : 'text-red-500'
            }`}
          >
            {errors.verificationCode}
          </p>
        )}
      </form>

      {alertMessage && (
        <Alert message={alertMessage} onClose={() => setAlertMessage('')} />
      )}
    </>
  );
};

export default RegistForm;
