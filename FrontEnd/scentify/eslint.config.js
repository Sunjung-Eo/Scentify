import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import prettier from "eslint-plugin-prettier";
import tailwindcss from "eslint-plugin-tailwindcss";

export default [
  // 무시할 디렉토리 설정
  {
    ignores: ["dist", "node_modules"],
  },

  // 기본 ESLint 추천 설정 및 플러그인 설정 적용
  js.configs.recommended,
  ...tseslint.configs.recommended,

  // Prettier 및 TailwindCSS 설정 적용
  {
    plugins: {
      prettier,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      tailwindcss,
    },
    extends: ["eslint:recommended", "plugin:prettier/recommended"], // ✅ Prettier 설정 추가
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      indent: ["error", 2], // 들여쓰기 2 스페이스 적용
      "tailwindcss/classnames-order": "warn", // Tailwind 클래스 정렬 경고
      "tailwindcss/no-custom-classname": "off", // 사용자 정의 클래스 허용
      "prettier/prettier": [
        "error",
        { singleQuote: true, semi: true, tabWidth: 2 },
      ],
      "no-unused-vars": "off", // 기본 ESLint의 no-unused-vars 규칙 끄기
      "@typescript-eslint/no-unused-vars": "warn", // TypeScript 변수 미사용 경고
    },
  },
];
