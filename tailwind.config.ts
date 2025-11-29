import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        skyline: {
          50: "#f1fbff",
          100: "#e1f4ff",
          200: "#bde6ff",
          300: "#8dd4ff",
          400: "#45b2ff",
          500: "#1893f1",
          600: "#0c73d8",
          700: "#0f5ab1",
          800: "#144a8c",
          900: "#163f74"
        }
      }
    }
  },
  plugins: []
};

export default config;
