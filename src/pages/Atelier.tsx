import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowDownLeft, ArrowUpRight, Trash2, Plus, Store } from "lucide-react";
import { fcfa } from "../data/donnees";
import { useEtat } from "../store";
import { EnTete, Feuille, MotifTisse, Segments, Toast, EtatVide } from "../components/ui";

export default function Atelier() {
  const { journal, ajouterEcriture, supprimerEcriture, produits, nom } = useEtat();
  const [ouvert, setOuvert] = useState(false);
  const [type, setType] = useState<"vente" | "depense">("vente");
  const [libelle, setLibelle] = useState("");
  const [montant, setMontant] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const fermerToast = useCallback(() => setToast(null), []);

  const ventes = journal.filter((e) => e.type === "vente").reduce((s, e) => s + e.montant, 0);
  const depenses = journal.filter((e) => e.type === "depense").reduce((s, e) => s + e.montant, 0);
  const benefice = ventes - depenses;
  const marge = ventes > 0 ? Math.round((benefice / ventes) * 100) : 0;
  const mesProduits = produits.filter((p) => p.atelier === (nom || "Mon entreprise"));

  const enregistrer = () => {
    const m = Number(montant);
    if (!libelle.trim() || !m) return;
    ajouterEcriture({ type, libelle: libelle.trim(), montant: m });
    setLibelle("");
    setMontant("");
    setOuvert(false);
    setToast(type === "vente" ? "Vente enregistrée" : "Dépense enregistrée");
  };

  return (
    <div>
      <EnTete titre="Mon atelier" sousTitre="Les comptes de votre micro-entreprise" retour />
      <div className="space-y-5 px-5">
        <div className="relative overflow-hidden rounded-hero bg-indigo-900 p-6 text-white shadow-haut">
          <MotifTisse id="motif-atelier" />
          <div className="relative">
            <p className="text-[14px] font-medium text-indigo-300">Bénéfice cumulé</p>
            <p className={`chiffre mt-1 text-[40px] leading-none ${benefice >= 0 ? "text-mil-500" : "text-henne-100"}`}>{fcfa(benefice)}</p>
            <div className="mt-6 grid grid-cols-3 gap-2">
              {[
                ["Ventes", fcfa(ventes)],
                ["Dépenses", fcfa(depenses)],
                ["Marge", `${marge} %`],
              ].map(([k, v]) => (
                <div key={k} className="rounded-tuile bg-white/[.06] p-3 ring-1 ring-white/10">
                  <p className="text-[12px] text-indigo-300">{k}</p>
                  <p className="chiffre mt-1 text-[13px]">{v}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button className="btn-action" onClick={() => { setType("vente"); setOuvert(true); }}><Plus size={18} /> Une vente</button>
          <button className="btn-doux" onClick={() => { setType("depense"); setOuvert(true); }}><Plus size={18} /> Une dépense</button>
        </div>

        <section>
          <h2 className="titre-section mb-3">Journal</h2>
          {journal.length === 0 ? (
            <EtatVide icone={<Plus size={24} />} titre="Journal vide" texte="Enregistrez votre première vente ou dépense pour suivre votre bénéfice." />
          ) : (
            <div className="carte divide-y divide-gris-100">
              {journal.map((e) => (
                <div key={e.id} className="flex items-center gap-3.5 p-4">
                  <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${e.type === "vente" ? "bg-fleuve-100 text-fleuve-700" : "bg-henne-100 text-henne-600"}`}>
                    {e.type === "vente" ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[15px] font-semibold">{e.libelle}</p>
                    <p className="text-[13px] text-gris-500">{new Date(e.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}</p>
                  </div>
                  <p className={`chiffre text-[15px] ${e.type === "vente" ? "text-fleuve-700" : "text-henne-600"}`}>
                    {e.type === "vente" ? "+" : "−"} {fcfa(e.montant)}
                  </p>
                  <button onClick={() => supprimerEcriture(e.id)} aria-label={`Supprimer ${e.libelle}`} className="grid h-8 w-8 place-items-center rounded-full text-gris-400 hover:bg-brume">
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="titre-section mb-3">Mes produits en vente</h2>
          {mesProduits.length === 0 ? (
            <EtatVide
              icone={<Store size={24} />}
              titre="Aucun produit publié"
              texte="Publiez vos produits recyclés sur le Market pour trouver des acheteurs."
              action={<Link to="/market" className="btn-indigo btn-sm">Ouvrir le Market</Link>}
            />
          ) : (
            <div className="carte divide-y divide-gris-100">
              {mesProduits.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-4">
                  <span className="text-[15px] font-semibold">{p.emoji} {p.nom}</span>
                  <span className="chiffre text-[15px]">{fcfa(p.prix)}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <Feuille ouvert={ouvert} fermer={() => setOuvert(false)} titre="Nouvelle écriture">
        <Segments options={[{ id: "vente", label: "Vente" }, { id: "depense", label: "Dépense" }]} valeur={type} changer={setType} />
        <label className="etiquette mt-5" htmlFor="lib">Libellé</label>
        <input id="lib" className="champ" placeholder={type === "vente" ? "Ex. 10 carnets recyclés" : "Ex. Achat de cartons"} value={libelle} onChange={(e) => setLibelle(e.target.value)} />
        <label className="etiquette mt-4" htmlFor="mt">Montant (FCFA)</label>
        <input id="mt" type="number" inputMode="numeric" className="champ" placeholder="0" value={montant} onChange={(e) => setMontant(e.target.value)} />
        <button className="btn-action mt-6 w-full" disabled={!libelle.trim() || !Number(montant)} onClick={enregistrer}>
          Enregistrer {type === "vente" ? "la vente" : "la dépense"}
        </button>
      </Feuille>
      <Toast message={toast} fermer={fermerToast} />
    </div>
  );
}
