/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      screens: {
        xs: "430px",
      },
      colors: {
        primary: "#fc7300",
        secondary: "#005247",
      },
    },
  },
  plugins: [
    require("tailwindcss-rtl"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/line-clamp"),
  ],
};
