export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend:  {
      colors: {
        'bg': '#FAFAFA',
        'brand': '#6B705C',
        'sub': '#2D3319',
        'component': '#EBEAE5',
        'black': '#000000',
        'gray': '#888888',
        'lightgray': '#BEBEBE'
      }
    },
    fontFamily: {
      'pre-bold': ['Pretendard-Bold', 'sans-serif'],
      'pre-medium': ['Pretendard-Medium', 'sans-serif'],
      'pre-regular': ['Pretendard-Regular', 'sans-serif'],
      'pre-light': ['Pretendard-Light', 'sans-serif']
    }
  },
  plugins: [],
};
