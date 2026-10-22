import { useState } from "react";
import { Camera, MapPin, Star, Scale, Store, PackagePlus, GraduationCap, FlaskConical, Wrench, BarChart3, Search, Briefcase, ArrowUpRight, Coins, TrendingUp, Leaf, Flame, Check } from "lucide-react";
import { COLLECTEURS, MATIERES, fcfa, kg, matiere } from "../data/donnees";
import { FORMATIONS } from "../data/savoirs";
import { PROFILS, useEtat, type Profil } from "../store";
import { Aller, Bulle, Feuille, IconeMatiere, PastilleMatiere } from "../components/ui";
import Tsafti from "../components/Tsafti";

/* Volumes mensuels du pilote (exemple), le dernier mois est calculé à partir des transactions. */
const MOIS = ["Mai", "Juin", "Juil", "Août", "Sept", "Oct"];
const HISTORIQUE = [182, 236, 298, 361, 455];

function Graphique({ dernier }: { dernier: number }) {
  const valeurs = [...HISTORIQUE, Math.round(dernier)];
  const max = Math.max(...valeurs);
  const [choisi, setChoisi] = useState(valeurs.length - 1);
  return (
    <div className="mt-5">
      <div className="flex h-[150px] items-end justify-between gap-3">
        {valeurs.map((v, i) => {
          const on = i === choisi;
          return (
            <button key={MOIS[i]} onClick={() => setChoisi(i)} className="relative flex h-full flex-1 flex-col items-center justify-end" aria-label={`${MOIS[i]} : ${v} kg`}>
              {on && (
                <span className="absolute z-10 whitespace-nowrap rounded-full bg-[#F4FBF7] px-2.5 py-1 text-[11px] font-extrabold text-[#0B2219] shadow-haut" style={{ bottom: `calc(${(v / max) * 100}% + 10px)` }}>
                  {v} kg
                </span>
              )}
              <span
                className="w-full rounded-t-[10px] transition-all"
                style={{
                  height: `${Math.max(8, (v / max) * 100)}%`,
                  background: on
                    ? "linear-gradient(180deg, #FFD36B 0%, #FFB02E 45%, rgba(255,160,40,0.15) 100%)"
                    : "linear-gradient(180deg, rgba(255,190,80,0.75) 0%, rgba(160,120,40,0.35) 55%, rgba(120,90,30,0.05) 100%)",
                  boxShadow: on ? "0 0 24px rgba(255,176,46,0.45)" : "none",
                }}
              />
            </button>
          );
        })}
      </div>
      <div className="mt-2 flex justify-between gap-3">
        {MOIS.map((m, i) => (
          <span key={m} className={`flex-1 text-center text-[11px] font-semibold ${i === choisi ? "text-encre" : "text-gris-400"}`}>{m}</span>
        ))}
      </div>
    </div>
  );
}

const ACTIONS: Record<Profil, { label: string; to: string; icone: typeof Camera }[]> = {
  citoyen: [
    { label: "Faire collecter", to: "/collecte", icone: Camera },
    { label: "Apprendre", to: "/apprendre/academy", icone: GraduationCap },
    { label: "Acheter recyclé", to: "/market", icone: Store },
    { label: "Mon impact", to: "/suivi", icone: BarChart3 },
  ],
  collecteur: [
    { label: "Peser", to: "/collecte", icone: Scale },
    { label: "Vendre", to: "/market", icone: PackagePlus },
    { label: "Suivi", to: "/suivi", icone: BarChart3 },
    { label: "Matériel", to: "/apprendre/equip", icone: Wrench },
  ],
  atelier: [
    { label: "Matières", to: "/market", icone: Search },
    { label: "Filières", to: "/apprendre/lab", icone: FlaskConical },
    { label: "Atelier", to: "/atelier", icone: Briefcase },
    { label: "Matériel", to: "/apprendre/equip", icone: Wrench },
  ],
  acheteur: [
    { label: "Acheter", to: "/market", icone: Search },
    { label: "Produits", to: "/market", icone: Store },
    { label: "Traçabilité", to: "/suivi", icone: BarChart3 },
    { label: "Collecteurs", to: "/collecte", icone: MapPin },
  ],
};

const COURT: Record<string, string> = { pet: "PET", pehd: "PEHD", papier: "Papier", metal: "Métal", fibres: "Fibres", organique: "Organique", verre: "Verre" };

const JOURS = ["L", "M", "M", "J", "V", "S", "D"];

export default function Accueil() {
  const { transactions, demandes, annonces, profil, nom, points, changerProfil, changerNom } = useEtat();
  const [profilOuvert, setProfilOuvert] = useState(false);

  const mois = transactions.filter((t) => t.date >= "2026-10-01");
  const kgMois = mois.reduce((s, t) => s + t.poidsKg, 0);
  const total = transactions.reduce((s, t) => s + t.poidsKg, 0);
  const co2 = Math.round(kgMois * 1.2);
  const gains = mois.reduce((s, t) => s + t.poidsKg * t.prixKg, 0);
  const progression = Math.round(((kgMois - HISTORIQUE[HISTORIQUE.length - 1]) / HISTORIQUE[HISTORIQUE.length - 1]) * 100);
  const parMatiere = MATIERES.map((m) => ({ m, v: transactions.filter((t) => t.matiere === m.id).reduce((s, t) => s + t.poidsKg, 0) })).filter((x) => x.v > 0).sort((a, b) => b.v - a.v);
  const top = parMatiere.slice(0, 2);
  const autres = total - top.reduce((s, x) => s + x.v, 0);

  // Mission du jour : 3 demandes de collecte
  const missionFaites = Math.min(3, demandes.length);
  const missionOk = missionFaites >= 3;
  const formation = FORMATIONS[0];
  const initiale = (nom.trim()[0] ?? "T").toUpperCase();

  return (
    <div className="space-y-4 pb-4">
      <header className="flex items-center justify-between px-5 pt-[max(22px,env(safe-area-inset-top))]">
        <div>
          <p className="text-[14px] font-semibold text-gris-500">Bonjour{nom ? ` ${nom}` : ""}</p>
          <h1 className="whitespace-nowrap text-[24px] font-extrabold leading-tight">Votre progression</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="verre flex h-11 items-center gap-1.5 rounded-full px-3.5 text-[14px] font-extrabold">
            <Coins size={17} className="text-mil-500" /> {points.toLocaleString("fr-FR")}
          </span>
          <button onClick={() => setProfilOuvert(true)} aria-label="Mon profil" className="grid h-11 w-11 place-items-center rounded-full text-[16px] font-extrabold text-[#2A1300]" style={{ background: "linear-gradient(180deg,#FFC56B,#FF8A1F)", boxShadow: "0 0 0 2px #0B241B, 0 0 0 3.5px rgba(69,224,160,0.7)" }}>
            {initiale}
          </button>
        </div>
      </header>

      {/* Graphique de collecte */}
      <section className="px-5">
        <div className="carte p-5">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-[18px] font-extrabold">Collectes à Niamey</h2>
              <p className="mt-0.5 text-[13px] text-gris-500">{kg(total)} tracés depuis le lancement</p>
            </div>
            <span className="rounded-full border border-menthe/30 bg-menthe/10 px-3 py-1.5 text-[12px] font-bold text-menthe">6 mois</span>
          </div>
          <span className="mt-4 inline-flex items-center gap-1 rounded-full bg-menthe/15 px-2.5 py-1 text-[12px] font-extrabold text-menthe">
            <TrendingUp size={13} /> {progression >= 0 ? "+" : ""}{progression} %
          </span>
          <Graphique dernier={kgMois} />
        </div>
      </section>

      {/* Impact */}
      <section className="grid grid-cols-2 gap-3 px-5">
        <div className="relative overflow-hidden rounded-carte p-4 text-[#2A1300] shadow-bouton" style={{ background: "linear-gradient(160deg, #FFB547 0%, #FF8A1F 60%, #F0690C 100%)" }}>
          <p className="flex items-center gap-1.5 text-[13px] font-bold"><Leaf size={14} /> CO₂ évité</p>
          <p className="mt-4 text-[34px] font-extrabold leading-none tracking-[-0.04em]">{co2}</p>
          <p className="mt-1 text-[12px] font-bold opacity-80">kg ce mois-ci</p>
          <svg className="absolute -right-2 -top-2 opacity-25" width="80" height="80" viewBox="0 0 80 80" aria-hidden="true"><circle cx="40" cy="40" r="30" fill="none" stroke="#2A1300" strokeWidth="2" strokeDasharray="3 6" /></svg>
        </div>
        <div className="carte p-4">
          <p className="text-[13px] font-bold text-gris-600">Versé aux citoyens</p>
          <p className="chiffre mt-4 text-[26px] leading-none">{Math.round(gains / 1000).toLocaleString("fr-FR")}<span className="text-[15px] text-gris-500"> k</span></p>
          <p className="mt-1 text-[12px] font-semibold text-gris-500">FCFA ce mois-ci</p>
        </div>
      </section>

      {/* Mission du jour */}
      <section className="px-5">
        <div className="carte relative overflow-hidden p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-[17px] font-extrabold">Mission du jour</h2>
            <span className="flex items-center gap-1 text-[13px] font-bold text-mil-500"><Flame size={15} /> 4 jours de suite</span>
          </div>
          <div className="mt-4 flex gap-2">
            {JOURS.map((j, i) => {
              const fait = i < 3 || (i === 3 && missionOk);
              const auj = i === 3;
              return (
                <span key={i} className="flex flex-1 flex-col items-center gap-1.5">
                  <span className={`grid h-9 w-9 place-items-center rounded-full text-[12px] font-extrabold ${fait ? "bg-menthe text-menthe-fonce" : auj ? "border-2 border-menthe/60 text-menthe" : "bg-white/[.06] text-gris-400"}`}>
                    {fait ? <Check size={15} strokeWidth={3} /> : j}
                  </span>
                  <span className={`text-[10px] font-bold ${auj ? "text-menthe" : "text-gris-400"}`}>{auj ? "Auj." : j}</span>
                </span>
              );
            })}
          </div>
          <div className="mt-4 flex items-center gap-3.5 rounded-tuile bg-white/[.05] p-3.5 ring-1 ring-white/[.06]">
            <IconeMatiere id="pet" taille={44} />
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-bold">Faire collecter 3 sacs de déchets triés</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                  <span className="block h-full rounded-full bg-menthe shadow-[0_0_10px_#45E0A0]" style={{ width: `${(missionFaites / 3) * 100}%` }} />
                </span>
                <span className="text-[12px] font-extrabold">{missionFaites}/3</span>
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[13px] font-semibold text-gris-500">Récompense <Coins size={14} className="text-mil-500" /> <b className="text-encre">150</b></span>
            <Aller vers="/collecte" className="btn-action btn-sm">{missionOk ? "Mission accomplie" : "Commencer"}</Aller>
          </div>
        </div>
      </section>

      {/* Répartition par matière, style « score » */}
      <section className="px-5">
        <div className="carte p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-[17px] font-extrabold">Matières recyclées</h2>
            <Aller vers="/suivi" aria-label="Voir le suivi" className="grid h-9 w-9 place-items-center rounded-full bg-white/10"><ArrowUpRight size={17} /></Aller>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {[...top.map((x) => ({ nom: COURT[x.m.id], pct: Math.round((x.v / total) * 100) })), { nom: "Autres", pct: Math.round((autres / total) * 100) }].map((x) => (
              <div key={x.nom}>
                <p className="text-[12px] font-semibold text-gris-500">{x.nom}</p>
                <p className="chiffre text-[20px]">{x.pct} %</p>
              </div>
            ))}
          </div>
          <div className="mt-3 flex h-4 gap-1 overflow-hidden rounded-full">
            <span className="rounded-full" style={{ width: `${(top[0]?.v / total) * 100}%`, background: "linear-gradient(90deg,#FF9A2E,#FFC56B)" }} />
            <span className="rounded-full" style={{ width: `${((top[1]?.v ?? 0) / total) * 100}%`, background: "repeating-linear-gradient(-45deg,#45E0A0 0 5px,#2A9A6D 5px 9px)" }} />
            <span className="flex-1 rounded-full" style={{ background: "radial-gradient(circle,#B3BFD1 1.2px,transparent 1.6px) 0 0/6px 6px, rgba(255,255,255,0.06)" }} />
          </div>
        </div>
      </section>

      {/* Raccourcis selon le profil */}
      <section className="px-5 pt-2">
        <h2 className="titre-section">Pour vous, {PROFILS[profil].nom.toLowerCase()}</h2>
        <div className="mt-3 grid grid-cols-4 gap-2.5">
          {ACTIONS[profil].map(({ label, to, icone: Icone }, i) => (
            <Aller key={label} vers={to} className="flex flex-col items-center gap-2 text-center">
              <span
                className={`grid h-[60px] w-full place-items-center rounded-[20px] ${i === 0 ? "text-[#2A1300] shadow-bouton" : "verre text-encre"}`}
                style={i === 0 ? { background: "linear-gradient(180deg,#FFB547,#F26D0F)" } : undefined}
              >
                <Icone size={22} />
              </span>
              <span className="text-[12px] font-bold leading-tight text-gris-600">{label}</span>
            </Aller>
          ))}
        </div>
      </section>

      {/* Collecteurs proches */}
      <section className="pt-2">
        <div className="flex items-baseline justify-between px-5">
          <h2 className="titre-section">Collecteurs près de vous</h2>
          <Aller vers="/collecte" className="text-[14px] font-bold text-menthe">Tout voir</Aller>
        </div>
        <div className="defile mt-3 gap-3">
          {COLLECTEURS.slice(0, 5).map((c) => (
            <Aller key={c.id} vers="/collecte" className="carte w-[220px] shrink-0 p-4">
              <div className="flex items-center justify-between">
                <span className="puce bg-white/10 text-gris-600">{c.type}</span>
                <span className="flex items-center gap-1 text-[13px] font-bold"><Star size={13} className="fill-mil-500 text-mil-500" /> {c.note.toFixed(1)}</span>
              </div>
              <p className="mt-3 text-[15px] font-extrabold leading-snug">{c.nom}</p>
              <p className="mt-1 flex items-center gap-1 text-[13px] text-gris-500"><MapPin size={13} /> {c.quartier}, {c.distanceKm.toLocaleString("fr-FR")} km</p>
              <div className="mt-3 flex -space-x-1.5">
                {c.matieres.map((m) => (
                  <span key={m} className="grid h-8 w-8 place-items-center rounded-full text-[14px] ring-2 ring-[#10301F]" style={{ background: "#173D2F" }} title={matiere(m).nom}>{matiere(m).emoji}</span>
                ))}
              </div>
            </Aller>
          ))}
        </div>
      </section>

      {/* Market */}
      <section className="px-5 pt-2">
        <div className="flex items-baseline justify-between">
          <h2 className="titre-section">En ce moment sur le Market</h2>
          <Aller vers="/market" className="text-[14px] font-bold text-menthe">Ouvrir</Aller>
        </div>
        <div className="carte mt-3 divide-y divide-white/[.07]">
          {annonces.slice(0, 3).map((a) => (
            <Aller key={a.id} vers="/market" className="flex w-full items-center gap-3.5 p-4">
              <IconeMatiere id={a.matiere} taille={46} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-bold">{a.titre}</p>
                <p className="mt-0.5 text-[13px] text-gris-500">{kg(a.quantiteKg)} à {a.quartier}</p>
              </div>
              <div className="text-right">
                <p className="chiffre text-[15px] text-mil-500">{fcfa(a.prixKg)}</p>
                <p className="text-[11px] text-gris-500">par kg</p>
              </div>
            </Aller>
          ))}
        </div>
      </section>

      {/* Academy, avec Tsafti */}
      <section className="px-5 pt-2">
        <Aller vers={`/apprendre/academy/${formation.id}`} className="relative block w-full overflow-hidden rounded-carte p-5 pr-28 shadow-doux" style={{ background: "linear-gradient(150deg, #1F6B4E 0%, #124532 60%, #0D3325 100%)" }}>
          <span className="absolute inset-0" style={{ background: "radial-gradient(70% 70% at 100% 100%, rgba(255,170,60,0.25), transparent 60%)" }} aria-hidden="true" />
          <span className="relative block">
            <PastilleMatiere id={formation.matiere} taille="sm" />
            <span className="mt-3 block text-[19px] font-extrabold leading-tight">{formation.titre}</span>
            <span className="mt-1.5 block text-[13px] text-gris-600">{formation.lecons.length} leçons gratuites</span>
            <span className="btn-action btn-sm mt-4">Commencer</span>
          </span>
          <span className="absolute -bottom-3 -right-3">
            <Tsafti taille={128} />
          </span>
          <Bulle className="absolute right-6 top-4 px-3 py-1.5 text-[12px]">Je t'apprends !</Bulle>
        </Aller>
      </section>

      <Feuille ouvert={profilOuvert} fermer={() => setProfilOuvert(false)} titre="Votre profil">
        <label className="etiquette" htmlFor="nom">Votre prénom</label>
        <input id="nom" className="champ" placeholder="Ex. Aïchatou" value={nom} onChange={(e) => changerNom(e.target.value)} />
        <p className="etiquette mt-5">Vous utilisez Tsafta en tant que</p>
        <div className="grid gap-2.5">
          {(Object.keys(PROFILS) as Profil[]).map((p) => (
            <button key={p} onClick={() => changerProfil(p)} className={`flex items-center justify-between rounded-tuile border p-4 text-left transition ${profil === p ? "border-menthe/60 bg-menthe/10" : "border-white/10 bg-verre"}`}>
              <span>
                <span className="block text-[15px] font-bold">{PROFILS[p].nom}</span>
                <span className="mt-0.5 block text-[13px] text-gris-500">{PROFILS[p].role}</span>
              </span>
              <span className={`grid h-6 w-6 place-items-center rounded-full ${profil === p ? "bg-menthe text-menthe-fonce" : "border-2 border-white/20"}`}>
                {profil === p && <Check size={14} strokeWidth={3} />}
              </span>
            </button>
          ))}
        </div>
        <button className="btn-action mt-5 w-full" onClick={() => setProfilOuvert(false)}>Enregistrer</button>
      </Feuille>
    </div>
  );
}
