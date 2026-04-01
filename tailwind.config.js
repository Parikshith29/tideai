/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        comic: ['"Bangers"', 'cursive'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        neo: '4px 4px 0px 0px #0f172a',
        'neo-sm': '2px 2px 0px 0px #0f172a',
        'neo-lg': '8px 8px 0px 0px #0f172a',
      },
      keyframes: {
        jitter: {
          '0%,100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-2deg)' },
          '75%': { transform: 'rotate(2deg)' },
        },
      },
      animation: {
        jitter: 'jitter 0.2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
