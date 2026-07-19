/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eef7f2",
          100: "#d6ecdf",
          500: "#1a7f5a",
          600: "#156b4b",
          700: "#10553c",
        },
        accent: "#f59e0b",
      },
    },
  },
  plugins: [],
};
