import { useCallback, useEffect, useState } from "react";
import { Play, Bell, Clock, Search, X, VideoOff, Maximize, Volume2 } from "lucide-react";
import { THEMES, VIDEOS, image, formateur, type Theme, type Video } from "../data/bibliotheque";
import { EnTete, Filtres, Toast, EtatVide } from "../components/ui";

function Miniature({ v, grande }: { v: Video; grande?: boolean }) {
  return (
    <span className={`relative block aspect-video w-full overflow-hidden ${grande ? "rounded-carte" : "rounded-tuile"} bg-[#0E2B21]`}>
      <img src={image(v.miniature)} alt="" loading="lazy" className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]" />
      <span className="absolute bottom-2 right-2 rounded-md bg-black/75 px-1.5 py-0.5 text-[11px] font-bold tabular-nums text-white">{v.duree}</span>
      {grande && (
        <span className="absolute inset-0 grid place-items-center">
          <span className="grid h-16 w-16 place-items-center rounded-full text-[#2A1300] shadow-bouton" style={{ background: "linear-gradient(180deg,#FFB547,#F26D0F)" }}>
            <Play size={26} className="ml-1 fill-current" />
          </span>
        </span>
      )}
    </span>
  );
}

function CarteVideo({ v, lire, rangee }: { v: Video; lire: () => void; rangee?: boolean }) {
  const t = THEMES[v.theme];
  return (
    <button onClick={lire} className={`group text-left ${rangee ? "w-[272px] shrink-0" : "w-full"}`}>
      <Miniature v={v} />
      <span className="mt-2.5 flex gap-3">
        <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full text-[13px] font-extrabold" style={{ background: `${t.couleur}26`, color: t.couleur }}>
          {formateur(v)[0]}
        </span>
        <span className="min-w-0">
          <span className="line-clamp-2 text-[14px] font-bold leading-snug">{v.titre}</span>
          <span className="mt-1 block truncate text-[12px] text-gris-500">{formateur(v)}, {t.nom}</span>
        </span>
      </span>
    </button>
  );
}

/* Lecteur : simule le chargement puis indique que la vidéo arrive bientôt. */
function Lecteur({ v, fermer, avertir, suivante }: { v: Video; fermer: () => void; avertir: () => void; suivante: (v: Video) => void }) {
  const [charge, setCharge] = useState(false);
  useEffect(() => {
    setCharge(false);
    const t = setTimeout(() => setCharge(true), 1600);
    const echap = (e: KeyboardEvent) => e.key === "Escape" && fermer();
    window.addEventListener("keydown", echap);
    document.body.style.overflow = "hidden";
    return () => { clearTimeout(t); window.removeEventListener("keydown", echap); document.body.style.overflow = ""; };
  }, [v, fermer]);
  const t = THEMES[v.theme];
  const autres = VIDEOS.filter((x) => x.id !== v.id && x.theme === v.theme).concat(VIDEOS.filter((x) => x.id !== v.id && x.theme !== v.theme)).slice(0, 4);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#06140F] pb-10" role="dialog" aria-modal="true" aria-label={v.titre}>
      <div className="mx-auto max-w-md">
        <div className="sticky top-0 z-10 bg-black pt-[env(safe-area-inset-top)]">
          <div className="relative aspect-video w-full overflow-hidden">
            <img src={image(v.miniature)} alt="" className={`h-full w-full object-cover transition duration-500 ${charge ? "scale-110 blur-md brightness-[.35]" : "brightness-75"}`} />
            {!charge ? (
              <span className="absolute inset-0 grid place-items-center">
                <span className="h-12 w-12 animate-spin rounded-full border-[3px] border-white/25 border-t-mil-500" aria-label="Chargement" />
              </span>
            ) : (
              <span className="absolute inset-0 flex animate-fondu flex-col items-center justify-center px-8 text-center">
                <span className="grid h-14 w-14 place-items-center rounded-full bg-white/10 ring-1 ring-white/20"><VideoOff size={24} /></span>
                <span className="mt-3 text-[17px] font-extrabold">Vidéo bientôt disponible</span>
                <span className="mt-1 text-[13px] leading-snug text-white/75">Cette formation est en cours de tournage avec nos artisans à Niamey.</span>
              </span>
            )}
            <button onClick={fermer} aria-label="Fermer le lecteur" className="absolute left-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-black/50 backdrop-blur"><X size={20} /></button>
            {/* Barre de contrôle factice */}
            <div className="absolute inset-x-0 bottom-0 px-3 pb-2">
              <div className="h-1 overflow-hidden rounded-full bg-white/25"><div className="h-full w-0 bg-mil-500" /></div>
              <div className="mt-1.5 flex items-center justify-between text-[11px] font-bold text-white/80">
                <span className="flex items-center gap-2"><Play size={14} className="fill-current" /> 0:00 / {v.duree}</span>
                <span className="flex items-center gap-3"><Volume2 size={14} /><Maximize size={14} /></span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-5 pt-4">
          <h2 className="text-[19px] font-extrabold leading-snug">{v.titre}</h2>
          <div className="mt-3 flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full text-[14px] font-extrabold" style={{ background: `${t.couleur}26`, color: t.couleur }}>{formateur(v)[0]}</span>
            <span className="min-w-0 flex-1">
              <span className="block text-[14px] font-bold">{formateur(v)}</span>
              <span className="text-[12px] text-gris-500">{t.nom}</span>
            </span>
            <button onClick={avertir} className="btn-action btn-sm"><Bell size={15} /> M'avertir</button>
          </div>
          <p className="mt-4 rounded-tuile bg-white/[.05] p-3.5 text-[13px] leading-relaxed text-gris-600 ring-1 ring-white/[.06]">
            <Clock size={13} className="mr-1.5 inline -translate-y-px" />
            Durée prévue {v.duree}. Chaque vidéo sera accompagnée d'une fiche illustrée à télécharger et d'un atelier pratique à Niamey.
          </p>

          <h3 className="titre-section mt-6">À suivre</h3>
          <div className="mt-3 space-y-3">
            {autres.map((x) => (
              <button key={x.id} onClick={() => suivante(x)} className="flex w-full gap-3 text-left">
                <span className="w-[150px] shrink-0"><Miniature v={x} /></span>
                <span className="min-w-0 py-0.5">
                  <span className="line-clamp-3 text-[13px] font-bold leading-snug">{x.titre}</span>
                  <span className="mt-1 block truncate text-[11.5px] text-gris-500">{formateur(x)}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Bibliotheque() {
  const [theme, setTheme] = useState<Theme | "tout">("tout");
  const [recherche, setRecherche] = useState("");
  const [lecture, setLecture] = useState<Video | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const fermerToast = useCallback(() => setToast(null), []);
  const fermer = useCallback(() => setLecture(null), []);

  const q = recherche.trim().toLowerCase();
  const filtrees = VIDEOS.filter((v) => (theme === "tout" || v.theme === theme) && (!q || v.titre.toLowerCase().includes(q)));
  const themesPresents = (Object.keys(THEMES) as Theme[]).filter((t) => VIDEOS.some((v) => v.theme === t));
  const une = VIDEOS[VIDEOS.length - 2] ?? VIDEOS[0];
  const vueRangees = theme === "tout" && !q;

  return (
    <div>
      <EnTete titre="Bibliothèque" sousTitre={`${VIDEOS.length} vidéos pour apprendre à valoriser les déchets`} retour />
      <div className="space-y-4 px-5">
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gris-400" />
          <input className="champ rounded-full pl-11" placeholder="Rechercher une technique" value={recherche} onChange={(e) => setRecherche(e.target.value)} aria-label="Rechercher une vidéo" />
        </div>
        <Filtres options={[{ id: "tout" as const, label: "Tout" }, ...themesPresents.map((t) => ({ id: t, label: THEMES[t].nom }))]} valeur={theme} changer={setTheme} />
      </div>

      {vueRangees ? (
        <div className="space-y-7 pt-5">
          {une && (
            <section className="px-5">
              <button onClick={() => setLecture(une)} className="group block w-full text-left">
                <Miniature v={une} grande />
                <span className="mt-3 block text-[18px] font-extrabold leading-snug">{une.titre}</span>
                <span className="mt-1 block text-[13px] text-gris-500">{formateur(une)}, {THEMES[une.theme].nom}</span>
              </button>
            </section>
          )}
          {themesPresents.map((t) => (
            <section key={t}>
              <div className="flex items-baseline justify-between px-5">
                <h2 className="titre-section flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: THEMES[t].couleur, boxShadow: `0 0 10px ${THEMES[t].couleur}` }} />
                  {THEMES[t].nom}
                </h2>
                <button onClick={() => setTheme(t)} className="text-[14px] font-bold text-menthe">Tout voir</button>
              </div>
              <div className="defile mt-3 gap-3">
                {VIDEOS.filter((v) => v.theme === t).map((v) => <CarteVideo key={v.id} v={v} rangee lire={() => setLecture(v)} />)}
              </div>
            </section>
          ))}
        </div>
      ) : filtrees.length === 0 ? (
        <div className="px-5 pt-5"><EtatVide icone={<Search size={24} />} titre="Aucune vidéo trouvée" texte="Essayez un autre mot ou un autre thème." /></div>
      ) : (
        <div className="grid gap-6 px-5 pt-5">
          {filtrees.map((v) => <CarteVideo key={v.id} v={v} lire={() => setLecture(v)} />)}
        </div>
      )}

      {lecture && <Lecteur v={lecture} fermer={fermer} avertir={() => setToast("Vous serez averti à la sortie")} suivante={setLecture} />}
      <Toast message={toast} fermer={fermerToast} />
    </div>
  );
}
