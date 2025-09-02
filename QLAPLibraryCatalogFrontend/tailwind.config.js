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
        100: '#A59CC9',
        200: '#897EB2',
        300: '#706394',
        400: '#4E406D',
        500: '#3E3359',
      },
      },
    },
  },
  plugins: [],
}