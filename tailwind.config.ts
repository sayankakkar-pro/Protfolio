import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: "#0C0C0C",
        lightText: "#D7E2EA",
      },
      fontFamily: {
        sans: ["'Kanit'", "sans-serif"],
        kanit: ["'Kanit'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
