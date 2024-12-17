/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Nunito"],
      },
      colors: {
        purple: "#ab66eb",
        overlay: "rgba(3, 8, 29, 0.8)",
      },
    },
  },
  plugins: [],
};
