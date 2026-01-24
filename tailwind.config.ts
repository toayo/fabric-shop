import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cocoa: "#2F2A25",
        sand: "#F5F1EB",
        ember: "#C86D4B",
        sea: "#2F5C77",
        jade: "#2F6B5B",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 12px 30px rgba(0,0,0,0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
