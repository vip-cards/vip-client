/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "*.html"],
  theme: {
    extend: {
      screens: {
        xs: "430px",
      },
      colors: {
        primary: "#fc7300",
        secondary: "#005247",
        warning: "#FFC700",
        danger: "#FF4136",
        success: "#00B894",
        info: "#0088FF",
        link: "#0066FF",
      },
    },
  },
  plugins: [require("tailwindcss-rtl"), require("@tailwindcss/typography")],
};
