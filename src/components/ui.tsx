import { useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, X, Check } from "lucide-react";
import { matiere, type MatiereId } from "../data/donnees";

/* En-tête de page : titre en Bricolage, retour optionnel, action à droite. */
export function EnTete({ titre, sousTitre, retour, droite }: { titre: string; sousTitre?: string; retour?: boolean; droite?: ReactNode }) {
  const nav = useNavigate();
  return (
    <header className="sticky top-0 z-30 bg-brume/90 px-5 pb-4 pt-[max(20px,env(safe-area-inset-top))] backdrop-blur-xl">
      <div className="flex items-center gap-3">
        {retour && (
          <button onClick={() => nav(-1)} aria-label="Retour" className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white shadow-doux">
            <ChevronLeft size={20} />
          </button>
        )}
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-[26px] font-bold leading-tight">{titre}</h1>
          {sousTitre && <p className="mt-0.5 truncate text-[14px] text-gris-500">{sousTitre}</p>}
        </div>
        {droite}
      </div>
    </header>
  );
}

/* Pastille de matière : la teinte de la matière sur son fond assorti. */
export function PastilleMatiere({ id, taille = "md" }: { id: MatiereId; taille?: "sm" | "md" }) {
  const m = matiere(id);
  return (
    <span className={`puce ${taille === "sm" ? "px-2.5 py-0.5 text-[11px]" : ""}`} style={{ background: m.fond, color: m.teinte }}>
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: m.teinte }} />
      {m.nom}
    </span>
  );
}

/* Carré d'icône de matière. */
export function IconeMatiere({ id, taille = 48 }: { id: MatiereId; taille?: number }) {
  const m = matiere(id);
  return (
    <span className="grid shrink-0 place-items-center rounded-tuile" style={{ width: taille, height: taille, background: m.fond, fontSize: taille * 0.46 }}>
      {m.emoji}
    </span>
  );
}

/* Feuille modale qui monte depuis le bas, adaptée au pouce. */
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
      <button aria-label="Fermer" onClick={fermer} className="absolute inset-0 animate-fondu bg-indigo-950/50 backdrop-blur-[2px]" />
      <div className="relative max-h-[92vh] w-full max-w-md animate-monter overflow-y-auto rounded-t-hero bg-white pb-[max(24px,env(safe-area-inset-bottom))]">
        <div className="sticky top-0 z-10 bg-white px-5 pb-3 pt-3">
          <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-gris-200" />
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-[21px] font-bold">{titre}</h2>
            <button onClick={fermer} aria-label="Fermer" className="grid h-9 w-9 place-items-center rounded-full bg-brume text-gris-600">
              <X size={18} />
            </button>
          </div>
        </div>
        <div className="px-5">{children}</div>
      </div>
    </div>
  );
}

/* Confirmation discrète en bas d'écran. */
export function Toast({ message, fermer }: { message: string | null; fermer: () => void }) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(fermer, 2800);
    return () => clearTimeout(t);
  }, [message, fermer]);
  if (!message) return null;
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-[60] flex justify-center px-5" role="status">
      <div className="flex animate-fondu items-center gap-2.5 rounded-full bg-indigo-900 py-3 pl-3 pr-5 text-[14px] font-semibold text-white shadow-haut">
        <span className="grid h-6 w-6 place-items-center rounded-full bg-mil-500 text-indigo-950">
          <Check size={14} strokeWidth={3} />
        </span>
        {message}
      </div>
    </div>
  );
}

/* Barre de filtres horizontale. */
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

/* Sélecteur segmenté (2 à 3 vues). */
export function Segments<T extends string>({ options, valeur, changer }: { options: { id: T; label: string }[]; valeur: T; changer: (v: T) => void }) {
  return (
    <div className="grid rounded-tuile bg-indigo-100 p-1" style={{ gridTemplateColumns: `repeat(${options.length}, 1fr)` }} role="tablist">
      {options.map((o) => (
        <button
          key={o.id}
          role="tab"
          aria-selected={valeur === o.id}
          onClick={() => changer(o.id)}
          className={`h-10 rounded-[10px] text-[14px] font-semibold transition ${valeur === o.id ? "bg-white text-indigo-900 shadow-doux" : "text-gris-500"}`}
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
      <span className="mb-4 grid h-14 w-14 place-items-center rounded-full bg-indigo-50 text-indigo-700">{icone}</span>
      <p className="font-display text-[17px] font-bold">{titre}</p>
      <p className="mt-1 max-w-[260px] text-[14px] text-gris-500">{texte}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

/* Motif tissé sahélien (triangles) utilisé en filigrane sur les surfaces indigo. */
export function MotifTisse({ id, opacite = 0.09 }: { id: string; opacite?: number }) {
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
      <defs>
        <pattern id={id} width="28" height="28" patternUnits="userSpaceOnUse">
          <path d="M0 28 L14 14 L28 28 M0 14 L14 0 L28 14" fill="none" stroke="#E8B04A" strokeWidth="1.2" opacity={opacite} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
