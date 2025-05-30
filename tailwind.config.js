/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      // เพิ่ม fontFamily ที่นี่
      fontFamily: {
        sans: ['Kanit', 'sans-serif'], // ตั้ง Kanit เป็นฟอนต์ sans-serif หลัก
        // คุณสามารถเพิ่มชื่อฟอนต์อื่นๆ ได้ถ้าต้องการ เช่น
        // kanit: ['Kanit', 'sans-serif'], // เพื่อใช้คลาส font-kanit โดยตรง
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
          '50%': { 'border-color': 'rgba(129, 140, 248, 1)' }, // indigo-400
        },
        playerJump: {
          '0%': { transform: 'translateY(0) scaleY(1)', animationTimingFunction: 'ease-out' },
          '20%': { transform: 'translateY(0) scaleY(0.9) scaleX(1.05)', animationTimingFunction: 'ease-in-out' },
          '50%': { transform: 'translateY(-100px) scaleY(1.05) scaleX(0.95)', animationTimingFunction: 'ease-in' },
          '80%': { transform: 'translateY(0) scaleY(0.9) scaleX(1.05)', animationTimingFunction: 'ease-in-out' },
          '100%': { transform: 'translateY(0) scaleY(1) scaleX(1)', animationTimingFunction: 'ease-out' },
        },
        runningBob: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        collectibleShine: {
          '0%, 100%': { opacity: '0.8', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.08)' },
        },
        obstacleAppear: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '70%': { transform: 'translateX(-10px)', opacity: '1' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        screenShake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-5px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(5px)' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'scale-in': 'scaleIn 0.3s ease-out forwards',
        'pulse-border': 'pulseBorder 2s infinite ease-in-out',
        'player-jump': 'playerJump 0.5s ease-out',
        'running-bob': 'runningBob 0.3s infinite ease-in-out alternate',
        'collectible-shine': 'collectibleShine 1.5s infinite ease-in-out',
        'obstacle-appear': 'obstacleAppear 0.5s ease-out forwards',
        'screen-shake': 'screenShake 0.3s linear',
      },
    },
  },
  plugins: [],
};