export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#FAFAFA",
        brand: "#6B705C",
        sub: "#2D3319",
        component: "#EBEAE5",
        black: "#000000",
        gray: "#888888",
        lightgray: "#BEBEBE",
        point: "#EE9D7F",
        lemon: "#F6EABF",
        eucalyptus: "#D4E3CD",
        peppermint: "#C9ECD6",
        lavender: "#C0B7CA",
        cedarwood: "#ADAB99",
        chamomile: "#F9EBD0",
        sandalwood: "#9D958E",
        whitemusk: "#FFFFFF",
        orangeblossom: "#F6D5BF",
      },
      borderColor: {
        point: "#EE9D7F", // point 색상을 border color로 추가
      },
    },
    fontFamily: {
      "pre-bold": ["Pretendard-Bold", "sans-serif"],
      "pre-medium": ["Pretendard-Medium", "sans-serif"],
      "pre-regular": ["Pretendard-Regular", "sans-serif"],
      "pre-light": ["Pretendard-Light", "sans-serif"],
    },
    fontSize: {
      10: "10px", // 10px
      12: "12px", // 12px
      16: "16px", // 16px
      14: "14px", // 14px
      20: "20px", // 20px
      24: "24px", // 24px
    },
    borderWidth: {
      0.2: "0.2px",
      0.5: "0.5px",
    },
  },
  plugins: [],
};
