import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PlayCircle, FileText, Hammer, Check, Play, Award } from "lucide-react";
import { MATIERES, matiere, type MatiereId } from "../data/donnees";
import { FORMATIONS, type FormatLecon, type Lecon } from "../data/savoirs";
import { useEtat } from "../store";
import { EnTete, Feuille, Filtres, IconeMatiere, PastilleMatiere } from "../components/ui";

const FORMATS: Record<FormatLecon, { nom: string; icone: typeof PlayCircle }> = {
  video: { nom: "Vidéo", icone: PlayCircle },
  fiche: { nom: "Fiche illustrée", icone: FileText },
  pratique: { nom: "Atelier pratique", icone: Hammer },
};

function Anneau({ pct, taille = 44 }: { pct: number; taille?: number }) {
  const r = 18, c = 2 * Math.PI * r;
  return (
    <svg width={taille} height={taille} viewBox="0 0 44 44" aria-label={`${pct} % terminé`}>
      <circle cx="22" cy="22" r={r} fill="none" stroke="#E9EBF1" strokeWidth="4" />
      <circle cx="22" cy="22" r={r} fill="none" stroke="#1F6F5C" strokeWidth="4" strokeLinecap="round" strokeDasharray={`${(pct / 100) * c} ${c}`} transform="rotate(-90 22 22)" />
      <text x="22" y="26" textAnchor="middle" fontSize="11" fontWeight="700" fill="#1B2340" fontFamily="Bricolage Grotesque">{pct}</text>
    </svg>
  );
}

export default function Academy() {
  const { progression } = useEtat();
  const [filtre, setFiltre] = useState<MatiereId | "toutes">("toutes");
  const matieresAvecFormation = MATIERES.filter((m) => FORMATIONS.some((f) => f.matiere === m.id));
  const liste = FORMATIONS.filter((f) => filtre === "toutes" || f.matiere === filtre);

  return (
    <div>
      <EnTete titre="Tsafta Academy" sousTitre="Formations gratuites, à votre rythme" retour />
      <div className="space-y-4 px-5">
        <Filtres
          options={[{ id: "toutes" as const, label: "Toutes" }, ...matieresAvecFormation.map((m) => ({ id: m.id, label: `${m.emoji} ${m.nom}` }))]}
          valeur={filtre}
          changer={setFiltre}
        />
        {liste.map((f) => {
          const faites = progression[f.id]?.length ?? 0;
          const pct = Math.round((faites / f.lecons.length) * 100);
          const m = matiere(f.matiere);
          return (
            <Link key={f.id} to={`/apprendre/academy/${f.id}`} className="carte block overflow-hidden">
              <div className="relative flex h-28 items-end justify-between p-4" style={{ background: m.fond }}>
                <span className="absolute right-4 top-3 text-[56px] leading-none opacity-90">{m.emoji}</span>
                <span className="puce bg-white/80" style={{ color: m.teinte }}>{f.niveau}</span>
              </div>
              <div className="flex items-center gap-4 p-4">
                <div className="min-w-0 flex-1">
                  <p className="font-display text-[17px] font-bold leading-snug">{f.titre}</p>
                  <p className="mt-1 text-[13px] text-gris-500">{f.lecons.length} leçons, par {f.formateur}</p>
                </div>
                <Anneau pct={pct} />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export function DetailFormation() {
  const { id } = useParams();
  const { progression, basculerLecon } = useEtat();
  const [lecon, setLecon] = useState<Lecon | null>(null);
  const f = FORMATIONS.find((x) => x.id === id);
  if (!f) return <EnTete titre="Formation introuvable" retour />;
  const faites = progression[f.id] ?? [];
  const pct = Math.round((faites.length / f.lecons.length) * 100);
  const m = matiere(f.matiere);
  const prochaine = f.lecons.find((l) => !faites.includes(l.id));

  return (
    <div>
      <EnTete titre="Formation" retour />
      <div className="space-y-5 px-5">
        <div className="overflow-hidden rounded-hero shadow-doux" style={{ background: m.fond }}>
          <div className="flex items-start justify-between p-6">
            <div>
              <PastilleMatiere id={f.matiere} taille="sm" />
              <h2 className="mt-3 text-[25px] font-bold leading-tight">{f.titre}</h2>
              <p className="mt-2 text-[15px] leading-relaxed text-gris-600">{f.resume}</p>
            </div>
          </div>
          <div className="flex items-center justify-between bg-white/60 px-6 py-4">
            <span className="text-[14px] font-semibold text-gris-600">{f.formateur}</span>
            <span className="text-[14px] font-semibold" style={{ color: m.teinte }}>{pct} % terminé</span>
          </div>
        </div>

        {pct === 100 ? (
          <div className="flex items-center gap-4 rounded-carte bg-indigo-900 p-5 text-white">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-mil-500 text-indigo-950"><Award size={24} /></span>
            <div>
              <p className="font-display text-[17px] font-bold">Formation terminée</p>
              <p className="text-[14px] text-indigo-300">Passez à Tsafta Lab pour chiffrer votre projet.</p>
            </div>
          </div>
        ) : (
          prochaine && (
            <button className="btn-action w-full" onClick={() => setLecon(prochaine)}>
              <Play size={18} /> {faites.length === 0 ? "Commencer la formation" : `Reprendre à la leçon ${f.lecons.indexOf(prochaine) + 1}`}
            </button>
          )
        )}

        <section>
          <h3 className="titre-section mb-3">Programme</h3>
          <ol className="carte divide-y divide-gris-100">
            {f.lecons.map((l, i) => {
              const fait = faites.includes(l.id);
              const F = FORMATS[l.format];
              return (
                <li key={l.id}>
                  <button onClick={() => setLecon(l)} className="flex w-full items-center gap-3.5 p-4 text-left">
                    <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full font-display text-[15px] font-bold ${fait ? "bg-fleuve-600 text-white" : "bg-indigo-50 text-indigo-800"}`}>
                      {fait ? <Check size={18} strokeWidth={3} /> : i + 1}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[15px] font-semibold">{l.titre}</span>
                      <span className="mt-0.5 flex items-center gap-1.5 text-[13px] text-gris-500">
                        <F.icone size={14} /> {F.nom}, {l.duree}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </section>
      </div>

      <Feuille ouvert={!!lecon} fermer={() => setLecon(null)} titre={lecon?.titre ?? ""}>
        {lecon && (
          <div>
            {lecon.format === "video" ? (
              <div className="relative grid aspect-video place-items-center overflow-hidden rounded-carte bg-indigo-900">
                <span className="absolute right-4 top-3 text-[64px] opacity-30">{m.emoji}</span>
                <span className="grid h-16 w-16 place-items-center rounded-full bg-mil-500 text-indigo-950 shadow-haut"><Play size={26} className="ml-1" /></span>
                <span className="absolute bottom-3 left-4 text-[13px] font-semibold text-indigo-300">Vidéo, {lecon.duree}</span>
              </div>
            ) : (
              <div className="flex items-center gap-3 rounded-carte p-4" style={{ background: m.fond }}>
                <IconeMatiere id={f.matiere} taille={44} />
                <span className="text-[14px] font-semibold" style={{ color: m.teinte }}>{FORMATS[lecon.format].nom}, {lecon.duree}</span>
              </div>
            )}
            <ol className="mt-5 space-y-3">
              {lecon.contenu.map((c, i) => (
                <li key={i} className="flex gap-3.5">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-indigo-900 text-[13px] font-bold text-mil-500">{i + 1}</span>
                  <p className="pt-0.5 text-[15px] leading-relaxed">{c}</p>
                </li>
              ))}
            </ol>
            <button
              className={faites.includes(lecon.id) ? "btn-doux mt-6 w-full" : "btn-action mt-6 w-full"}
              onClick={() => {
                basculerLecon(f.id, lecon.id);
                setLecon(null);
              }}
            >
              {faites.includes(lecon.id) ? "Marquer comme non terminée" : "Marquer comme terminée"}
            </button>
          </div>
        )}
      </Feuille>
    </div>
  );
}
