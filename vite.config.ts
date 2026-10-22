import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base "./" pour fonctionner sur GitHub Pages (sous-dossier /tsafta-ai/)
export default defineConfig({
  plugins: [react()],
  base: "./",
});
