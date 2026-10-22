import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Camera, MapPin, Star, Scale, Store, PackagePlus, GraduationCap, FlaskConical, Wrench, BarChart3, Search, Briefcase } from "lucide-react";
import { COLLECTEURS, fcfa, kg, matiere } from "../data/donnees";
import { FORMATIONS } from "../data/savoirs";
import { PROFILS, useEtat, type Profil } from "../store";
import { Feuille, IconeMatiere, MotifTisse, PastilleMatiere } from "../components/ui";

/* Les quatre étapes du cycle : un arc par étape, étiquette dans son coin, dans le sens des aiguilles d'une montre. */
const ETAPES = [
  { nom: "Apprendre", to: "/apprendre", coin: "left-0 top-0", couleur: "#E8B04A" },
  { nom: "Collecter", to: "/collecte", coin: "right-0 top-0", couleur: "#2A8670" },
  { nom: "Transformer", to: "/apprendre/lab", coin: "right-0 bottom-0", couleur: "#E8B04A" },
  { nom: "Entreprendre", to: "/atelier", coin: "left-0 bottom-0", couleur: "#2A8670" },
];

function Anneau({ total }: { total: number }) {
  const nav = useNavigate();
  const r = 62;
  const c = 2 * Math.PI * r;
  const arc = c / 4 - 12;
  // Arcs centrés sur les diagonales : haut-gauche, haut-droite, bas-droite, bas-gauche.
  const centres = [225, 315, 45, 135];
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[310px]">
      <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <circle cx="100" cy="100" r="47" fill="none" stroke="#34406E" strokeWidth="1" strokeDasharray="2 5" className="origin-center animate-tourner" />
        {ETAPES.map((e, i) => (
          <circle
            key={e.nom}
            cx="100"
            cy="100"
            r={r}
            fill="none"
            stroke={e.couleur}
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={`${arc} ${c - arc}`}
            transform={`rotate(${centres[i] - (arc / c) * 180} 100 100)`}
          />
        ))}
      </svg>
      {ETAPES.map((e) => (
        <button
          key={e.nom}
          onClick={() => nav(e.to)}
          className={`absolute ${e.coin} flex items-center gap-1.5 rounded-full bg-indigo-950/70 py-1.5 pl-2.5 pr-3 text-[12px] font-semibold text-white ring-1 ring-white/10 backdrop-blur transition hover:bg-indigo-800`}
        >
          <span className="h-2 w-2 rounded-full" style={{ background: e.couleur }} />
          {e.nom}
        </button>
      ))}
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <p className="chiffre text-[40px] leading-none text-white">{Math.round(total).toLocaleString("fr-FR")}</p>
          <p className="mx-auto mt-1.5 max-w-[110px] text-[12px] font-medium leading-snug text-indigo-300">kg remis en circulation</p>
        </div>
      </div>
    </div>
  );
}

const ACTIONS: Record<Profil, { label: string; to: string; icone: typeof Camera }[]> = {
  citoyen: [
    { label: "Faire collecter", to: "/collecte", icone: Camera },
    { label: "Points de dépôt", to: "/collecte", icone: MapPin },
    { label: "Apprendre à recycler", to: "/apprendre/academy", icone: GraduationCap },
    { label: "Acheter recyclé", to: "/market", icone: Store },
  ],
  collecteur: [
    { label: "Peser une collecte", to: "/collecte", icone: Scale },
    { label: "Vendre ma matière", to: "/market", icone: PackagePlus },
    { label: "Mon tableau de suivi", to: "/suivi", icone: BarChart3 },
    { label: "Équipements", to: "/apprendre/equip", icone: Wrench },
  ],
  atelier: [
    { label: "Trouver de la matière", to: "/market", icone: Search },
    { label: "Explorer une filière", to: "/apprendre/lab", icone: FlaskConical },
    { label: "Mon atelier", to: "/atelier", icone: Briefcase },
    { label: "Équipements", to: "/apprendre/equip", icone: Wrench },
  ],
  acheteur: [
    { label: "Acheter des matières", to: "/market", icone: Search },
    { label: "Produits recyclés", to: "/market", icone: Store },
    { label: "Traçabilité", to: "/suivi", icone: BarChart3 },
    { label: "Collecteurs", to: "/collecte", icone: MapPin },
  ],
};

export default function Accueil() {
  const { transactions, annonces, profil, nom, changerProfil, changerNom } = useEtat();
  const [profilOuvert, setProfilOuvert] = useState(false);
  const total = transactions.reduce((s, t) => s + t.poidsKg, 0);
  const formation = FORMATIONS[0];
  const initiale = (nom.trim()[0] ?? "T").toUpperCase();

  return (
    <div>
      <header className="flex items-center justify-between px-5 pb-2 pt-[max(20px,env(safe-area-inset-top))]">
        <div className="flex items-center gap-2.5">
          <img src="./icon.svg" alt="" className="h-9 w-9 rounded-[11px]" />
          <span className="font-display text-[21px] font-bold tracking-[-0.03em]">Tsafta</span>
        </div>
        <button onClick={() => setProfilOuvert(true)} className="flex items-center gap-2 rounded-full bg-white py-1 pl-3 pr-1 shadow-doux" aria-label="Changer de profil">
          <span className="text-[13px] font-semibold text-gris-600">{PROFILS[profil].nom}</span>
          <span className="grid h-8 w-8 place-items-center rounded-full bg-mil-500 font-display text-[14px] font-bold text-indigo-950">{initiale}</span>
        </button>
      </header>

      <section className="px-5 pt-3">
        <h1 className="text-[30px] font-bold leading-[1.08]">
          {nom ? `Bonjour ${nom},` : "Bonjour,"}
          <br />
          vos déchets ont de la valeur.
        </h1>
      </section>

      {/* Hero : le cycle de l'économie circulaire */}
      <section className="px-5 pt-5">
        <div className="relative overflow-hidden rounded-hero bg-indigo-900 px-5 pb-5 pt-7 shadow-haut">
          <MotifTisse id="motif-hero" />
          <div className="relative">
            <Anneau total={total} />
            <p className="mx-auto mt-5 max-w-[280px] text-center text-[14px] leading-relaxed text-indigo-300">
              Niamey relie citoyens, collecteurs, ateliers et acheteurs autour d'une même ressource.
            </p>
            <Link to="/collecte" className="btn-or mt-5 w-full">
              <Camera size={19} /> Photographier mes déchets
            </Link>
          </div>
        </div>
      </section>

      {/* Actions selon le profil */}
      <section className="px-5 pt-8">
        <h2 className="titre-section">Pour vous, {PROFILS[profil].nom.toLowerCase()}</h2>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {ACTIONS[profil].map(({ label, to, icone: Icone }, i) => (
            <Link key={label} to={to} className="carte flex h-[108px] flex-col justify-between p-4 transition active:scale-[0.98]">
              <span className={`grid h-10 w-10 place-items-center rounded-tuile ${i === 0 ? "bg-fleuve-600 text-white" : "bg-indigo-50 text-indigo-800"}`}>
                <Icone size={20} />
              </span>
              <span className="text-[15px] font-semibold leading-tight">{label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Collecteurs proches */}
      <section className="pt-8">
        <div className="flex items-baseline justify-between px-5">
          <h2 className="titre-section">Collecteurs près de vous</h2>
          <Link to="/collecte" className="text-[14px] font-semibold text-fleuve-600">Tout voir</Link>
        </div>
        <div className="defile mt-3 gap-3">
          {COLLECTEURS.slice(0, 5).map((c) => (
            <div key={c.id} className="carte w-[230px] shrink-0 p-4">
              <div className="flex items-center justify-between">
                <span className="puce bg-indigo-50 text-indigo-700">{c.type}</span>
                <span className="flex items-center gap-1 text-[13px] font-semibold">
                  <Star size={13} className="fill-mil-500 text-mil-500" /> {c.note.toFixed(1)}
                </span>
              </div>
              <p className="mt-3 font-display text-[16px] font-bold leading-snug">{c.nom}</p>
              <p className="mt-1 flex items-center gap-1 text-[13px] text-gris-500">
                <MapPin size={13} /> {c.quartier}, {c.distanceKm.toLocaleString("fr-FR")} km
              </p>
              <div className="mt-3 flex -space-x-1.5">
                {c.matieres.map((m) => (
                  <span key={m} className="grid h-8 w-8 place-items-center rounded-full text-[14px] ring-2 ring-white" style={{ background: matiere(m).fond }} title={matiere(m).nom}>
                    {matiere(m).emoji}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Market */}
      <section className="px-5 pt-8">
        <div className="flex items-baseline justify-between">
          <h2 className="titre-section">En ce moment sur le Market</h2>
          <Link to="/market" className="text-[14px] font-semibold text-fleuve-600">Ouvrir</Link>
        </div>
        <div className="carte mt-3 divide-y divide-gris-100">
          {annonces.slice(0, 3).map((a) => (
            <Link key={a.id} to="/market" className="flex items-center gap-3.5 p-4">
              <IconeMatiere id={a.matiere} taille={46} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-semibold">{a.titre}</p>
                <p className="mt-0.5 text-[13px] text-gris-500">
                  {kg(a.quantiteKg)} à {a.quartier}
                </p>
              </div>
              <div className="text-right">
                <p className="chiffre text-[15px]">{fcfa(a.prixKg)}</p>
                <p className="text-[11px] text-gris-500">par kg</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Academy */}
      <section className="px-5 pt-8">
        <Link to={`/apprendre/academy/${formation.id}`} className="relative block overflow-hidden rounded-carte bg-fleuve-700 p-5 text-white shadow-doux">
          <MotifTisse id="motif-academy" opacite={0.12} />
          <div className="relative">
            <PastilleMatiere id={formation.matiere} taille="sm" />
            <p className="mt-3 font-display text-[21px] font-bold leading-tight">{formation.titre}</p>
            <p className="mt-1.5 text-[14px] text-fleuve-100">
              {formation.lecons.length} leçons, gratuit, par {formation.formateur}
            </p>
            <span className="btn-sm btn mt-4 bg-white text-fleuve-800">Commencer la formation</span>
          </div>
        </Link>
      </section>

      <Feuille ouvert={profilOuvert} fermer={() => setProfilOuvert(false)} titre="Votre profil">
        <label className="etiquette" htmlFor="nom">Votre prénom</label>
        <input id="nom" className="champ" placeholder="Ex. Aïchatou" value={nom} onChange={(e) => changerNom(e.target.value)} />
        <p className="etiquette mt-5">Vous utilisez Tsafta en tant que</p>
        <div className="grid gap-2.5">
          {(Object.keys(PROFILS) as Profil[]).map((p) => (
            <button
              key={p}
              onClick={() => changerProfil(p)}
              className={`flex items-center justify-between rounded-tuile border p-4 text-left transition ${profil === p ? "border-fleuve-600 bg-fleuve-50" : "border-gris-200"}`}
            >
              <span>
                <span className="block text-[15px] font-semibold">{PROFILS[p].nom}</span>
                <span className="mt-0.5 block text-[13px] text-gris-500">{PROFILS[p].role}</span>
              </span>
              <span className={`h-5 w-5 rounded-full border-2 ${profil === p ? "border-[6px] border-fleuve-600" : "border-gris-200"}`} />
            </button>
          ))}
        </div>
        <button className="btn-indigo mt-5 w-full" onClick={() => setProfilOuvert(false)}>
          Enregistrer
        </button>
      </Feuille>
    </div>
  );
}
