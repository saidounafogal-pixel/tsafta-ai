/** @type {import('tailwindcss').Config} */
// Système de design Tsafta : indigo touareg, vert du fleuve Niger, or du mil.
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        indigo: { 950: "#121831", 900: "#1B2340", 800: "#263056", 700: "#34406E", 500: "#6672A3", 300: "#AEB5D2", 100: "#E3E6F1", 50: "#F1F2F8" },
        fleuve: { 800: "#134A3D", 700: "#185C4C", 600: "#1F6F5C", 500: "#2A8670", 100: "#D7ECE5", 50: "#EBF5F1" },
        mil: { 600: "#C9921F", 500: "#E8B04A", 300: "#F3D08F", 100: "#FBEFD6", 50: "#FDF7EA" },
        henne: { 600: "#9A3F2C", 100: "#F5E0DA" },
        brume: "#F1F2F5",
        encre: "#1B2340",
        gris: { 600: "#5B6378", 500: "#7A8196", 400: "#A2A8B8", 200: "#DDE0E8", 100: "#E9EBF1" },
      },
      fontFamily: {
        display: ["'Bricolage Grotesque'", "system-ui", "sans-serif"],
        sans: ["'Instrument Sans'", "system-ui", "sans-serif"],
      },
      borderRadius: { hero: "28px", carte: "20px", tuile: "14px" },
      boxShadow: {
        doux: "0 1px 2px rgba(27,35,64,.04), 0 8px 24px -12px rgba(27,35,64,.14)",
        haut: "0 2px 4px rgba(27,35,64,.06), 0 24px 48px -20px rgba(27,35,64,.35)",
        bouton: "0 1px 0 rgba(255,255,255,.15) inset, 0 8px 20px -8px rgba(31,111,92,.55)",
      },
      keyframes: {
        monter: { from: { transform: "translateY(100%)" }, to: { transform: "translateY(0)" } },
        fondu: { from: { opacity: "0" }, to: { opacity: "1" } },
        tourner: { to: { transform: "rotate(360deg)" } },
        balayer: { "0%": { top: "8%" }, "50%": { top: "88%" }, "100%": { top: "8%" } },
      },
      animation: {
        monter: "monter .32s cubic-bezier(.2,.8,.2,1)",
        fondu: "fondu .25s ease-out",
        tourner: "tourner 60s linear infinite",
        balayer: "balayer 1.8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
