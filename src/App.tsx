import { NavLink, Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Home, Recycle, Store, GraduationCap, Route as IconeSuivi } from "lucide-react";
import Accueil from "./pages/Accueil";
import Collecte from "./pages/Collecte";
import Market from "./pages/Market";
import Apprendre from "./pages/Apprendre";
import Academy, { DetailFormation } from "./pages/Academy";
import Lab from "./pages/Lab";
import Equip from "./pages/Equip";
import Atelier from "./pages/Atelier";
import Suivi from "./pages/Suivi";

const ONGLETS = [
  { to: "/", label: "Accueil", icone: Home },
  { to: "/collecte", label: "Collecte", icone: Recycle },
  { to: "/market", label: "Market", icone: Store },
  { to: "/apprendre", label: "Apprendre", icone: GraduationCap },
  { to: "/suivi", label: "Suivi", icone: IconeSuivi },
];

export default function App() {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);

  return (
    <div className="mx-auto min-h-screen max-w-md pb-28">
      <Routes>
        <Route path="/" element={<Accueil />} />
        <Route path="/collecte" element={<Collecte />} />
        <Route path="/market" element={<Market />} />
        <Route path="/apprendre" element={<Apprendre />} />
        <Route path="/apprendre/academy" element={<Academy />} />
        <Route path="/apprendre/academy/:id" element={<DetailFormation />} />
        <Route path="/apprendre/lab" element={<Lab />} />
        <Route path="/apprendre/equip" element={<Equip />} />
        <Route path="/atelier" element={<Atelier />} />
        <Route path="/suivi" element={<Suivi />} />
        <Route path="*" element={<Accueil />} />
      </Routes>

      <nav className="fixed inset-x-0 bottom-0 z-40 px-4 pb-[max(12px,env(safe-area-inset-bottom))]" aria-label="Navigation principale">
        <ul className="mx-auto flex max-w-md items-center justify-between rounded-[24px] bg-indigo-900 px-2 py-2 shadow-haut">
          {ONGLETS.map(({ to, label, icone: Icone }) => (
            <li key={to} className="flex-1">
              <NavLink
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 rounded-[18px] py-2 text-[11px] font-semibold transition ${isActive ? "bg-white/10 text-mil-500" : "text-indigo-300"}`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icone size={21} strokeWidth={isActive ? 2.3 : 1.8} />
                    {label}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
