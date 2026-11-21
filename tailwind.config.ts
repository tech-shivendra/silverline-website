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
        background: {
          primary: "#08090B",
          secondary: "#101216",
        },
        surface: {
          DEFAULT: "#171A20",
          elevated: "#20242B",
        },
        silver: {
          DEFAULT: "#C6C9CE",
          light: "#E1E3E6",
          dark: "#8F939B",
        },
        white: "#F5F5F5",
        muted: {
          DEFAULT: "#858B94",
          dark: "#5A606A",
        },
        accent: {
          blue: "#8DA8FF",
          blueDark: "#6384EC",
        },
        border: {
          DEFAULT: "#282C33",
          light: "#383E48",
        },
        status: {
          success: "#8EC7A5",
          error: "#E58B8B",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        heading: ["var(--font-space-grotesk)", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      animation: {
        "pulse-subtle": "pulseSubtle 3s ease-in-out infinite",
        "shimmer": "shimmer 2.5s linear infinite",
      },
      keyframes: {
        pulseSubtle: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
