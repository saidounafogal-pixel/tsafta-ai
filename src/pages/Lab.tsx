import { useState } from "react";
import { Link } from "react-router-dom";
import { Wrench, ChevronRight, TrendingUp, Clock, GraduationCap } from "lucide-react";
import { MATIERES, fcfa, matiere, type MatiereId } from "../data/donnees";
import { FORMATIONS, LAB, equipement } from "../data/savoirs";
import { EnTete, MotifTisse } from "../components/ui";

const NIVEAUX = ["", "Modéré", "Bon", "Élevé"];

export default function Lab() {
  const [id, setId] = useState<MatiereId>("pet");
  const fiche = LAB.find((f) => f.matiere === id)!;
  const m = matiere(id);
  const [volume, setVolume] = useState(500);
  const [prixAchat, setPrixAchat] = useState(Math.round(m.prixKg * 1.6));

  const choisir = (x: MatiereId) => {
    setId(x);
    setPrixAchat(Math.round(matiere(x).prixKg * 1.6));
  };

  const revenu = volume * fiche.rendement * fiche.prixProduitKg;
  const couts = volume * (prixAchat + fiche.autresCoutsKg);
  const benefice = revenu - couts;
  const retour = benefice > 0 ? Math.ceil(fiche.investissement[0] / benefice) : null;
  const formation = FORMATIONS.find((f) => f.matiere === id);

  return (
    <div>
      <EnTete titre="Tsafta Lab" sousTitre="Ce qu'une matière peut vous rapporter" retour />
      <div className="space-y-5">
        <div className="defile gap-2.5">
          {MATIERES.map((x) => (
            <button
              key={x.id}
              onClick={() => choisir(x.id)}
              className={`flex w-[92px] shrink-0 flex-col items-center gap-2 rounded-carte border-2 bg-white px-2 py-3.5 transition ${id === x.id ? "" : "border-transparent shadow-doux"}`}
              style={id === x.id ? { borderColor: x.teinte } : undefined}
              aria-pressed={id === x.id}
            >
              <span className="grid h-11 w-11 place-items-center rounded-tuile text-[22px]" style={{ background: x.fond }}>{x.emoji}</span>
              <span className="text-center text-[12px] font-semibold leading-tight">{x.nom}</span>
            </button>
          ))}
        </div>

        <div className="space-y-5 px-5">
          <div className="rounded-hero p-6" style={{ background: m.fond }}>
            <div className="flex items-center justify-between">
              <span className="text-[14px] font-semibold" style={{ color: m.teinte }}>Potentiel économique</span>
              <span className="flex items-center gap-1.5">
                {[1, 2, 3].map((i) => (
                  <span key={i} className="h-2.5 w-7 rounded-full" style={{ background: i <= fiche.potentiel ? m.teinte : "rgba(27,35,64,.1)" }} />
                ))}
              </span>
            </div>
            <h2 className="mt-3 text-[24px] font-bold leading-tight">{m.nom} : {NIVEAUX[fiche.potentiel].toLowerCase()}</h2>
            <p className="mt-2 text-[15px] leading-relaxed text-gris-600">{fiche.accroche}</p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-tuile bg-white/70 p-3.5">
                <p className="text-[12px] font-semibold text-gris-500">Investissement</p>
                <p className="chiffre mt-1 text-[15px] leading-tight">{(fiche.investissement[0] / 1000).toLocaleString("fr-FR")}k à {(fiche.investissement[1] / 1_000_000).toLocaleString("fr-FR")} M</p>
                <p className="text-[11px] text-gris-500">FCFA</p>
              </div>
              <div className="rounded-tuile bg-white/70 p-3.5">
                <p className="text-[12px] font-semibold text-gris-500">Pour démarrer</p>
                <p className="chiffre mt-1 flex items-center gap-1.5 text-[15px] leading-tight"><Clock size={15} /> {fiche.delai}</p>
              </div>
            </div>
          </div>

          <section>
            <h3 className="titre-section mb-3">Produits et débouchés</h3>
            <div className="carte divide-y divide-gris-100">
              {fiche.debouches.map((d) => (
                <div key={d.produit} className="flex items-center justify-between gap-3 p-4">
                  <div>
                    <p className="text-[15px] font-semibold">{d.produit}</p>
                    <p className="mt-0.5 text-[13px] text-gris-500">{d.marche}</p>
                  </div>
                  <p className="shrink-0 text-right text-[14px] font-bold text-fleuve-700">{d.prixVente}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="titre-section mb-3">Compétences nécessaires</h3>
            <div className="flex flex-wrap gap-2">
              {fiche.competences.map((c) => <span key={c} className="puce bg-white py-2 text-[13px] text-encre shadow-doux">{c}</span>)}
            </div>
            {formation && (
              <Link to={`/apprendre/academy/${formation.id}`} className="mt-3 flex items-center gap-3 rounded-tuile bg-fleuve-50 p-3.5 text-fleuve-800">
                <GraduationCap size={20} />
                <span className="flex-1 text-[14px] font-semibold">Se former : {formation.titre}</span>
                <ChevronRight size={18} />
              </Link>
            )}
          </section>

          <section>
            <h3 className="titre-section mb-3">Équipements</h3>
            <div className="carte divide-y divide-gris-100">
              {fiche.equipements.map((eid) => {
                const e = equipement(eid);
                if (!e) return null;
                return (
                  <Link key={eid} to="/apprendre/equip" className="flex items-center gap-3.5 p-4">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-tuile bg-mil-100 text-mil-600"><Wrench size={18} /></span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[15px] font-semibold">{e.nom}</span>
                      <span className="text-[13px] text-gris-500">{e.capacite}</span>
                    </span>
                    <span className="chiffre text-[14px]">{fcfa(e.prix)}</span>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Simulateur */}
          <section className="relative overflow-hidden rounded-hero bg-indigo-900 p-6 text-white shadow-haut">
            <MotifTisse id="motif-simu" />
            <div className="relative">
              <h3 className="flex items-center gap-2 text-[21px] font-bold"><TrendingUp size={22} className="text-mil-500" /> Simuler mon activité</h3>
              <p className="mt-1 text-[14px] text-indigo-300">Estimation mensuelle, à affiner avec vos vrais coûts.</p>

              <div className="mt-6">
                <div className="flex justify-between text-[14px]">
                  <label htmlFor="vol" className="font-semibold text-indigo-100">Matière traitée par mois</label>
                  <span className="chiffre text-mil-500">{volume.toLocaleString("fr-FR")} kg</span>
                </div>
                <input id="vol" type="range" min={50} max={5000} step={50} value={volume} onChange={(e) => setVolume(+e.target.value)} className="mt-3 w-full accent-mil-500" />
              </div>
              <div className="mt-5">
                <div className="flex justify-between text-[14px]">
                  <label htmlFor="pa" className="font-semibold text-indigo-100">Prix d'achat de la matière</label>
                  <span className="chiffre text-mil-500">{prixAchat} F/kg</span>
                </div>
                <input id="pa" type="range" min={0} max={600} step={5} value={prixAchat} onChange={(e) => setPrixAchat(+e.target.value)} className="mt-3 w-full accent-mil-500" />
              </div>

              <dl className="mt-6 space-y-2.5 rounded-carte bg-white/[.06] p-4 text-[14px] ring-1 ring-white/10">
                <div className="flex justify-between"><dt className="text-indigo-300">Chiffre d'affaires</dt><dd className="chiffre">{fcfa(revenu)}</dd></div>
                <div className="flex justify-between"><dt className="text-indigo-300">Matière et production</dt><dd className="chiffre">− {fcfa(couts)}</dd></div>
                <div className="flex items-baseline justify-between border-t border-white/10 pt-3">
                  <dt className="font-semibold">Bénéfice mensuel</dt>
                  <dd className={`chiffre text-[26px] ${benefice >= 0 ? "text-mil-500" : "text-henne-100"}`}>{fcfa(benefice)}</dd>
                </div>
              </dl>
              <p className="mt-4 text-[14px] leading-relaxed text-indigo-300">
                {retour
                  ? `Avec l'investissement minimum, il faut environ ${retour} mois pour rentrer dans vos frais.`
                  : "À ce prix d'achat, l'activité n'est pas rentable. Négociez la matière ou augmentez le volume."}
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
