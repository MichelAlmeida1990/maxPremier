/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'maxpremier': {
          'blue-dark': '#031f5f',
          'blue-bright': '#00afee',
          'pink': '#ca00ca',
          'brown': '#c2af00',
          'yellow-green': '#ccff00',
          'black': '#000000',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

