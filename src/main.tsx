import React, { Component, type ReactNode } from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, MemoryRouter } from "react-router-dom";
import App from "./App";
import { FournisseurEtat } from "./store";
import "./index.css";

/* Filet de sécurité global : si toute l'application plante, on affiche l'erreur au lieu d'un écran vide. */
class Racine extends Component<{ children: ReactNode }, { erreur: string | null }> {
  state = { erreur: null as string | null };
  static getDerivedStateFromError(e: unknown) {
    return { erreur: e instanceof Error ? e.message : String(e) };
  }
  render() {
    if (!this.state.erreur) return this.props.children;
    return (
      <div style={{ padding: "64px 24px", fontFamily: "system-ui, sans-serif", color: "#EEF6F1", textAlign: "center" }}>
        <p style={{ fontSize: 20, fontWeight: 800 }}>Tsafta n'a pas pu afficher cet écran</p>
        <p style={{ marginTop: 10, fontSize: 14, color: "#8FA89C" }}>Détail technique : {this.state.erreur}</p>
        <button
          onClick={() => this.setState({ erreur: null })}
          style={{ marginTop: 24, height: 52, padding: "0 28px", borderRadius: 999, border: 0, fontWeight: 800, fontSize: 15, color: "#2A1300", background: "linear-gradient(180deg,#FFB547,#F26D0F)" }}
        >
          Réessayer
        </button>
      </div>
    );
  }
}

// L'aperçu en ligne (page unique) garde la navigation en mémoire.
const Routeur = import.meta.env.VITE_APERCU === "1" ? MemoryRouter : HashRouter;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Racine>
      <Routeur>
        <FournisseurEtat>
          <App />
        </FournisseurEtat>
      </Routeur>
    </Racine>
  </React.StrictMode>
);

// Installation PWA : enregistrement du service worker (hors développement).
if ("serviceWorker" in navigator && import.meta.env.PROD && import.meta.env.VITE_APERCU !== "1") {
  window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(() => {}));
}

// Dernier recours : une erreur hors de React qui laisserait la page vide affiche son message.
window.addEventListener("error", (ev) => {
  const racine = document.getElementById("root");
  if (racine && racine.childElementCount === 0) {
    racine.innerHTML = `<p style="padding:64px 24px;color:#EEF6F1;font:600 15px system-ui;text-align:center">Tsafta n'a pas pu démarrer.<br><small style="color:#8FA89C">${String(ev.message).replace(/</g, "&lt;")}</small></p>`;
  }
});
