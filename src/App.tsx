import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Home, Store, GraduationCap, BarChart3, ScanLine } from "lucide-react";
import Accueil from "./pages/Accueil";
import Collecte from "./pages/Collecte";
import Market from "./pages/Market";
import Apprendre from "./pages/Apprendre";
import Academy, { DetailFormation } from "./pages/Academy";
import Lab from "./pages/Lab";
import Equip from "./pages/Equip";
import Atelier from "./pages/Atelier";
import Suivi from "./pages/Suivi";
import Bienvenue from "./pages/Bienvenue";
import Bibliotheque from "./pages/Bibliotheque";
import { GardeFou } from "./components/ui";
import { useEtat } from "./store";

const ONGLETS = [
  { to: "/", label: "Accueil", icone: Home },
  { to: "/market", label: "Market", icone: Store },
  null, // emplacement du bouton central
  { to: "/apprendre", label: "Apprendre", icone: GraduationCap },
  { to: "/suivi", label: "Suivi", icone: BarChart3 },
];

function actif(pathname: string, to: string) {
  return to === "/" ? pathname === "/" : pathname.startsWith(to) || (to === "/apprendre" && pathname.startsWith("/atelier"));
}

function Navigation() {
  const { pathname } = useLocation();
  const nav = useNavigate();
  const scan = pathname.startsWith("/collecte");
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 px-4 pb-[max(14px,env(safe-area-inset-bottom))]" aria-label="Navigation principale">
      <div className="relative mx-auto max-w-md">
        <ul
          className="flex h-[72px] items-center justify-between rounded-full border border-white/10 px-3 shadow-haut"
          style={{ background: "linear-gradient(180deg, #1C3E31, #0E281F)" }}
        >
          {ONGLETS.map((o, i) =>
            o ? (
              <li key={o.to} className="flex-1">
                <button
                  onClick={() => nav(o.to)}
                  aria-current={actif(pathname, o.to) ? "page" : undefined}
                  className={`mx-auto flex flex-col items-center gap-1 text-[11px] font-bold transition ${actif(pathname, o.to) ? "text-menthe" : "text-gris-400"}`}
                >
                  <o.icone size={22} strokeWidth={actif(pathname, o.to) ? 2.4 : 1.8} />
                  <span>{o.label}</span>
                  <span className={`h-1 w-1 rounded-full ${actif(pathname, o.to) ? "bg-menthe shadow-[0_0_8px_#45E0A0]" : "bg-transparent"}`} />
                </button>
              </li>
            ) : (
              <li key={`fab-${i}`} className="w-[76px] shrink-0" aria-hidden="true" />
            )
          )}
        </ul>
        {/* Bouton central : scanner ses déchets */}
        <button
          onClick={() => nav("/collecte")}
          aria-label="Scanner mes déchets"
          className="absolute -top-5 left-1/2 grid h-[68px] w-[68px] -translate-x-1/2 place-items-center rounded-full text-[#2A1300] transition active:scale-95"
          style={{
            background: "linear-gradient(180deg, #FFB547 0%, #FF8A1F 55%, #F26D0F 100%)",
            boxShadow: `0 0 0 6px #0B241B, 0 0 0 7px rgba(255,255,255,0.08), 0 14px 30px -6px rgba(255,122,26,${scan ? 0.9 : 0.6})`,
          }}
        >
          <ScanLine size={28} strokeWidth={2.4} />
        </button>
      </div>
    </nav>
  );
}

export default function App() {
  const { pathname } = useLocation();
  const nav = useNavigate();
  const { bienvenueVue } = useEtat();
  const [garde, setGarde] = useState(0);

  // Remonter en haut à chaque changement d'écran. Bloc explicite : un effet ne doit rien renvoyer
  // (certains navigateurs intégrés renvoient une valeur depuis scrollTo, que React prendrait pour un nettoyage).
  useEffect(() => {
    try {
      window.scrollTo(0, 0);
    } catch {
      document.documentElement.scrollTop = 0;
    }
  }, [pathname]);
  useEffect(() => {
    const retour = () => {
      nav("/");
      setGarde((g) => g + 1);
    };
    window.addEventListener("tsafta:accueil", retour);
    return () => window.removeEventListener("tsafta:accueil", retour);
  }, [nav]);

  if (!bienvenueVue) return <Bienvenue />;

  return (
    <div className="mx-auto min-h-screen max-w-md pb-32">
      <GardeFou key={`${pathname}-${garde}`}>
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/collecte" element={<Collecte />} />
          <Route path="/market" element={<Market />} />
          <Route path="/apprendre" element={<Apprendre />} />
          <Route path="/apprendre/academy" element={<Academy />} />
          <Route path="/apprendre/academy/:id" element={<DetailFormation />} />
          <Route path="/apprendre/bibliotheque" element={<Bibliotheque />} />
          <Route path="/apprendre/lab" element={<Lab />} />
          <Route path="/apprendre/equip" element={<Equip />} />
          <Route path="/atelier" element={<Atelier />} />
          <Route path="/suivi" element={<Suivi />} />
          <Route path="*" element={<Accueil />} />
        </Routes>
      </GardeFou>
      <Navigation />
    </div>
  );
}
