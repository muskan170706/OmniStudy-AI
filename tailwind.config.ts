import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "sans-serif"],
        display: ["var(--font-display)", "sans-serif"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      boxShadow: {
        "glass-sm": "inset 0 1px 0 0 rgba(255, 255, 255, 0.08), 0 4px 16px -2px rgba(0, 0, 0, 0.4)",
        "glass-md": "inset 0 1px 0 0 rgba(255, 255, 255, 0.1), 0 12px 32px -4px rgba(0, 0, 0, 0.5)",
        "glow-teal": "0 0 24px -4px rgba(45, 212, 191, 0.35)",
        "glow-violet": "0 0 24px -4px rgba(167, 139, 250, 0.35)",
        "glow-indigo": "0 0 24px -4px rgba(99, 102, 241, 0.35)",
      },
    },
  },
  plugins: [],
};

export default config;
