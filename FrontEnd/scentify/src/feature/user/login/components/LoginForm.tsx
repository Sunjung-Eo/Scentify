import React from 'react';
import { useState } from 'react';
import { validateId, validatePassword } from '../../../../utils/validation';

interface LoginFormProps {
  id: string;
  password: string;
  setId: (value: string) => void;
  setPassword: (value: string) => void;
  onLogin: () => void; // 로그인 성공 시 실행될 함수
}

const LoginForm = ({
  id,
  password,
  setId,
  setPassword,
  onLogin,
}: LoginFormProps) => {
  const [errors, setErrors] = useState<{ id?: string; password?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    // 기본 폼 제출 동작을 막음
    // 브라우저는 기본적으로 폼 제출하면 페이지 새로고침되거나 이동
    e.preventDefault();

    // id, password 유효성 검사
    const idError = validateId(id);
    const passwordError = validatePassword(password);

    if (idError || passwordError) {
      setErrors({
        id: idError || undefined,
        password: passwordError || undefined,
      });
      return;
    }

    // 로그인 함수 호출
    onLogin();
    console.log('로그인 시도', { id, password });
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-[320px] flex-col items-center gap-2.5 font-pre-light"
      >
        {/* 이메일 입력 칸 */}
        <input
          type="id"
          value={id}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setId(e.target.value)
          }
          placeholder="아이디를 입력하세요"
          className="h-[44px] w-[320px] rounded-lg border-0.2 bg-component px-4 focus:outline-none focus:ring-2 focus:ring-brand"
        />
        <div className="justify-start-item flex w-full flex-col">
          {errors.id && <p className="text-[12px] text-red-500">{errors.id}</p>}
        </div>

        {/* 비밀번호 입력 칸 */}
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호를 입력하세요"
          className="h-[44px] w-[320px] rounded-lg border-0.5 bg-component px-4 focus:outline-none focus:ring-2 focus:ring-brand"
        />
        <div className="justify-start-item flex w-full flex-col">
          {errors.password && (
            <p className="text-[12px] text-red-500">{errors.password}</p>
          )}
        </div>

        {/* 로그인 버튼 */}
        <button
          type="submit"
          className="h-[44px] w-[320px] rounded-lg bg-brand text-white hover:bg-sub focus:outline-none"
        >
          로그인하기
        </button>
      </form>
    </>
  );
};

export default LoginForm;
