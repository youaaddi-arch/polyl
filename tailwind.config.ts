import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Palette HubSpot officielle
        hubspot: {
          orange: "#FF7A59",
          "orange-hover": "#FF8F73",
          "orange-dark": "#E66348",
          navy: "#2E3A4F",
          "navy-dark": "#213343",
          "navy-light": "#33475B",
          teal: "#00BDA5",
          bg: "#F5F8FA",
          "bg-alt": "#EAF0F6",
          border: "#CBD6E2",
          text: "#33475B",
          "text-secondary": "#516F90",
          "text-muted": "#7C98B6",
        },
        brand: {
          50: "#FFF1EC",
          100: "#FFE0D5",
          200: "#FFC2AC",
          300: "#FFA383",
          400: "#FF8F73",
          500: "#FF7A59",
          600: "#E66348",
          700: "#CC5237",
          800: "#A6402B",
          900: "#7F2F1F",
        },
      },
      boxShadow: {
        hs: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
        "hs-lg": "0 4px 16px rgba(0,0,0,0.08)",
        "hs-dropdown": "0 8px 24px rgba(0,0,0,0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
