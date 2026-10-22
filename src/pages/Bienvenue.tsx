import { useState } from "react";
import { Recycle, Truck, Hammer, ShoppingBag, Check } from "lucide-react";
import Tsafti from "../components/Tsafti";
import { Bulle } from "../components/ui";
import { PROFILS, useEtat, type Profil } from "../store";

const ICONES: Record<Profil, typeof Recycle> = { citoyen: Recycle, collecteur: Truck, atelier: Hammer, acheteur: ShoppingBag };

export default function Bienvenue() {
  const { terminerBienvenue, changerProfil, changerNom, profil, nom } = useEtat();
  const [etape, setEtape] = useState(0);

  return (
    <div className="relative mx-auto flex min-h-screen max-w-md flex-col overflow-hidden" style={{ background: "#0B241B" }}>
      {/* Ciel de Niamey au coucher du soleil */}
      <div
        className="absolute inset-x-0 top-0 h-[62vh]"
        style={{ background: "radial-gradient(90% 70% at 50% 20%, #FFD27A 0%, #FFA53A 40%, #E2741E 62%, rgba(11,36,27,0) 100%)" }}
        aria-hidden="true"
      />
      
      <div className="relative flex flex-1 flex-col items-center px-6 pt-[max(48px,env(safe-area-inset-top))]">
        <Bulle className="animate-flotter">
          {etape === 0 ? "Salut ! Moi c'est Tsafti. Recyclons ensemble !" : "Dis-moi qui tu es !"}
        </Bulle>
        <Tsafti taille={230} className="mt-4 drop-shadow-[0_20px_30px_rgba(0,0,0,0.35)]" />
      </div>

      <div className="relative px-4 pb-[max(20px,env(safe-area-inset-bottom))]">
        <div className="carte rounded-hero p-6" style={{ background: "linear-gradient(160deg, rgba(40,80,62,0.75), rgba(14,40,31,0.85))" }}>
          {etape === 0 ? (
            <>
              <div className="flex items-center gap-2 text-menthe">
                <Recycle size={22} strokeWidth={2.4} />
                <span className="font-display text-[15px] font-extrabold tracking-[-0.02em]">Tsafta AI</span>
              </div>
              <h1 className="mt-3 text-[32px] font-extrabold leading-[1.05]">
                Vos déchets valent de l'or.
              </h1>
              <p className="mt-3 text-[15px] leading-relaxed text-gris-600">
                Faites collecter, apprenez à transformer, vendez vos produits. L'économie circulaire de Niamey dans votre poche.
              </p>
              <button className="btn-action mt-6 w-full" onClick={() => setEtape(1)}>Commencer</button>
              <button className="mt-3 w-full py-2 text-[14px] font-semibold text-gris-500" onClick={terminerBienvenue}>
                Explorer sans compte
              </button>
            </>
          ) : (
            <>
              <label className="etiquette" htmlFor="prenom">Votre prénom</label>
              <input id="prenom" className="champ" placeholder="Ex. Aïchatou" value={nom} onChange={(e) => changerNom(e.target.value)} />
              <p className="etiquette mt-5">Vous êtes</p>
              <div className="grid grid-cols-2 gap-2.5">
                {(Object.keys(PROFILS) as Profil[]).map((p) => {
                  const I = ICONES[p];
                  const on = profil === p;
                  return (
                    <button
                      key={p}
                      onClick={() => changerProfil(p)}
                      className={`relative flex flex-col items-start gap-3 rounded-tuile border p-3.5 text-left transition ${on ? "border-menthe/60 bg-menthe/10" : "border-white/10 bg-verre"}`}
                    >
                      <span className={`grid h-9 w-9 place-items-center rounded-full ${on ? "bg-menthe text-menthe-fonce" : "bg-white/10 text-gris-600"}`}>
                        <I size={18} />
                      </span>
                      <span className="text-[14px] font-bold">{PROFILS[p].nom}</span>
                      {on && <Check size={16} className="absolute right-3 top-3 text-menthe" strokeWidth={3} />}
                    </button>
                  );
                })}
              </div>
              <p className="mt-3 text-[13px] text-gris-500">{PROFILS[profil].role}</p>
              <button className="btn-action mt-5 w-full" onClick={terminerBienvenue}>C'est parti</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
