/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
      'charcoal': {
        light: '#4A5063',
        DEFAULT: '#404654',
        dark: '#373C48',
      },
      'lavender': {
        100: '#968CC0',
        200: '#897EB2',
        300: '#7C70A3',
        400: '#706394',
        500: '#645684',
        600: '#564876',
        700: '#4E406D',
        800: '#453864',
        900: '#3E3359',
      },
      },
    },
  },
  plugins: [],
}