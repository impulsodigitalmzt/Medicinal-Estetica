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
        luxury: {
          bg: "#F7F5F0",
          card: "#EDE9E0",
          dark: "#2F3A2A",
          accent: "#5C6B4F",
          text: "#1F261C",
        },
      },
      fontFamily: {
        serif: ["var(--font-display)", "Cormorant Garamond", "serif"],
        sans: ["var(--font-sans)", "Outfit", "sans-serif"],
      },
      borderRadius: {
        serenity: "1.25rem",
        "serenity-lg": "1.5rem",
        pill: "9999px",
      },
      boxShadow: {
        serenity: "0 4px 24px -4px rgba(47, 58, 42, 0.08)",
        "serenity-lg": "0 8px 40px -8px rgba(47, 58, 42, 0.12)",
        float: "0 12px 48px -12px rgba(47, 58, 42, 0.15)",
      },
      animation: {
        marquee: "marquee 30s linear infinite",
        "brand-marquee": "brand-marquee 50s linear infinite",
        "brand-marquee-slow": "brand-marquee 65s linear infinite",
        "brand-marquee-ultra": "brand-marquee 85s linear infinite",
        "reviews-marquee": "reviews-marquee 140s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "brand-marquee": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "reviews-marquee": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
