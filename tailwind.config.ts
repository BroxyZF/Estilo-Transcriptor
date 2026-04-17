import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        paper: "var(--paper)",
        ink: "var(--ink)",
        rubric: "var(--rubric)",
        gold: "var(--gold)",
        muted: "var(--muted)",
        rule: "var(--rule)",
        "paper-sunk": "var(--paper-sunk)",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        "display-xl": ["clamp(3rem, 7vw, 5.25rem)", { lineHeight: "0.95", letterSpacing: "-0.02em" }],
        "display-lg": ["clamp(2.25rem, 4.5vw, 3.5rem)", { lineHeight: "1.02", letterSpacing: "-0.015em" }],
        "display-md": ["clamp(1.625rem, 2.5vw, 2.125rem)", { lineHeight: "1.15", letterSpacing: "-0.01em" }],
      },
      letterSpacing: {
        "smallcaps": "0.12em",
      },
      boxShadow: {
        "paper": "0 1px 0 var(--rule), 0 24px 48px -24px rgba(26, 22, 19, 0.18)",
      },
      keyframes: {
        "ink-in": {
          "0%":   { opacity: "0", filter: "blur(4px)", transform: "translateY(4px)" },
          "100%": { opacity: "1", filter: "blur(0)",   transform: "translateY(0)" },
        },
        "rise": {
          "0%":   { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "ink-in": "ink-in 520ms cubic-bezier(0.2, 0.6, 0.2, 1) both",
        "rise":   "rise 700ms cubic-bezier(0.2, 0.6, 0.2, 1) both",
      },
    },
  },
  plugins: [],
};

export default config;
