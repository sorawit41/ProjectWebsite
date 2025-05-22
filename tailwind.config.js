/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class', // 👈 เพิ่มบรรทัดนี้
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'scale-in': 'scaleIn 0.3s ease-out forwards',
        'pulse-border': 'pulseBorder 2s infinite ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        pulseBorder: {
          '0%, 100%': { 'border-color': 'rgba(96, 165, 250, 1)' }, // blue-400
          '50%': { 'border-color': 'rgba(129, 140, 248, 1)' }, // indigo-400, สามารถเปลี่ยนเป็นสีอื่นที่คุณต้องการได้
        },
      },
    },
  },
  plugins: [],
};