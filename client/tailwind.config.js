/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}",],
  theme: {
    extend: {
      boxShadow: {
        'custom-dark': '-2px 2px 1px 1px #4c768d',
        'custom-light': '-2px 2px 1px 1px #88dded',
      },
    },
  },
  plugins: [],
}

