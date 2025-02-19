import React, { useState, FormEvent } from 'react';
import {
  validatePassword,
  validateNickname,
} from '../../../../utils/validation';
import { registKakao } from '../../../../apis/user/social/registKakao';
import Alert from '../../../../components/Alert/Alert';
const RegistFormSocial = ({
  onRegist,
  email: initialEmail,
}: {
  onRegist: () => void;
  email: string;
}) => {
  // 상태 객체 초기값에 email 포함
  const [formData, setFormData] = useState({
    nickname: '',
    password: '',
    confirmPassword: '',
    birthYear: '',
    birthMonth: '',
    birthDay: '',
    gender: '',
    email: initialEmail || '', // 전달받은 이메일을 기본값으로 설정
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

    // 유효성 검사 적용
    const nicknameError = validateNickname(formData.nickname);
    if (nicknameError) newErrors.nickname = nicknameError;

    const passwordError = validatePassword(formData.password);
    if (passwordError) newErrors.password = passwordError;

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    }

    if (!formData.birthYear || !formData.birthMonth || !formData.birthDay) {
      newErrors.birth = '생년월일을 정확히 입력하세요.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // 생년월일 조합 및 서버 요청
    const birthDate = `${formData.birthYear}-${formData.birthMonth.padStart(2, '0')}-${formData.birthDay.padStart(2, '0')}`;

    const userData = {
      password: formData.password,
      nickname: formData.nickname,
      imgNum: 0, // 기본값 0
      socialType: 0,
      gender: Number(formData.gender) || 2, // 기본값 2
      birth: birthDate,
    };

    try {
      // 카카오 회원가입 API 호출
      await registKakao(userData);
      onRegist();
    } catch (error) {
      console.error('회원가입 에러:', error);
      setErrors({ server: '회원가입 처리 중 오류가 발생했습니다.' });
    }
  };

  const inputStyles =
    'flex-1 border h-9 min-w-[40px] rounded-lg bg-component px-4 focus:outline-none focus:ring-2 focus:ring-brand';

  const miniBtnStyles =
    'h-9 px-4 rounded-lg border-0.5 focus:outline-none focus:ring-2 focus:ring-brand';

  return (
    <>
      <form
        id="registFormSocial"
        onSubmit={handleSubmit}
        noValidate
        className="flex w-full flex-col p-2 gap-3 font-pre-light text-12 overflow-y-auto"
      >
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
        {errors.nickname && (
          <p className="text-[12px] text-red-500 break-words whitespace-pre-line">
            {errors.nickname}
          </p>
        )}

        {/* 비밀번호 */}
        <div className="flex items-center gap-2 ">
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
            className={`${inputStyles} w-full min-w-[80px]`}
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

        {/* 이메일 폼을 `initialEmail`이 있을 때만 렌더링 */}
        {initialEmail.trim() == '' ? null : (
          <div className="flex items-center gap-2">
            <p className="text-gray-600">이메일: {initialEmail}</p>
          </div>
        )}
      </form>
      {alertMessage && (
        <Alert
          message={alertMessage}
          onClose={() => setAlertMessage('')}
          cancelText=""
          confirmText="확인"
        />
      )}
    </>
  );
};

export default RegistFormSocial;
