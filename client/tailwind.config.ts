import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1B2A4A",
          light: "#243b6b"
        },
        accent: "#F2B705"
      }
    }
  },
  darkMode: "class",
  plugins: []
} satisfies Config;
