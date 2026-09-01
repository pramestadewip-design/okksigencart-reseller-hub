import type { Config } from "tailwindcss";

// Token warna "Heritage Trust" — disetujui lewat design canvas (Direction A
// revisi + mockup Warranty & Terms). Maroon dalam di atas cream hangat.
const config: Config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#f7f1e6",
        "paper-raised": "#fffcf5",
        ink: "#2e1f1b",
        "ink-soft": "#6e5b52",
        "ink-faint": "#93857c",
        "ink-faint-2": "#a3948b",
        line: "#e8dfd0",
        "line-soft": "#efe7d9",
        maroon: {
          DEFAULT: "#7a2a38",
          dark: "#5c1f2a",
          tint: "#f2e1df",
        },
        gold: {
          DEFAULT: "#a97c3f",
          ink: "#7a5321",
          tint: "#f3e7d2",
        },
      },
      fontFamily: {
        display: ["var(--font-sora)", "Sora", "sans-serif"],
        body: ["var(--font-plus-jakarta)", "Plus Jakarta Sans", "sans-serif"],
        mono: ["var(--font-ibm-plex-mono)", "IBM Plex Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
