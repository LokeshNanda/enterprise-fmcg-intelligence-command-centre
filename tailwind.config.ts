import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0A0F1C",
        accent: "#00D4FF",
        "accent-blue": "#3B82F6",
        warning: "#F59E0B",
        critical: "#EF4444",
      },
      boxShadow: {
        glow: "0 0 20px rgba(0, 212, 255, 0.3)",
        "glow-sm": "0 0 10px rgba(0, 212, 255, 0.2)",
        "glow-warning": "0 0 20px rgba(245, 158, 11, 0.4)",
        "glow-critical": "0 0 20px rgba(239, 68, 68, 0.5)",
      },
      animation: {
        "pulse-slow": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
