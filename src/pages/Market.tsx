import { useCallback, useMemo, useState } from "react";
import { Search, Plus, MapPin, GitCompareArrows, Check, ShoppingBag, ReceiptText } from "lucide-react";
import { MATIERES, QUALITES, QUARTIERS, fcfa, kg, matiere, type Annonce, type MatiereId, type Produit } from "../data/donnees";
import { useEtat } from "../store";
import { EnTete, Feuille, Filtres, IconeMatiere, PastilleMatiere, Segments, Toast, EtatVide } from "../components/ui";

type Tri = "recent" | "prix" | "quantite";

const QUALITE_STYLE: Record<Annonce["qualite"], string> = {
  A: "bg-fleuve-100 text-menthe",
  B: "bg-mil-100 text-mil-600",
  C: "bg-henne-100 text-henne-600",
};

function FormulairePublication({ type, fermer, notifier }: { type: "matiere" | "produit"; fermer: () => void; notifier: (m: string) => void }) {
  const { publierAnnonce, publierProduit, nom } = useEtat();
  const [mat, setMat] = useState<MatiereId>("pet");
  const [titre, setTitre] = useState("");
  const [quantite, setQuantite] = useState(100);
  const [prix, setPrix] = useState(matiere("pet").prixKg + 50);
  const [qualite, setQualite] = useState<Annonce["qualite"]>("A");
  const [quartier, setQuartier] = useState("Plateau");
  const [description, setDescription] = useState("");
  const vendeur = nom || "Mon entreprise";

  const publier = () => {
    if (type === "matiere") {
      publierAnnonce({ titre: titre || matiere(mat).nom, matiere: mat, quantiteKg: quantite, qualite, prixKg: prix, quartier, vendeur, description: description || "Annonce publiée depuis l'application." });
    } else {
      publierProduit({ nom: titre || "Nouveau produit", prix, atelier: vendeur, quartier, matiere: mat, emoji: matiere(mat).emoji });
    }
    notifier(type === "matiere" ? "Annonce publiée" : "Produit publié");
    fermer();
  };

  return (
    <div className="space-y-4">
      <div>
        <p className="etiquette">Matière</p>
        <div className="flex flex-wrap gap-2">
          {MATIERES.map((x) => (
            <button
              key={x.id}
              onClick={() => setMat(x.id)}
              className="filtre"
              style={mat === x.id ? { background: x.teinte, borderColor: x.teinte, color: "#06140F" } : { borderColor: "rgba(255,255,255,0.1)", color: "#B4C7BD", background: "rgba(255,255,255,0.065)" }}
            >
              {x.emoji} {x.nom}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="etiquette" htmlFor="titre">{type === "matiere" ? "Titre de l'annonce" : "Nom du produit"}</label>
        <input id="titre" className="champ" value={titre} onChange={(e) => setTitre(e.target.value)} placeholder={type === "matiere" ? "Ex. Bouteilles PET lavées" : "Ex. Sac cabas tissé"} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        {type === "matiere" && (
          <div>
            <label className="etiquette" htmlFor="qte">Quantité (kg)</label>
            <input id="qte" type="number" inputMode="numeric" className="champ" value={quantite} onChange={(e) => setQuantite(+e.target.value || 0)} />
          </div>
        )}
        <div className={type === "produit" ? "col-span-2" : ""}>
          <label className="etiquette" htmlFor="px">{type === "matiere" ? "Prix (FCFA/kg)" : "Prix (FCFA)"}</label>
          <input id="px" type="number" inputMode="numeric" className="champ" value={prix} onChange={(e) => setPrix(+e.target.value || 0)} />
        </div>
      </div>
      {type === "matiere" && (
        <div>
          <p className="etiquette">Qualité</p>
          <div className="grid gap-2">
            {(Object.keys(QUALITES) as Annonce["qualite"][]).map((q) => (
              <button key={q} onClick={() => setQualite(q)} className={`rounded-tuile border px-4 py-3 text-left text-[14px] font-medium transition ${qualite === q ? "border-menthe/60 bg-menthe/10" : "border-gris-200"}`}>
                {QUALITES[q]}
              </button>
            ))}
          </div>
        </div>
      )}
      <div>
        <label className="etiquette" htmlFor="qp">Quartier</label>
        <select id="qp" className="champ" value={quartier} onChange={(e) => setQuartier(e.target.value)}>
          {QUARTIERS.map((q) => <option key={q}>{q}</option>)}
        </select>
      </div>
      {type === "matiere" && (
        <div>
          <label className="etiquette" htmlFor="desc">Description</label>
          <textarea id="desc" rows={3} className="champ h-auto py-3" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="État, conditionnement, disponibilité" />
        </div>
      )}
      <button className="btn-action w-full" onClick={publier}>Publier</button>
    </div>
  );
}

export default function Market() {
  const { annonces, produits, commandes, passerCommande } = useEtat();
  const [vue, setVue] = useState<"matieres" | "produits">("matieres");
  const [filtre, setFiltre] = useState<MatiereId | "toutes">("toutes");
  const [recherche, setRecherche] = useState("");
  const [tri, setTri] = useState<Tri>("recent");
  const [comparer, setComparer] = useState<string[]>([]);
  const [comparaison, setComparaison] = useState(false);
  const [detail, setDetail] = useState<Annonce | null>(null);
  const [produit, setProduit] = useState<Produit | null>(null);
  const [quantite, setQuantite] = useState(100);
  const [publication, setPublication] = useState(false);
  const [mesCommandes, setMesCommandes] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const fermerToast = useCallback(() => setToast(null), []);

  const q = recherche.trim().toLowerCase();
  const liste = useMemo(() => {
    const r = annonces.filter(
      (a) => (filtre === "toutes" || a.matiere === filtre) && (!q || `${a.titre} ${a.quartier} ${a.vendeur}`.toLowerCase().includes(q))
    );
    if (tri === "prix") return [...r].sort((a, b) => a.prixKg - b.prixKg);
    if (tri === "quantite") return [...r].sort((a, b) => b.quantiteKg - a.quantiteKg);
    return r;
  }, [annonces, filtre, q, tri]);

  const listeProduits = produits.filter(
    (p) => (filtre === "toutes" || p.matiere === filtre) && (!q || `${p.nom} ${p.atelier}`.toLowerCase().includes(q))
  );

  const basculer = (id: string) =>
    setComparer((c) => (c.includes(id) ? c.filter((x) => x !== id) : c.length >= 3 ? c : [...c, id]));
  const compares = annonces.filter((a) => comparer.includes(a.id));

  const ouvrirDetail = (a: Annonce) => {
    setDetail(a);
    setQuantite(Math.min(100, a.quantiteKg));
  };

  const acheter = () => {
    if (!detail) return;
    passerCommande({ type: "matiere", libelle: detail.titre, quantite, unite: "kg", montant: quantite * detail.prixKg, contrepartie: detail.vendeur });
    setDetail(null);
    setToast("Demande d'achat envoyée");
  };

  return (
    <div>
      <EnTete
        titre="Tsafta Market"
        sousTitre="Matières recyclables et produits recyclés"
        droite={
          <div className="flex gap-2">
            <button onClick={() => setMesCommandes(true)} aria-label="Mes achats" className="relative grid h-11 w-11 place-items-center rounded-full bg-verre shadow-doux">
              <ShoppingBag size={19} />
              {commandes.length > 0 && <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-mil-500 px-1 text-[11px] font-bold text-indigo-950">{commandes.length}</span>}
            </button>
            <button onClick={() => setPublication(true)} aria-label="Publier" className="grid h-11 w-11 place-items-center rounded-full bg-menthe text-menthe-fonce shadow-bouton">
              <Plus size={21} />
            </button>
          </div>
        }
      />

      <div className="space-y-4 px-5">
        <Segments options={[{ id: "matieres", label: "Matières" }, { id: "produits", label: "Produits recyclés" }]} valeur={vue} changer={setVue} />

        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gris-400" />
          <input className="champ pl-11" placeholder="Rechercher une matière, un quartier, un vendeur" value={recherche} onChange={(e) => setRecherche(e.target.value)} aria-label="Rechercher" />
        </div>

        <Filtres
          options={[{ id: "toutes" as const, label: "Toutes" }, ...MATIERES.map((m) => ({ id: m.id, label: `${m.emoji} ${m.nom}` }))]}
          valeur={filtre}
          changer={setFiltre}
        />

        {vue === "matieres" ? (
          <>
            <div className="flex items-center justify-between">
              <p className="text-[14px] text-gris-500">{liste.length} annonces</p>
              <select className="h-9 rounded-full border border-gris-200 bg-verre px-3 text-[13px] font-semibold text-gris-600" value={tri} onChange={(e) => setTri(e.target.value as Tri)} aria-label="Trier">
                <option value="recent">Plus récentes</option>
                <option value="prix">Prix croissant</option>
                <option value="quantite">Plus grandes quantités</option>
              </select>
            </div>

            {liste.length === 0 ? (
              <EtatVide icone={<Search size={24} />} titre="Aucune annonce trouvée" texte="Modifiez la recherche ou choisissez une autre matière." />
            ) : (
              <div className="space-y-3">
                {liste.map((a) => {
                  const m = matiere(a.matiere);
                  const coche = comparer.includes(a.id);
                  return (
                    <article key={a.id} className="carte overflow-hidden">
                      <button onClick={() => ouvrirDetail(a)} className="block w-full p-4 text-left">
                        <div className="flex items-start gap-3.5">
                          <IconeMatiere id={a.matiere} taille={52} />
                          <div className="min-w-0 flex-1">
                            <p className="font-display text-[16px] font-bold leading-snug">{a.titre}</p>
                            <p className="mt-1 flex items-center gap-1 text-[13px] text-gris-500"><MapPin size={13} /> {a.quartier}, {a.vendeur}</p>
                          </div>
                        </div>
                        <div className="mt-4 grid grid-cols-3 gap-2 rounded-tuile p-3" style={{ background: m.fond }}>
                          <div>
                            <p className="text-[11px] font-semibold" style={{ color: m.teinte }}>Prix</p>
                            <p className="chiffre text-[15px]">{a.prixKg} <span className="text-[11px] font-semibold text-gris-500">F/kg</span></p>
                          </div>
                          <div>
                            <p className="text-[11px] font-semibold" style={{ color: m.teinte }}>Quantité</p>
                            <p className="chiffre text-[15px]">{kg(a.quantiteKg)}</p>
                          </div>
                          <div>
                            <p className="text-[11px] font-semibold" style={{ color: m.teinte }}>Qualité</p>
                            <p className="chiffre text-[15px]">{a.qualite}</p>
                          </div>
                        </div>
                      </button>
                      <button
                        onClick={() => basculer(a.id)}
                        className={`flex w-full items-center justify-center gap-2 border-t border-gris-100 py-2.5 text-[13px] font-semibold transition ${coche ? "bg-menthe text-menthe-fonce" : "text-gris-600"}`}
                        aria-pressed={coche}
                      >
                        {coche ? <Check size={15} /> : <GitCompareArrows size={15} />}
                        {coche ? "Ajoutée à la comparaison" : "Comparer"}
                      </button>
                    </article>
                  );
                })}
              </div>
            )}
          </>
        ) : listeProduits.length === 0 ? (
          <EtatVide icone={<Search size={24} />} titre="Aucun produit trouvé" texte="Modifiez la recherche ou publiez vos propres produits." />
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {listeProduits.map((p) => (
              <button key={p.id} onClick={() => setProduit(p)} className="carte flex flex-col overflow-hidden text-left">
                <span className="grid aspect-square place-items-center text-[52px]" style={{ background: matiere(p.matiere).fond }}>{p.emoji}</span>
                <span className="flex flex-1 flex-col p-3.5">
                  <span className="text-[14px] font-semibold leading-snug">{p.nom}</span>
                  <span className="mt-1 text-[12px] text-gris-500">{p.atelier}</span>
                  <span className="chiffre mt-auto pt-3 text-[16px] text-menthe">{fcfa(p.prix)}</span>
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Barre de comparaison */}
      {vue === "matieres" && comparer.length > 0 && (
        <div className="fixed inset-x-0 bottom-[92px] z-30 flex justify-center px-5">
          <div className="flex w-full max-w-md animate-fondu items-center gap-3 rounded-full bg-verre p-1.5 pl-5 shadow-haut">
            <span className="flex-1 text-[14px] font-semibold">{comparer.length} sur 3 sélectionnées</span>
            <button className="btn-sm btn bg-menthe text-menthe-fonce" disabled={comparer.length < 2} onClick={() => setComparaison(true)}>Comparer</button>
          </div>
        </div>
      )}

      <Feuille ouvert={comparaison} fermer={() => setComparaison(false)} titre="Comparaison">
        <div className="-mx-5 overflow-x-auto px-5">
          <table className="w-full min-w-[320px] text-[14px]">
            <thead>
              <tr>
                <th className="w-24" />
                {compares.map((a) => (
                  <th key={a.id} className="px-2 pb-3 text-left align-top">
                    <IconeMatiere id={a.matiere} taille={38} />
                    <p className="mt-2 font-display text-[14px] font-bold leading-tight">{a.titre}</p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gris-100">
              {[
                ["Prix", (a: Annonce) => `${a.prixKg} F/kg`, (a: Annonce) => a.prixKg === Math.min(...compares.map((x) => x.prixKg))],
                ["Quantité", (a: Annonce) => kg(a.quantiteKg), (a: Annonce) => a.quantiteKg === Math.max(...compares.map((x) => x.quantiteKg))],
                ["Qualité", (a: Annonce) => a.qualite, (a: Annonce) => a.qualite === "A"],
                ["Quartier", (a: Annonce) => a.quartier, () => false],
                ["Valeur du lot", (a: Annonce) => fcfa(a.prixKg * a.quantiteKg), () => false],
              ].map(([label, f, meilleur]) => (
                <tr key={label as string}>
                  <td className="py-3 text-[13px] text-gris-500">{label as string}</td>
                  {compares.map((a) => (
                    <td key={a.id} className={`px-2 py-3 font-semibold ${(meilleur as (a: Annonce) => boolean)(a) ? "text-menthe" : ""}`}>
                      {(f as (a: Annonce) => string)(a)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-[13px] text-gris-500">Les meilleures valeurs sont en vert.</p>
        <button className="btn-doux mt-4 w-full" onClick={() => { setComparer([]); setComparaison(false); }}>Vider la comparaison</button>
      </Feuille>

      <Feuille ouvert={!!detail} fermer={() => setDetail(null)} titre="Détail de l'annonce">
        {detail && (
          <div>
            <div className="flex items-center gap-3.5">
              <IconeMatiere id={detail.matiere} taille={56} />
              <div>
                <p className="font-display text-[19px] font-bold leading-tight">{detail.titre}</p>
                <p className="mt-1 text-[14px] text-gris-500">{detail.vendeur}</p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <PastilleMatiere id={detail.matiere} />
              <span className={`puce ${QUALITE_STYLE[detail.qualite]}`}>Qualité {detail.qualite}</span>
              <span className="puce bg-indigo-50 text-indigo-700"><MapPin size={12} /> {detail.quartier}</span>
            </div>
            <p className="mt-4 text-[15px] leading-relaxed text-gris-600">{detail.description}</p>
            <p className="mt-2 text-[13px] text-gris-500">{QUALITES[detail.qualite]}</p>

            <div className="mt-5 rounded-carte bg-white/[.05] p-4">
              <div className="flex items-center justify-between">
                <label htmlFor="qa" className="text-[14px] font-semibold">Quantité souhaitée</label>
                <span className="text-[13px] text-gris-500">sur {kg(detail.quantiteKg)}</span>
              </div>
              <input id="qa" type="range" min={10} max={detail.quantiteKg} step={10} value={quantite} onChange={(e) => setQuantite(+e.target.value)} className="mt-3 w-full accent-mil-500" />
              <div className="mt-2 flex items-baseline justify-between">
                <span className="chiffre text-[20px]">{kg(quantite)}</span>
                <span className="chiffre text-[24px] text-menthe">{fcfa(quantite * detail.prixKg)}</span>
              </div>
            </div>
            <button className="btn-action mt-5 w-full" onClick={acheter}>Envoyer une demande d'achat</button>
            <p className="mt-3 text-center text-[13px] text-gris-500">Le vendeur confirme la disponibilité avant tout paiement.</p>
          </div>
        )}
      </Feuille>

      <Feuille ouvert={!!produit} fermer={() => setProduit(null)} titre={produit?.nom ?? ""}>
        {produit && (
          <div>
            <div className="grid aspect-[16/10] place-items-center rounded-carte text-[80px]" style={{ background: matiere(produit.matiere).fond }}>{produit.emoji}</div>
            <div className="mt-4 flex items-center justify-between">
              <div>
                <p className="text-[15px] font-semibold">{produit.atelier}</p>
                <p className="mt-0.5 flex items-center gap-1 text-[13px] text-gris-500"><MapPin size={13} /> {produit.quartier}</p>
              </div>
              <p className="chiffre text-[24px] text-menthe">{fcfa(produit.prix)}</p>
            </div>
            <div className="mt-3"><PastilleMatiere id={produit.matiere} /></div>
            <button
              className="btn-action mt-5 w-full"
              onClick={() => {
                passerCommande({ type: "produit", libelle: produit.nom, quantite: 1, unite: "pièce", montant: produit.prix, contrepartie: produit.atelier });
                setProduit(null);
                setToast("Commande envoyée à l'atelier");
              }}
            >
              Commander
            </button>
          </div>
        )}
      </Feuille>

      <Feuille ouvert={publication} fermer={() => setPublication(false)} titre={vue === "matieres" ? "Vendre une matière" : "Vendre un produit"}>
        <FormulairePublication type={vue === "matieres" ? "matiere" : "produit"} fermer={() => setPublication(false)} notifier={setToast} />
      </Feuille>

      <Feuille ouvert={mesCommandes} fermer={() => setMesCommandes(false)} titre="Mes achats">
        {commandes.length === 0 ? (
          <EtatVide icone={<ReceiptText size={24} />} titre="Aucun achat pour le moment" texte="Vos demandes d'achat et commandes apparaîtront ici." />
        ) : (
          <div className="divide-y divide-gris-100">
            {commandes.map((c) => (
              <div key={c.id} className="flex items-center justify-between gap-3 py-3.5">
                <div className="min-w-0">
                  <p className="truncate text-[15px] font-semibold">{c.libelle}</p>
                  <p className="text-[13px] text-gris-500">{c.quantite.toLocaleString("fr-FR")} {c.unite}, {c.contrepartie}</p>
                </div>
                <div className="text-right">
                  <p className="chiffre text-[15px]">{fcfa(c.montant)}</p>
                  <span className="puce mt-1 bg-mil-100 text-mil-600">En attente</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Feuille>

      <Toast message={toast} fermer={fermerToast} />
    </div>
  );
}
