export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#FAFAFA',
        brand: '#6B705C',
        sub: '#2D3319',
        component: '#EBEAE5',
        black: '#000000',
        gray: '#888888',
        lightgray: '#BEBEBE',
        point: '#EE9D7F',
        lemon: '#FFE99F',
        eucalyptus: '#C9E4BC',
        peppermint: '#B8E0D7',
        lavender: '#C0B7CA',
        cedarwood: '#B5A488',
        chamomile: '#EFD4D4',
        sandalwood: '#716A64',
        whitemusk: '#FFFFFF',
        orangeblossom: '#F8C8A8',
      },
      borderColor: {
        point: '#EE9D7F', // point 색상을 border color로 추가
      },
    },
    fontFamily: {
      'pre-bold': ['Pretendard-Bold', 'sans-serif'],
      'pre-medium': ['Pretendard-Medium', 'sans-serif'],
      'pre-regular': ['Pretendard-Regular', 'sans-serif'],
      'pre-light': ['Pretendard-Light', 'sans-serif'],
      'poppins-thin': ['Poppins-Thin', 'sans-serif'],
      'poppins-light': ['Poppins-Light', 'sans-serif'], // Poppins-Light로 수정
    },
    fontSize: {
      10: '10px', // 10px
      12: '12px', // 12px
      16: '16px', // 16px
      14: '14px', // 14px
      20: '20px', // 20px
      24: '24px', // 24px
    },
    borderWidth: {
      0.2: '0.2px',
      0.5: '0.5px',
    },
  },
  plugins: [],
};
