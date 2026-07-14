/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        ocean: {
          50: '#eef4fb',
          100: '#d6e4f2',
          400: '#3d6a9c',
          600: '#1d3f66',
          700: '#152f4d',
          800: '#0e2138',
          900: '#081525',
        },
        treasure: {
          200: '#f7e3a1',
          400: '#f0c14b',
          500: '#e0a825',
          600: '#c48d1a',
        },
        parchment: {
          50: '#fdf8ec',
          100: '#f8ecce',
        },
        flagred: {
          500: '#c0392b',
          600: '#a5301f',
        },
      },
      fontFamily: {
        display: ['"Pirata One"', 'cursive'],
        body: ['"Nunito"', 'sans-serif'],
      },
      backgroundImage: {
        'map-texture': "radial-gradient(circle at 1px 1px, rgba(21,47,77,0.08) 1px, transparent 0)",
      },
      backgroundSize: {
        'map-grid': '18px 18px',
      },
    },
  },
  plugins: [],
}
