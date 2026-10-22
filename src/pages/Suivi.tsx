import { useState } from "react";
import { Download, ChevronDown } from "lucide-react";
import { MATIERES, fcfa, kg, matiere } from "../data/donnees";
import { useEtat } from "../store";
import { EnTete, IconeMatiere, MotifTisse } from "../components/ui";

function grouper<T>(liste: T[], cle: (x: T) => string, val: (x: T) => number) {
  const m = new Map<string, number>();
  liste.forEach((x) => m.set(cle(x), (m.get(cle(x)) ?? 0) + val(x)));
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
}

export default function Suivi() {
  const { transactions, reinitialiser } = useEtat();
  const [tout, setTout] = useState(false);
  const [confirmer, setConfirmer] = useState(false);
  const apercu = import.meta.env.VITE_APERCU === "1";
  const poids = transactions.reduce((s, t) => s + t.poidsKg, 0);
  const valeur = transactions.reduce((s, t) => s + t.poidsKg * t.prixKg, 0);
  const parMatiere = MATIERES.map((m) => ({ m, kg: transactions.filter((t) => t.matiere === m.id).reduce((s, t) => s + t.poidsKg, 0) }))
    .filter((x) => x.kg > 0)
    .sort((a, b) => b.kg - a.kg);
  const parQuartier = grouper(transactions, (t) => t.quartier, (t) => t.poidsKg).slice(0, 5);
  const parDestination = grouper(transactions, (t) => t.destination, (t) => t.poidsKg);
  const maxQ = parQuartier[0]?.[1] ?? 1;

  const exporter = () => {
    const lignes = [
      ["Code", "Date", "Matière", "Poids (kg)", "Prix (FCFA/kg)", "Collecteur", "Quartier", "Destination"],
      ...transactions.map((t) => [`TSF-${t.id}`, t.date, matiere(t.matiere).nom, t.poidsKg, t.prixKg, t.collecteur, t.quartier, t.destination]),
    ];
    const csv = lignes.map((l) => l.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(";")).join("\n");
    const lien = document.createElement("a");
    lien.href = URL.createObjectURL(new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" }));
    lien.download = "tsafta-tracabilite.csv";
    lien.click();
  };

  return (
    <div>
      <EnTete
        titre="Traçabilité"
        sousTitre="Ce qui est collecté, échangé et transformé"
        droite={
          !apercu && <button onClick={exporter} aria-label="Exporter en CSV" className="grid h-11 w-11 place-items-center rounded-full bg-white shadow-doux">
            <Download size={19} />
          </button>
        }
      />
      <div className="space-y-6 px-5">
        <div className="relative overflow-hidden rounded-hero bg-indigo-900 p-6 text-white shadow-haut">
          <MotifTisse id="motif-suivi" />
          <div className="relative">
            <p className="text-[14px] font-medium text-indigo-300">Matières tracées à Niamey</p>
            <p className="chiffre mt-1 text-[44px] leading-none">{kg(poids)}</p>
            {/* Barre empilée par matière */}
            <div className="mt-5 flex h-3 overflow-hidden rounded-full bg-white/10" role="img" aria-label="Répartition par matière">
              {parMatiere.map(({ m, kg: k }) => <span key={m.id} style={{ width: `${(k / poids) * 100}%`, background: m.teinte }} className="border-r border-indigo-900 last:border-0" />)}
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-tuile bg-white/[.06] p-3.5 ring-1 ring-white/10">
                <p className="text-[12px] text-indigo-300">Transactions</p>
                <p className="chiffre mt-1 text-[20px]">{transactions.length}</p>
              </div>
              <div className="rounded-tuile bg-white/[.06] p-3.5 ring-1 ring-white/10">
                <p className="text-[12px] text-indigo-300">Versé aux citoyens</p>
                <p className="chiffre mt-1 whitespace-nowrap text-[17px] text-mil-500">{fcfa(valeur)}</p>
              </div>
            </div>
          </div>
        </div>

        <section>
          <h2 className="titre-section mb-3">Par matière</h2>
          <div className="carte space-y-4 p-5">
            {parMatiere.map(({ m, kg: k }) => (
              <div key={m.id}>
                <div className="flex items-center justify-between text-[14px]">
                  <span className="flex items-center gap-2 font-semibold"><span className="h-2.5 w-2.5 rounded-full" style={{ background: m.teinte }} />{m.nom}</span>
                  <span className="chiffre">{kg(k)}</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full" style={{ background: m.fond }}>
                  <div className="h-full rounded-full" style={{ width: `${(k / parMatiere[0].kg) * 100}%`, background: m.teinte }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="titre-section mb-3">Quartiers les plus actifs</h2>
          <div className="carte p-5">
            <div className="flex h-36 items-end justify-between gap-3">
              {parQuartier.map(([q, k]) => (
                <div key={q} className="flex flex-1 flex-col items-center gap-2">
                  <span className="chiffre text-[12px] text-gris-600">{Math.round(k)}</span>
                  <div className="w-full rounded-t-[8px] bg-fleuve-600" style={{ height: `${(k / maxQ) * 88}px` }} />
                </div>
              ))}
            </div>
            <div className="mt-2 flex justify-between gap-3 border-t border-gris-100 pt-2">
              {parQuartier.map(([q]) => <span key={q} className="flex-1 truncate text-center text-[11px] font-semibold text-gris-500">{q}</span>)}
            </div>
          </div>
        </section>

        <section>
          <h2 className="titre-section mb-3">Destinations des matières</h2>
          <div className="carte divide-y divide-gris-100">
            {parDestination.map(([d, k]) => (
              <div key={d} className="flex items-center justify-between gap-3 p-4">
                <span className="text-[14px] font-medium">{d}</span>
                <span className="chiffre shrink-0 text-[14px]">{Math.round((k / poids) * 100)} %</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="titre-section mb-3">Registre des transactions</h2>
          <div className="carte divide-y divide-gris-100">
            {(tout ? transactions : transactions.slice(0, 6)).map((t) => (
              <div key={t.id} className="flex items-center gap-3.5 p-4">
                <IconeMatiere id={t.matiere} taille={42} />
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-semibold">{kg(t.poidsKg)} <span className="font-normal text-gris-500">de {matiere(t.matiere).nom.toLowerCase()}</span></p>
                  <p className="truncate text-[12px] text-gris-500">TSF-{t.id.toUpperCase()}, {t.collecteur}</p>
                </div>
                <span className="text-[12px] font-medium text-gris-400">{new Date(t.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}</span>
              </div>
            ))}
            {transactions.length > 6 && (
              <button onClick={() => setTout(!tout)} className="flex w-full items-center justify-center gap-1.5 py-3.5 text-[14px] font-semibold text-fleuve-600">
                {tout ? "Afficher moins" : `Afficher les ${transactions.length} transactions`} <ChevronDown size={16} className={tout ? "rotate-180" : ""} />
              </button>
            )}
          </div>
        </section>

        {confirmer ? (
          <div className="carte flex items-center gap-3 p-4">
            <p className="flex-1 text-[14px] font-medium">Remettre les données de démonstration à zéro ?</p>
            <button className="btn btn-sm bg-indigo-100 text-indigo-900" onClick={() => setConfirmer(false)}>Annuler</button>
            <button className="btn btn-sm bg-henne-600 text-white" onClick={() => { reinitialiser(); setConfirmer(false); }}>Réinitialiser</button>
          </div>
        ) : (
          <button onClick={() => setConfirmer(true)} className="w-full py-2 text-[13px] font-semibold text-gris-400">
            Réinitialiser les données de démonstration
          </button>
        )}
      </div>
    </div>
  );
}
