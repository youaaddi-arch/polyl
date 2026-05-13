import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef4ff",
          100: "#dbe6ff",
          200: "#bfd2ff",
          300: "#93b3ff",
          400: "#608aff",
          500: "#3b66ff",
          600: "#2444f4",
          700: "#1e34dd",
          800: "#1e2eb0",
          900: "#1e2d8a",
        },
      },
    },
  },
  plugins: [],
};

export default config;
