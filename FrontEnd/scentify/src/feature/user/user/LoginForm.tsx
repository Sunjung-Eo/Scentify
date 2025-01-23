import React from 'react';
import { useState } from 'react';
import { validateUsername, validatePassword } from '../../../utils/validation';

interface LoginFormProps {
    id: string;
    password: string;
    setId: (value: string) => void;
    setPassword: (value: string) => void;
    onLogin: () => void;  // 로그인 성공 시 실행될 함수
}

  
const LoginForm = ({ id, password, setId, setPassword, onLogin }: LoginFormProps) => {
    const [errors, setErrors] = useState<{ id?: string; password?: string }>({});

    const handleSubmit = (e: React.FormEvent) => {
        // 기본 폼 제출 동작을 막음 
        // 브라우저는 기본적으로 폼 제출하면 페이지 새로고침되거나 이동 
        e.preventDefault();

        // id, password 유효성 검사 
        const idError = validateUsername(id);
        const passwordError = validatePassword(password);

        if (idError || passwordError) {
            setErrors({ id: idError || undefined, password: passwordError || undefined });
            return;
        }

        // 로그인 함수 호출
        onLogin();
        console.log("로그인 시도", { id, password });
    };

    return (
        <div className="flex flex-col justify-center items-center bg-bg">
            <form onSubmit={handleSubmit} className="flex flex-col space-y-4 items-center">
                {/* 이메일 입력 칸 */}
                <input
                    type="id"
                    value={id}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setId(e.target.value)}
                    placeholder="아이디를 입력하세요"
                    className="w-[320px] h-[44px] px-4 border bg-component rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                 {errors.id && <p className="text-red-500">{errors.id}</p>}

                {/* 비밀번호 입력 칸 */}
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="비밀번호를 입력하세요"
                    className="w-[320px] h-[44px] px-4 border bg-component rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.password && <p className="text-red-500">{errors.password}</p>}

                {/* 로그인 버튼 */}
                <button
                    type="submit"
                    className="w-[320px] h-[44px] bg-brand text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    로그인하기
                </button>
            </form>
        </div>
    );
};

export default LoginForm;