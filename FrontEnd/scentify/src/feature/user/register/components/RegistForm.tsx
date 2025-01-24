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
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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
      className="w-full max-w-[360px] flex flex-col gap-2.5"
    >
      {/* 아이디 */}
      <div className="flex gap-2">
        <input
          type="text"
          name="id"
          value={formData.id}
          onChange={handleChange}
          placeholder="아이디"
          className="flex-1 h-[44px] px-4 border bg-component rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button type="button" className="h-[44px] px-4 bg-lightgray rounded-lg">
          중복 확인
        </button>
      </div>
      {errors.id && <p className="text-red-500 text-[12px]">{errors.id}</p>}

      {/* 닉네임 */}
      <input
        type="text"
        name="nickname"
        value={formData.nickname}
        onChange={handleChange}
        placeholder="닉네임"
        className="h-[44px] px-4 border bg-component rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* 비밀번호 */}
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="비밀번호"
        className="h-[44px] px-4 border bg-component rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* 비밀번호 확인 */}
      <input
        type="password"
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleChange}
        placeholder="비밀번호 확인"
        className="h-[44px] px-4 border bg-component rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {errors.confirmPassword && (
        <p className="text-red-500 text-[12px]">{errors.confirmPassword}</p>
      )}

      {/* 생년월일 */}
      <div className="flex gap-2">
        <input
          type="text"
          name="birthYear"
          placeholder="년(4자)"
          value={formData.birthYear}
          onChange={handleChange}
          className="w-[120px] h-[44px] px-4 border bg-component rounded-lg"
        />
        <select
          name="birthMonth"
          value={formData.birthMonth}
          onChange={handleChange}
          className="w-[80px] h-[44px] border bg-component rounded-lg"
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
          className="w-[80px] h-[44px] px-4 border bg-component rounded-lg"
        />
      </div>

      {/* 성별 선택 */}
      <div className="flex gap-2">
        <button
          type="button"
          className="h-[44px] px-4 bg-sub text-white rounded-lg"
        >
          여성
        </button>
        <button type="button" className="h-[44px] px-4 bg-component rounded-lg">
          남성
        </button>
        <button type="button" className="h-[44px] px-4 bg-component rounded-lg">
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
          className="flex-1 h-[44px] px-4 border bg-component rounded-lg"
        />
        <button type="button" className="h-[44px] px-4 bg-lightgray rounded-lg">
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
          className="flex-1 h-[44px] px-4 border bg-component rounded-lg"
        />
        <button type="button" className="h-[44px] px-4 bg-lightgray rounded-lg">
          확인
        </button>
      </div>

      {/* 회원가입 버튼 */}
      <button
        type="submit"
        className="w-full h-[52px] bg-brand text-white rounded-lg mt-4"
      >
        Scentify 시작하기
      </button>
    </form>
  );
};

export default RegistForm;
