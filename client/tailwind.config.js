/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        'ivory': {
          50: '#fefefe',
          100: '#fdfcf9',
          200: '#faf8f0',
          300: '#f5f0e0',
          400: '#ede4c7',
          500: '#e2d4a8',
          600: '#d4c085',
          700: '#c4a866',
          800: '#a88c4f',
          900: '#8b7242',
        }
      },
      fontFamily: {
        'sans': ['Noto Sans KR', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-in': 'bounceIn 0.6s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
  // 빌드 최적화를 위한 설정
  future: {
    hoverOnlyWhenSupported: true,
  },
} 