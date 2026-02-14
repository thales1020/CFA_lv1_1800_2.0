import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        prometric: {
          bg: "#F5F5F5",           // Nền chính xám nhạt
          "bg-alt": "#FFFFFF",     // Nền trắng cho panel
          navy: "#003366",         // Xanh navy header/primary
          "navy-dark": "#002244",  // Navy đậm cho hover
          yellow: "#FFFF99",       // Vàng highlight text
          "yellow-light": "#FFFFCC", // Vàng nhạt hơn
          border: "#CCCCCC",       // Xám border
          "border-dark": "#999999", // Border đậm
          text: "#333333",         // Text chính
          "text-secondary": "#666666", // Text phụ
          selected: "#E6F2FF",     // Nền khi chọn đáp án
          flagged: "#FFE5B4",      // Nền câu đã flag
        },
      },
      fontFamily: {
        sans: ["Arial", "Tahoma", "sans-serif"],
      },
      fontSize: {
        "prometric-sm": ["12px", { lineHeight: "18px" }],
        "prometric-base": ["14px", { lineHeight: "21px" }],
        "prometric-lg": ["16px", { lineHeight: "24px" }],
        "prometric-xl": ["18px", { lineHeight: "27px" }],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    function ({ addUtilities }: any) {
      addUtilities({
        ".no-select": {
          "-webkit-user-select": "none",
          "-moz-user-select": "none",
          "-ms-user-select": "none",
          "user-select": "none",
        },
        ".allow-select": {
          "-webkit-user-select": "text",
          "-moz-user-select": "text",
          "-ms-user-select": "text",
          "user-select": "text",
        },
      });
    },
  ],
};

export default config;
