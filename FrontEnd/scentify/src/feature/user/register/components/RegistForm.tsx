import React, { useState } from "react";

interface RegistFormProps {
  onRegist: () => void; // 회원가입 성공 시 실행될 함수
}

const RegistForm = ({ onRegist }: RegistFormProps) => {
  const [formData, setFormData] = useState({
    id: "",
    nickname: "",
    password: "",
    confirmPassword: "",
    birthYear: "",
    birthMonth: "",
    birthDay: "",
    gender: "",
    email: "",
    verificationCode: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 간단한 유효성 검사
    if (!formData.id)
      setErrors((prev) => ({ ...prev, id: "아이디를 입력하세요" }));
    if (formData.password !== formData.confirmPassword)
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "비밀번호가 일치하지 않습니다",
      }));

    if (Object.keys(errors).length === 0) {
      onRegist();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-[360px] flex-col gap-2.5"
    >
      {/* 아이디 */}
      <div className="flex gap-2">
        <input
          type="text"
          name="id"
          value={formData.id}
          onChange={handleChange}
          placeholder="아이디"
          className="border h-[44px] flex-1 rounded-lg bg-component px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button type="button" className="h-[44px] rounded-lg bg-lightgray px-4">
          중복 확인
        </button>
      </div>
      {errors.id && <p className="text-[12px] text-red-500">{errors.id}</p>}

      {/* 닉네임 */}
      <input
        type="text"
        name="nickname"
        value={formData.nickname}
        onChange={handleChange}
        placeholder="닉네임"
        className="border h-[44px] rounded-lg bg-component px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* 비밀번호 */}
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="비밀번호"
        className="border h-[44px] rounded-lg bg-component px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* 비밀번호 확인 */}
      <input
        type="password"
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleChange}
        placeholder="비밀번호 확인"
        className="border h-[44px] rounded-lg bg-component px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {errors.confirmPassword && (
        <p className="text-[12px] text-red-500">{errors.confirmPassword}</p>
      )}

      {/* 생년월일 */}
      <div className="flex gap-2">
        <input
          type="text"
          name="birthYear"
          placeholder="년(4자)"
          value={formData.birthYear}
          onChange={handleChange}
          className="border h-[44px] w-[120px] rounded-lg bg-component px-4"
        />
        <select
          name="birthMonth"
          value={formData.birthMonth}
          onChange={handleChange}
          className="border h-[44px] w-[80px] rounded-lg bg-component"
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
          className="border h-[44px] w-[80px] rounded-lg bg-component px-4"
        />
      </div>

      {/* 성별 선택 */}
      <div className="flex gap-2">
        <button
          type="button"
          className="h-[44px] rounded-lg bg-sub px-4 text-white"
        >
          여성
        </button>
        <button type="button" className="h-[44px] rounded-lg bg-component px-4">
          남성
        </button>
        <button type="button" className="h-[44px] rounded-lg bg-component px-4">
          선택하지 않음
        </button>
      </div>

      {/* 이메일 인증 */}
      <div className="flex gap-2">
        <input
          type="email"
          name="email"
          placeholder="이메일"
          value={formData.email}
          onChange={handleChange}
          className="border h-[44px] flex-1 rounded-lg bg-component px-4"
        />
        <button type="button" className="h-[44px] rounded-lg bg-lightgray px-4">
          인증하기
        </button>
      </div>

      {/* 인증번호 */}
      <div className="flex gap-2">
        <input
          type="text"
          name="verificationCode"
          placeholder="인증 번호"
          value={formData.verificationCode}
          onChange={handleChange}
          className="border h-[44px] flex-1 rounded-lg bg-component px-4"
        />
        <button type="button" className="h-[44px] rounded-lg bg-lightgray px-4">
          확인
        </button>
      </div>

      {/* 회원가입 버튼 */}
      <button
        type="submit"
        className="mt-4 h-[52px] w-full rounded-lg bg-brand text-white"
      >
        Scentify 시작하기
      </button>
    </form>
  );
};

export default RegistForm;
