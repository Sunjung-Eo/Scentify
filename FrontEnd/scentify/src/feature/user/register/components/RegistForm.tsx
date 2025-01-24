import React, { useState } from 'react';

interface RegistFormProps {
  onRegist: () => void; // 회원가입 성공 시 실행될 함수
}

const RegistForm = ({ onRegist }: RegistFormProps) => {
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 성별 고르는 함수
  const handleGenderSelect = (gender: string) => {
    setFormData({ ...formData, gender });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 간단한 유효성 검사
    if (!formData.id)
      setErrors((prev) => ({ ...prev, id: '아이디를 입력하세요' }));
    if (formData.password !== formData.confirmPassword)
      setErrors((prev) => ({
        ...prev,
        confirmPassword: '비밀번호가 일치하지 않습니다',
      }));

    if (Object.keys(errors).length === 0) {
      onRegist();
    }
  };

  const inputStyles =
    'border h-9 flex-1 rounded-lg bg-component px-4 focus:outline-none focus:ring-2 focus:ring-brand';

  const miniBtnStyles =
    'h-9 px-4 rounded-lg border-0.5 focus:outline-none focus:ring-2 focus:ring-brand';

  return (
    <form
      id="registForm"
      onSubmit={handleSubmit}
      className="flex w-full max-w-[360px] flex-col gap-3 font-pre-light text-12"
    >
      {/* 아이디 */}
      <div className="flex items-center gap-2 ">
        <label htmlFor="id">아이디</label>
        <input
          id="id"
          type="text"
          name="id"
          value={formData.id}
          onChange={handleChange}
          placeholder="아이디"
          className={inputStyles}
        />
        <button type="button" className={miniBtnStyles}>
          중복 확인
        </button>
      </div>
      {errors.id && <p className="text-[12px] text-red-500">{errors.id}</p>}

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
      <div className="flex items-center gap-2 ">
        <label htmlFor="password">비밀번호</label>
        <input
          id="password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="비밀번호"
          className={inputStyles}
        />
      </div>

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
      <div className="flex items-center gap-2">
        <label htmlFor="birth">생년월일</label>
        <input
          id="birth"
          type="text"
          name="birthYear"
          placeholder="년(4자)"
          value={formData.birthYear}
          onChange={handleChange}
          className={
            'border h-9 w-[80px] rounded-lg bg-component px-4 focus:outline-none focus:ring-2 focus:ring-brand'
          }
        />
        <select
          name="birthMonth"
          value={formData.birthMonth}
          onChange={handleChange}
          className="border h-9 w-[80px] rounded-lg bg-component focus:outline-none focus:ring-2 focus:ring-brand"
        >
          <option value="">월</option>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}월
            </option>
          ))}
        </select>
        <input
          type="text"
          name="birthDay"
          placeholder="일"
          value={formData.birthDay}
          onChange={handleChange}
          className="border h-9 w-[80px] rounded-lg bg-component px-4 focus:outline-none focus:ring-2 focus:ring-brand"
        />
      </div>

      {/* 성별 선택 */}
      <div className="flex items-center gap-2">
        <p className="">성별</p>
        {['여성', '남성', '선택하지 않음'].map((gender) => (
          <button
            key={gender}
            type="button"
            onClick={() => handleGenderSelect(gender)}
            className={`h-9 rounded-lg px-4 border-brand border-0.5 ${
              formData.gender === gender ? 'bg-sub text-white' : 'bg-bg'
            }`}
          >
            {gender}
          </button>
        ))}
      </div>

      {/* 이메일 인증 */}
      <div className="flex items-center gap-2">
        <label htmlFor="email">이메일</label>
        <input
          id="email"
          type="email"
          name="email"
          placeholder="이메일"
          value={formData.email}
          onChange={handleChange}
          className="border h-9 flex-1 rounded-lg bg-component px-4 focus:outline-none focus:ring-2 focus:ring-brand"
        />
        <button type="button" className={miniBtnStyles}>
          인증하기
        </button>
      </div>

      {/* 인증번호 */}
      <div className="flex items-center gap-2">
        <label htmlFor="verificationCode">인증 번호</label>
        <input
          id="verificationCode"
          type="text"
          name="verificationCode"
          placeholder="인증 번호"
          value={formData.verificationCode}
          onChange={handleChange}
          className="border h-9 flex-1 rounded-lg bg-component px-4 focus:outline-none focus:ring-2 focus:ring-brand"
        />
        <button type="button" className={miniBtnStyles}>
          확인
        </button>
      </div>
    </form>
  );
};

export default RegistForm;
