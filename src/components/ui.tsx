import { Component, useEffect, type ReactNode, type ButtonHTMLAttributes } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, X, Check, RotateCcw } from "lucide-react";
import { matiere, type MatiereId } from "../data/donnees";

/* Navigation par bouton (jamais de lien <a>) : fonctionne partout, y compris dans l'aperçu Claude. */
export function Aller({ vers, className = "", children, ...reste }: { vers: string; children: ReactNode } & ButtonHTMLAttributes<HTMLButtonElement>) {
  const nav = useNavigate();
  return (
    <button type="button" onClick={() => nav(vers)} className={`text-left ${className}`} {...reste}>
      {children}
    </button>
  );
}

/* En-tête de page. */
export function EnTete({ titre, sousTitre, retour, droite }: { titre: string; sousTitre?: string; retour?: boolean; droite?: ReactNode }) {
  const nav = useNavigate();
  return (
    <header className="sticky top-0 z-30 px-5 pb-4 pt-[max(20px,env(safe-area-inset-top))]" style={{ background: "linear-gradient(180deg, rgba(8,26,19,0.96) 70%, rgba(8,26,19,0))" }}>
      <div className="flex items-center gap-3">
        {retour && (
          <button onClick={() => nav(-1)} aria-label="Retour" className="verre grid h-11 w-11 shrink-0 place-items-center rounded-full">
            <ChevronLeft size={20} />
          </button>
        )}
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-[26px] font-extrabold leading-tight">{titre}</h1>
          {sousTitre && <p className="mt-0.5 truncate text-[14px] text-gris-500">{sousTitre}</p>}
        </div>
        {droite}
      </div>
    </header>
  );
}

export function PastilleMatiere({ id, taille = "md" }: { id: MatiereId; taille?: "sm" | "md" }) {
  const m = matiere(id);
  return (
    <span className={`puce ${taille === "sm" ? "px-2.5 py-0.5 text-[11px]" : ""}`} style={{ background: m.fond, color: m.teinte }}>
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: m.teinte, boxShadow: `0 0 8px ${m.teinte}` }} />
      {m.nom}
    </span>
  );
}

export function IconeMatiere({ id, taille = 48 }: { id: MatiereId; taille?: number }) {
  const m = matiere(id);
  return (
    <span
      className="grid shrink-0 place-items-center rounded-tuile"
      style={{ width: taille, height: taille, background: m.fond, boxShadow: `inset 0 0 0 1px ${m.teinte}33`, fontSize: taille * 0.46 }}
    >
      {m.emoji}
    </span>
  );
}

/* Feuille modale montant depuis le bas. */
export function Feuille({ ouvert, fermer, titre, children }: { ouvert: boolean; fermer: () => void; titre: string; children: ReactNode }) {
  useEffect(() => {
    if (!ouvert) return;
    const echap = (e: KeyboardEvent) => e.key === "Escape" && fermer();
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", echap);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", echap);
    };
  }, [ouvert, fermer]);
  if (!ouvert) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" role="dialog" aria-modal="true" aria-label={titre}>
      <button aria-label="Fermer" onClick={fermer} className="absolute inset-0 animate-fondu bg-black/60 backdrop-blur-[3px]" />
      <div
        className="relative max-h-[92vh] w-full max-w-md animate-monter overflow-y-auto rounded-t-hero border-t border-white/10 pb-[max(28px,env(safe-area-inset-bottom))]"
        style={{ background: "linear-gradient(180deg, #123528 0%, #0B2219 100%)" }}
      >
        <div className="sticky top-0 z-10 px-5 pb-3 pt-3" style={{ background: "linear-gradient(180deg, #123528 80%, rgba(18,53,40,0))" }}>
          <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-white/20" />
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-[21px] font-extrabold">{titre}</h2>
            <button onClick={fermer} aria-label="Fermer" className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-gris-600">
              <X size={18} />
            </button>
          </div>
        </div>
        <div className="px-5">{children}</div>
      </div>
    </div>
  );
}

export function Toast({ message, fermer }: { message: string | null; fermer: () => void }) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(fermer, 2800);
    return () => clearTimeout(t);
  }, [message, fermer]);
  if (!message) return null;
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-28 z-[60] flex justify-center px-5" role="status">
      <div className="verre flex animate-fondu items-center gap-2.5 rounded-full py-3 pl-3 pr-5 text-[14px] font-bold shadow-haut">
        <span className="grid h-6 w-6 place-items-center rounded-full bg-menthe text-menthe-fonce">
          <Check size={14} strokeWidth={3} />
        </span>
        {message}
      </div>
    </div>
  );
}

export function Filtres<T extends string>({ options, valeur, changer }: { options: { id: T; label: string }[]; valeur: T; changer: (v: T) => void }) {
  return (
    <div className="defile -mx-5" role="tablist">
      {options.map((o) => (
        <button key={o.id} role="tab" aria-selected={valeur === o.id} onClick={() => changer(o.id)} className={`filtre ${valeur === o.id ? "filtre-on" : "filtre-off"}`}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Segments<T extends string>({ options, valeur, changer }: { options: { id: T; label: string }[]; valeur: T; changer: (v: T) => void }) {
  return (
    <div className="verre grid rounded-full p-1" style={{ gridTemplateColumns: `repeat(${options.length}, 1fr)` }} role="tablist">
      {options.map((o) => (
        <button
          key={o.id}
          role="tab"
          aria-selected={valeur === o.id}
          onClick={() => changer(o.id)}
          className={`h-10 rounded-full text-[14px] font-bold transition ${valeur === o.id ? "bg-menthe text-menthe-fonce shadow-menthe" : "text-gris-500"}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function EtatVide({ icone, titre, texte, action }: { icone: ReactNode; titre: string; texte: string; action?: ReactNode }) {
  return (
    <div className="carte flex flex-col items-center px-6 py-10 text-center">
      <span className="mb-4 grid h-14 w-14 place-items-center rounded-full bg-menthe/15 text-menthe">{icone}</span>
      <p className="font-display text-[17px] font-bold">{titre}</p>
      <p className="mt-1 max-w-[260px] text-[14px] text-gris-500">{texte}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

/* Bulle de dialogue de la mascotte. */
export function Bulle({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative rounded-[20px] bg-[#F4FBF7] px-4 py-2.5 text-[13px] font-bold leading-snug text-[#0B2219] shadow-haut ${className}`}>
      {children}
      <span className="absolute -bottom-1.5 left-6 h-3 w-3 rotate-45 bg-[#F4FBF7]" />
    </div>
  );
}

/* Conservé pour compatibilité : lueur verte discrète à la place du motif tissé. */
export function MotifTisse({ id }: { id: string; opacite?: number }) {
  return (
    <span
      key={id}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{ background: "radial-gradient(80% 60% at 100% 0%, rgba(69,224,160,0.18), transparent 60%)" }}
    />
  );
}

/* Garde-fou : si un écran plante, on affiche un message et un bouton au lieu d'une page blanche. */
export class GardeFou extends Component<{ children: ReactNode }, { erreur: boolean }> {
  state = { erreur: false };
  static getDerivedStateFromError() {
    return { erreur: true };
  }
  componentDidCatch(e: unknown) {
    console.error("Tsafta :", e);
  }
  render() {
    if (!this.state.erreur) return this.props.children;
    return (
      <div className="px-5 pt-16">
        <div className="carte p-6 text-center">
          <p className="font-display text-[19px] font-bold">Cet écran n'a pas pu s'afficher</p>
          <p className="mt-2 text-[14px] text-gris-500">Revenez à l'accueil pour continuer. Vos données sont conservées.</p>
          <button
            className="btn-action mt-5 w-full"
            onClick={() => {
              this.setState({ erreur: false });
              window.dispatchEvent(new CustomEvent("tsafta:accueil"));
            }}
          >
            <RotateCcw size={18} /> Revenir à l'accueil
          </button>
        </div>
      </div>
    );
  }
}
