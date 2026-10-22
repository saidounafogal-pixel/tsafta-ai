import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, MemoryRouter } from "react-router-dom";
import App from "./App";
import { FournisseurEtat } from "./store";
import "./index.css";

// L'aperçu en ligne (page unique) garde la navigation en mémoire.
const Routeur = import.meta.env.VITE_APERCU === "1" ? MemoryRouter : HashRouter;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Routeur>
      <FournisseurEtat>
        <App />
      </FournisseurEtat>
    </Routeur>
  </React.StrictMode>
);

// Installation PWA : enregistrement du service worker (hors développement).
if ("serviceWorker" in navigator && import.meta.env.PROD && import.meta.env.VITE_APERCU !== "1") {
  window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(() => {}));
}
