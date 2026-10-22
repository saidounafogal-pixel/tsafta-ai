import { useCallback, useState } from "react";
import { Search, Zap, Sun, Hand, Store } from "lucide-react";
import { fcfa, matiere } from "../data/donnees";
import { EQUIPEMENTS, type Energie, type Equipement } from "../data/savoirs";
import { useEtat } from "../store";
import { EnTete, Feuille, Filtres, PastilleMatiere, Toast, EtatVide } from "../components/ui";

type Categorie = Equipement["categorie"] | "toutes";

const ENERGIE: Record<Energie, { icone: typeof Zap; style: string }> = {
  Manuel: { icone: Hand, style: "bg-indigo-50 text-indigo-700" },
  Électrique: { icone: Zap, style: "bg-mil-100 text-mil-600" },
  Solaire: { icone: Sun, style: "bg-fleuve-100 text-menthe" },
};

const DISPO: Record<Equipement["disponibilite"], string> = {
  "En stock": "text-menthe",
  "Sur commande": "text-mil-600",
  "Location possible": "text-indigo-700",
};

export default function Equip() {
  const { passerCommande } = useEtat();
  const [cat, setCat] = useState<Categorie>("toutes");
  const [budget, setBudget] = useState(2000000);
  const [recherche, setRecherche] = useState("");
  const [choisi, setChoisi] = useState<Equipement | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const fermerToast = useCallback(() => setToast(null), []);

  const q = recherche.trim().toLowerCase();
  const liste = EQUIPEMENTS.filter(
    (e) => (cat === "toutes" || e.categorie === cat) && e.prix <= budget && (!q || `${e.nom} ${e.fournisseur} ${e.matieres.map((m) => matiere(m).nom).join(" ")}`.toLowerCase().includes(q))
  );

  return (
    <div>
      <EnTete titre="Tsafta Equip" sousTitre="Machines et outils pour votre activité" retour />
      <div className="space-y-4 px-5">
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gris-400" />
          <input className="champ pl-11" placeholder="Machine, matière, fournisseur" value={recherche} onChange={(e) => setRecherche(e.target.value)} aria-label="Rechercher" />
        </div>
        <Filtres
          options={(["toutes", "Broyage", "Transformation", "Mesure", "Sécurité", "Manutention"] as Categorie[]).map((c) => ({ id: c, label: c === "toutes" ? "Tout" : c }))}
          valeur={cat}
          changer={setCat}
        />
        <div className="carte p-4">
          <div className="flex justify-between text-[14px]">
            <label htmlFor="budget" className="font-semibold">Budget maximum</label>
            <span className="chiffre text-menthe">{fcfa(budget)}</span>
          </div>
          <input id="budget" type="range" min={20000} max={2000000} step={10000} value={budget} onChange={(e) => setBudget(+e.target.value)} className="mt-3 w-full accent-mil-500" />
        </div>

        {liste.length === 0 ? (
          <EtatVide icone={<Search size={24} />} titre="Aucun équipement dans ce budget" texte="Augmentez le budget ou pensez à la location." />
        ) : (
          <div className="space-y-3">
            {liste.map((e) => {
              const E = ENERGIE[e.energie];
              return (
                <button key={e.id} onClick={() => setChoisi(e)} className="carte block w-full p-4 text-left">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-display text-[16px] font-bold leading-snug">{e.nom}</p>
                      <p className="mt-0.5 text-[13px] text-gris-500">{e.fournisseur}</p>
                    </div>
                    <span className={`puce shrink-0 ${E.style}`}><E.icone size={12} /> {e.energie}</span>
                  </div>
                  <div className="mt-4 flex items-end justify-between">
                    <div>
                      <p className="text-[13px] text-gris-500">{e.capacite}</p>
                      <p className={`mt-0.5 text-[13px] font-semibold ${DISPO[e.disponibilite]}`}>{e.disponibilite}</p>
                    </div>
                    <p className="chiffre text-[19px]">{fcfa(e.prix)}</p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <Feuille ouvert={!!choisi} fermer={() => setChoisi(null)} titre={choisi?.nom ?? ""}>
        {choisi && (
          <div>
            <p className="text-[15px] leading-relaxed text-gris-600">{choisi.description}</p>
            <dl className="mt-5 divide-y divide-gris-100 rounded-carte bg-white/[.05] px-4">
              {[
                ["Capacité", choisi.capacite],
                ["Énergie", choisi.energie],
                ["Disponibilité", choisi.disponibilite],
                ["Fournisseur", choisi.fournisseur],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between py-3 text-[14px]">
                  <dt className="text-gris-500">{k}</dt>
                  <dd className="font-semibold">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="etiquette mt-5">Adapté pour</p>
            <div className="flex flex-wrap gap-2">
              {choisi.matieres.map((m) => <PastilleMatiere key={m} id={m} />)}
            </div>
            <div className="mt-6 flex items-baseline justify-between">
              <span className="text-[15px] text-gris-500">Prix indicatif</span>
              <span className="chiffre text-[26px]">{fcfa(choisi.prix)}</span>
            </div>
            <button
              className="btn-action mt-5 w-full"
              onClick={() => {
                passerCommande({ type: "devis", libelle: choisi.nom, quantite: 1, unite: "unité", montant: choisi.prix, contrepartie: choisi.fournisseur });
                setChoisi(null);
                setToast("Demande de devis envoyée");
              }}
            >
              <Store size={18} /> Demander un devis
            </button>
          </div>
        )}
      </Feuille>
      <Toast message={toast} fermer={fermerToast} />
    </div>
  );
}
