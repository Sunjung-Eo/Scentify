import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [react(), svgr()],
  css: {
    postcss: {
      plugins: [tailwindcss(), autoprefixer()],
    },
  },
  server: {
    proxy: {
      '/v1': {
        // 백엔드 API 엔드포인트 프록시 설정
        target: 'http://localhost:8080', // 백엔드 서버의 주소
        changeOrigin: true, // 원본 호스트 헤더를 변경
        // secure: false, // HTTPS가 아닌 경우 false 설정
        rewrite: (path) => path.replace(/^\/v1/, '/v1'), // 경로 유지
      },
    },
  },
});
