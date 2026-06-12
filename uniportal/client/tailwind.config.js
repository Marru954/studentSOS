/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', "system-ui", "sans-serif"],
      },
      colors: {
        accent: "#5a6b9e",
      },
    },
  },
  plugins: [],
};
