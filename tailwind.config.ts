import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0A1F44",
          light: "#132B5E",
          dark: "#071531",
        },
        blue: {
          DEFAULT: "#1E6FF8",
          light: "#4C8CFA",
          dark: "#1552C4",
        },
        gold: "#F5B700",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
