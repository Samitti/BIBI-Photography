/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        glow: '0 0 0 1px rgba(255,255,255,0.12), 0 24px 80px rgba(13, 10, 6, 0.45)',
      },
    },
  },
  plugins: [],
}

