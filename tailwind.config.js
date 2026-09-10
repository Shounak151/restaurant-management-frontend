/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#23241F",
        "ink-soft": "#3A3B34",
        paper: "#F7F2E7",
        "paper-dim": "#EFE8D8",
        gold: "#C79A3D",
        "gold-dark": "#A87F2C",
        herb: "#3F4A3A",
        "herb-dark": "#2C352A",
        brick: "#8C3B2E",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        sans: ["Work Sans", "sans-serif"],
      },
      boxShadow: {
        menu: "0 1px 0 rgba(35,36,31,0.08)",
      },
    },
  },
  plugins: [],
};
