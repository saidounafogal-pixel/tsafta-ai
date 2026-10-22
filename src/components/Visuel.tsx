import type { ReactNode } from "react";
import { matiere, type MatiereId } from "../data/donnees";
import { image } from "../data/bibliotheque";

/* Visuel 16:9 d'une annonce : la photo si elle existe, sinon une composition graphique
   dans la couleur de la matière (à remplacer par de vraies photos du pilote). */
export default function Visuel({
  photo,
  mat,
  symbole,
  className = "",
  coin,
  arrondi = "rounded-tuile",
}: {
  photo?: string;
  mat: MatiereId;
  symbole?: ReactNode;
  className?: string;
  coin?: ReactNode;
  arrondi?: string;
}) {
  const m = matiere(mat);
  const src = photo ? image(photo) : undefined;
  return (
    <div className={`relative aspect-video w-full max-w-full overflow-hidden ${arrondi} ${className}`} style={{ background: "#0E2B21" }}>
      {src ? (
        <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
      ) : (
        <>
          <div className="absolute inset-0" style={{ background: `radial-gradient(90% 90% at 70% 20%, ${m.teinte}55 0%, ${m.teinte}18 40%, transparent 70%), linear-gradient(160deg, #173F31, #0B241B)` }} />
          {/* Motif de la matière en filigrane */}
          <div className="absolute inset-0 grid grid-cols-6 place-items-center gap-1 p-2 text-[18px] opacity-[0.13]" aria-hidden="true">
            {Array.from({ length: 18 }).map((_, i) => (
              <span key={i} style={{ transform: `rotate(${(i * 37) % 60 - 30}deg)` }}>{m.emoji}</span>
            ))}
          </div>
          <div className="absolute inset-0 grid place-items-center">
            <span className="grid h-[46%] aspect-square place-items-center rounded-full text-[min(13vw,52px)]" style={{ background: `${m.teinte}22`, boxShadow: `0 0 0 1px ${m.teinte}44, 0 0 40px ${m.teinte}40`, color: m.teinte }}>
              {symbole ?? m.emoji}
            </span>
          </div>
        </>
      )}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3" style={{ background: "linear-gradient(180deg, transparent, rgba(6,20,15,0.55))" }} />
      {coin && <div className="absolute left-2.5 top-2.5 flex gap-1.5">{coin}</div>}
    </div>
  );
}
