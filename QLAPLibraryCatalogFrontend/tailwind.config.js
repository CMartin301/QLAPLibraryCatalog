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
        100: '#DEDBEB',
        200: '#A59CC9',
        300: '#897EB2',
        400: '#706394',
        500: '#4E406D',
        600: '#3E3359',
      },
      },
    },
  },
  plugins: [],
}