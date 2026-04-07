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
        primary: {
          DEFAULT: "#00113a",
          container: "#002366",
        },
        background: "#f8f9fb",
        surface: {
          DEFAULT: "#f8f9fb",
          container: {
            lowest: "#ffffff",
            low: "#f3f4f6",
            high: "#e7e8ea",
            highest: "#e1e2e4",
          },
        },
        "on-surface": {
          DEFAULT: "#191c1e",
          variant: "#444650",
        },
        tertiary: {
          container: "#003011",
          on: "#00a64b",
          fixed: "#66ff8e",
        },
        error: "#ba1a1a",
      },
      borderRadius: {
        md: "0.375rem", // 6px
      },
      spacing: {
        // Mapping a spacing scale of 3 if it means 3px increments
        // but typically it's a multiplier. I'll stick to a standard extend or custom if needed.
        // For now, I'll add a '3' scale for consistency with the doc if it implies 3px.
        // But I'll leave the default scale intact unless the user specifies more.
      },
    },
  },
  plugins: [],
};
export default config;
