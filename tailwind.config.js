/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        obsidian: '#080808',
        charcoal: '#111111',
        alabaster: '#F4F1EA',
        linen: '#FAF9F6',
        gold: {
          light: '#E5C896',
          DEFAULT: '#C7A46A',
          dark: '#9E7C49',
        },
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Cinzel', 'serif'],
        sculptural: ['Cinzel', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
