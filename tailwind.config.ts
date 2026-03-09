import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./store/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        surface: "var(--surface)",
        "surface-elevated": "var(--surface-elevated)",
        border: "var(--border)",
        "border-muted": "var(--border-muted)",
        foreground: "var(--text-primary)",
        muted: "var(--text-muted)",
        accent: "var(--accent)",
        success: "var(--success)",
        warning: "var(--warning)",
        destructive: "var(--destructive)"
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)"
      },
      fontFamily: {
        display: ["var(--font-display)"],
        sans: ["var(--font-body)"]
      },
      backgroundImage: {
        "soft-grid": "radial-gradient(circle at 1px 1px, rgba(26,25,23,0.06) 1px, transparent 0)"
      }
    }
  },
  plugins: []
};

export default config;
