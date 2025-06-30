/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./public/**/*.{html,js}",
  ],
  theme: {
    extend: {
      maxWidth: {
        'md': '28rem', // Ensure max-w-md is 28rem (448px)
      },
    },
  },
  plugins: [],
}
