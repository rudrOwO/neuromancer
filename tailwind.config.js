import theme from "./src/ui/constants/theme.js"

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/ui/**/*.svelte"],
  theme: {
    extend: {
      ...theme,
    },
  },
  plugins: [],
}
