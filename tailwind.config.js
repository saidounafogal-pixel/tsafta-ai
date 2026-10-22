/** @type {import('tailwindcss').Config} */
// Système de design Tsafta v2 : forêt profonde, verre dépoli, orange lumineux, menthe.
// Les noms historiques (indigo, fleuve, mil…) sont conservés et remappés sur la nouvelle palette.
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Surfaces sombres (anciennement indigo)
        indigo: {
          950: "#06140F", 900: "#0E2B21", 800: "#15392D", 700: "#D5EBDF", 500: "#2F6B57",
          300: "#9DB8AB", 100: "rgba(255,255,255,0.10)", 50: "rgba(255,255,255,0.06)",
        },
        // Verts (surfaces vertes et états positifs)
        fleuve: {
          800: "#0F3D2E", 700: "#145A42", 600: "#1E7A57", 500: "#2A9A6D",
          100: "rgba(69,224,160,0.16)", 50: "rgba(69,224,160,0.08)",
        },
        // Orange lumineux (anciennement or du mil)
        mil: { 600: "#FFB15C", 500: "#FF9A2E", 300: "#FFC56B", 100: "rgba(255,154,46,0.16)", 50: "rgba(255,154,46,0.08)" },
        henne: { 600: "#FF7A6B", 100: "rgba(255,122,107,0.16)" },
        menthe: { DEFAULT: "#45E0A0", fonce: "#0B3B2A" },
        verre: { DEFAULT: "rgba(255,255,255,0.065)", fort: "rgba(255,255,255,0.11)" },
        brume: "#081A13",
        encre: "#EEF6F1",
        gris: { 600: "#B4C7BD", 500: "#8FA89C", 400: "#6C877B", 200: "rgba(255,255,255,0.14)", 100: "rgba(255,255,255,0.08)" },
      },
      fontFamily: {
        display: ["'Plus Jakarta Sans'", "system-ui", "sans-serif"],
        sans: ["'Plus Jakarta Sans'", "system-ui", "sans-serif"],
      },
      borderRadius: { hero: "30px", carte: "24px", tuile: "16px" },
      boxShadow: {
        doux: "0 1px 0 rgba(255,255,255,0.06) inset, 0 12px 32px -16px rgba(0,0,0,0.6)",
        haut: "0 1px 0 rgba(255,255,255,0.08) inset, 0 24px 60px -20px rgba(0,0,0,0.75)",
        bouton: "0 1px 0 rgba(255,255,255,0.45) inset, 0 -2px 0 rgba(0,0,0,0.08) inset, 0 12px 28px -8px rgba(255,122,26,0.65)",
        menthe: "0 0 0 1px rgba(69,224,160,0.35), 0 8px 24px -8px rgba(69,224,160,0.45)",
      },
      keyframes: {
        monter: { from: { transform: "translateY(100%)" }, to: { transform: "translateY(0)" } },
        fondu: { from: { opacity: "0" }, to: { opacity: "1" } },
        tourner: { to: { transform: "rotate(360deg)" } },
        balayer: { "0%": { top: "12%" }, "50%": { top: "84%" }, "100%": { top: "12%" } },
        flotter: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-6px)" } },
      },
      animation: {
        monter: "monter .34s cubic-bezier(.2,.8,.2,1)",
        fondu: "fondu .25s ease-out",
        tourner: "tourner 60s linear infinite",
        balayer: "balayer 1.8s ease-in-out infinite",
        flotter: "flotter 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
