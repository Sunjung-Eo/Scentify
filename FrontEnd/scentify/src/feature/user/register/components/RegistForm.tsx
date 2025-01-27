import React, { useState, FormEvent } from 'react';
import {
  handleChange,
  handleGenderSelect,
  handleSubmit,
  handleCheckDuplicate,
  handleGetEmailCode,
  handleEmailVerification,
} from '../../../../utils/register/registFormHandler';

const RegistForm = ({ onRegist }: { onRegist: () => void }) => {
  // FormData 객체 생성
  const [formData, setFormData] = useState(new FormData());
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const inputStyles =
    'border h-9 flex-1 rounded-lg bg-component px-4 focus:outline-none focus:ring-2 focus:ring-brand';

  const miniBtnStyles =
    'h-9 px-4 rounded-lg border-0.5 focus:outline-none focus:ring-2 focus:ring-brand';

  return (
    <form
      id="registForm"
      onSubmit={(e) => {
        setErrors({}); // 에러 초기화
        handleSubmit(e, setErrors, onRegist);
      }}
      className="flex w-full max-w-[360px] flex-col gap-3 font-pre-light text-12"
    >
      {/* 아이디 */}
      <div className="flex items-center gap-2 ">
        <label htmlFor="id">아이디</label>
        <input
          id="id"
          type="text"
          name="id"
          onChange={(e) => handleChange(e, formData, setFormData)}
          placeholder="아이디"
          className={inputStyles}
        />
        <button
          type="button"
          className={miniBtnStyles}
          onClick={() => {
            const id = formData.get('id') as string;
            if (id) {
              handleCheckDuplicate(id, setErrors);
            } else {
              setErrors((prev) => ({ ...prev, id: '아이디를 입력해주세요.' }));
            }
          }}
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
          onChange={(e) => handleChange(e, formData, setFormData)}
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
          onChange={(e) => handleChange(e, formData, setFormData)}
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
          onChange={(e) => handleChange(e, formData, setFormData)}
          placeholder="비밀번호 확인"
          className={inputStyles}
        />
      </div>
      {errors.confirmPassword && (
        <p className="text-[12px] text-red-500">{errors.confirmPassword}</p>
      )}

      {/* 생년월일 */}
      <fieldset id="birth" className="flex items-center gap-2">
        <legend className="flex text-12">생년월일</legend>

        <input
          id="birthYear"
          type="text"
          name="birthYear"
          placeholder="년(4자)"
          maxLength={4}
          onChange={(e) => handleChange(e, formData, setFormData)}
          className="border h-9 w-[80px] rounded-lg bg-component px-4 focus:outline-none focus:ring-2 focus:ring-brand"
        />
        <select
          id="birthMonth"
          name="birthMonth"
          onChange={(e) => handleChange(e, formData, setFormData)}
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
          id="birthDay"
          type="text"
          name="birthDay"
          placeholder="일"
          maxLength={2}
          onChange={(e) => handleChange(e, formData, setFormData)}
          className="border h-9 w-[80px] rounded-lg bg-component px-4 focus:outline-none focus:ring-2 focus:ring-brand"
        />
      </fieldset>

      {/* 성별 선택 */}
      <div className="flex items-center gap-2">
        <p className="">성별</p>
        {[
          { label: '남성', value: '0' },
          { label: '여성', value: '1' },
          { label: '선택하지 않음', value: '2' },
        ].map((gender) => (
          <button
            key={gender.value}
            type="button"
            onClick={() =>
              handleGenderSelect(gender.value, formData, setFormData)
            }
            className={`h-9 rounded-lg px-4 border-brand border-0.5 ${
              formData.get('gender') === gender.value
                ? 'bg-sub text-white'
                : 'bg-bg'
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
          placeholder="이메일"
          onChange={(e) => handleChange(e, formData, setFormData)}
          className="border h-9 flex-1 rounded-lg bg-component px-4 focus:outline-none focus:ring-2 focus:ring-brand"
        />
        <button
          type="button"
          className={miniBtnStyles}
          onClick={() => {
            const email = formData.get('email') as string;
            if (email) {
              handleGetEmailCode(email, setErrors);
            } else {
              setErrors((prev) => ({
                ...prev,
                email: '이메일을 입력해주세요.',
              }));
            }
          }}
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
          placeholder="인증 번호"
          onChange={(e) => handleChange(e, formData, setFormData)}
          className="border h-9 flex-1 rounded-lg bg-component px-4 focus:outline-none focus:ring-2 focus:ring-brand"
        />
        <button
          type="button"
          className={miniBtnStyles}
          onClick={() => {
            const code = formData.get('verificationCode') as string;
            console.log(code);
            if (code) {
              handleEmailVerification(code, setErrors);
            } else {
              setErrors((prev) => ({
                ...prev,
                verificationCode: '인증번호를 입력해주세요.',
              }));
            }
          }}
        >
          확인
        </button>
      </div>
      {errors.verificationCode && (
        <p className="text-[12px] text-red-500">{errors.verificationCode}</p>
      )}
    </form>
  );
};

export default RegistForm;
