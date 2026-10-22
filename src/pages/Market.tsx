import { useCallback, useMemo, useState, type ReactNode } from "react";
import {
  Search, Plus, MapPin, GitCompareArrows, Check, ShoppingBag, ReceiptText, Star, BadgeCheck, Cog, Hammer, Scale, ShieldCheck, Truck,
  Zap, Sun, Hand, Store, Package, ChevronRight, MessageCircle,
} from "lucide-react";
import { MATIERES, QUALITES, QUARTIERS, fcfa, kg, matiere, type Annonce, type MatiereId } from "../data/donnees";
import { EQUIPEMENTS, type Equipement } from "../data/savoirs";
import { VENDEURS, vendeur, vendeurParNom, FOURNISSEURS, type ProduitMarche, type TypeVendeur, type Vendeur, type CategorieProduit } from "../data/marche";
import { useEtat } from "../store";
import { EnTete, Feuille, Filtres, IconeMatiere, PastilleMatiere, Toast, EtatVide } from "../components/ui";
import Visuel from "../components/Visuel";

type Onglet = "accueil" | "matieres" | "produits" | "equipements" | "vendeurs";
type Tri = "recent" | "prix" | "quantite";

const QUALITE_STYLE: Record<Annonce["qualite"], string> = {
  A: "bg-menthe text-menthe-fonce",
  B: "bg-mil-500 text-[#2A1300]",
  C: "bg-henne-600 text-[#2A0A05]",
};

const ICONE_EQUIP: Record<Equipement["categorie"], typeof Cog> = {
  Broyage: Cog, Transformation: Hammer, Mesure: Scale, Sécurité: ShieldCheck, Manutention: Truck,
};
const ICONE_ENERGIE = { Manuel: Hand, Électrique: Zap, Solaire: Sun };

const CATEGORIES: CategorieProduit[] = ["Maison et jardin", "Mode et accessoires", "Décoration", "Papeterie", "Construction", "Agriculture", "Énergie"];
const TYPES_VENDEUR: TypeVendeur[] = ["Collecteur", "Coopérative", "Recycleur", "Atelier", "Fournisseur"];

const STYLE_TYPE: Record<TypeVendeur, string> = {
  Collecteur: "#45E0A0", Coopérative: "#CDDA5C", Recycleur: "#5AB4F5", Atelier: "#FF9A2E", Fournisseur: "#B3BFD1",
};

/* ---------- Petits éléments ---------- */

function Puce({ children, sombre }: { children: ReactNode; sombre?: boolean }) {
  return <span className={`puce px-2.5 py-1 text-[11px] ${sombre ? "bg-black/45 text-white backdrop-blur" : ""}`}>{children}</span>;
}

function Note({ v }: { v: number }) {
  return (
    <span className="flex items-center gap-0.5 text-[12px] font-bold">
      <Star size={12} className="fill-mil-500 text-mil-500" /> {v.toFixed(1)}
    </span>
  );
}

function AvatarVendeur({ v, taille = 44 }: { v: Vendeur; taille?: number }) {
  const c = STYLE_TYPE[v.type];
  const init = v.nom.split(" ").filter((x) => x.length > 2).slice(0, 2).map((x) => x[0]).join("");
  return (
    <span className="relative grid shrink-0 place-items-center rounded-full font-display font-extrabold" style={{ width: taille, height: taille, background: `${c}26`, color: c, boxShadow: `inset 0 0 0 1.5px ${c}66`, fontSize: taille * 0.34 }}>
      {init}
      {v.verifie && <BadgeCheck size={taille * 0.36} className="absolute -bottom-0.5 -right-0.5 rounded-full bg-[#0B241B] text-menthe" />}
    </span>
  );
}

function EnTeteSection({ titre, voir }: { titre: string; voir?: () => void }) {
  return (
    <div className="flex items-baseline justify-between px-5">
      <h2 className="titre-section">{titre}</h2>
      {voir && <button onClick={voir} className="text-[14px] font-bold text-menthe">Tout voir</button>}
    </div>
  );
}

/* ---------- Cartes ---------- */

function CarteAnnonce({ a, ouvrir, large, comparer }: { a: Annonce; ouvrir: () => void; large?: boolean; comparer?: { coche: boolean; basculer: () => void } }) {
  return (
    <article className={`carte overflow-hidden ${large ? "" : "w-[264px] shrink-0"}`}>
      <button onClick={ouvrir} className="block w-full text-left">
        <Visuel mat={a.matiere} arrondi="rounded-none" coin={<><Puce sombre>{matiere(a.matiere).nom}</Puce><span className={`puce px-2.5 py-1 text-[11px] ${QUALITE_STYLE[a.qualite]}`}>Qualité {a.qualite}</span></>} />
        <div className="p-4">
          <p className="line-clamp-1 text-[15px] font-extrabold">{a.titre}</p>
          <p className="mt-1 flex items-center gap-1 truncate text-[12px] text-gris-500"><MapPin size={12} /> {a.quartier}, {a.vendeur}</p>
          <div className="mt-3 flex items-end justify-between">
            <p className="chiffre text-[20px] text-mil-500">{a.prixKg} <span className="text-[12px] font-bold text-gris-500">FCFA/kg</span></p>
            <p className="text-[13px] font-bold text-gris-600">{kg(a.quantiteKg)}</p>
          </div>
        </div>
      </button>
      {comparer && (
        <button onClick={comparer.basculer} aria-pressed={comparer.coche} className={`flex w-full items-center justify-center gap-2 border-t border-white/[.07] py-2.5 text-[13px] font-bold transition ${comparer.coche ? "bg-menthe text-menthe-fonce" : "text-gris-500"}`}>
          {comparer.coche ? <Check size={15} /> : <GitCompareArrows size={15} />}
          {comparer.coche ? "Ajouté à la comparaison" : "Comparer"}
        </button>
      )}
    </article>
  );
}

function CarteProduit({ p, ouvrir, etroite }: { p: ProduitMarche; ouvrir: () => void; etroite?: boolean }) {
  return (
    <button onClick={ouvrir} className={`carte flex flex-col overflow-hidden text-left ${etroite ? "w-[220px] shrink-0" : ""}`}>
      <Visuel photo={p.image} mat={p.matiere} symbole={p.emoji} arrondi="rounded-none" />
      <span className="flex flex-1 flex-col p-3.5">
        <span className="line-clamp-2 min-h-[36px] text-[13.5px] font-bold leading-snug">{p.nom}</span>
        <span className="mt-1 truncate text-[11.5px] text-gris-500">{p.atelier}</span>
        <span className="chiffre mt-2.5 text-[16px] text-mil-500">{fcfa(p.prix)}</span>
      </span>
    </button>
  );
}

function CarteEquipement({ e, ouvrir, etroite }: { e: Equipement; ouvrir: () => void; etroite?: boolean }) {
  const I = ICONE_EQUIP[e.categorie];
  const En = ICONE_ENERGIE[e.energie];
  return (
    <button onClick={ouvrir} className={`carte overflow-hidden text-left ${etroite ? "w-[240px] shrink-0" : "w-full"}`}>
      <Visuel mat={e.matieres[0]} symbole={<I size={38} strokeWidth={1.8} />} arrondi="rounded-none" coin={<Puce sombre><En size={11} /> {e.energie}</Puce>} />
      <div className="p-4">
        <p className="line-clamp-1 text-[15px] font-extrabold">{e.nom}</p>
        <p className="mt-0.5 text-[12px] text-gris-500">{e.fournisseur}, {e.capacite}</p>
        <div className="mt-3 flex items-end justify-between">
          <p className="chiffre whitespace-nowrap text-[17px] text-mil-500">{fcfa(e.prix)}</p>
          <p className={`whitespace-nowrap text-[11px] font-bold ${e.disponibilite === "En stock" ? "text-menthe" : "text-mil-600"}`}>{e.disponibilite}</p>
        </div>
      </div>
    </button>
  );
}

function CarteVendeur({ v, ouvrir, etroite, offres }: { v: Vendeur; ouvrir: () => void; etroite?: boolean; offres: number }) {
  return (
    <button onClick={ouvrir} className={`carte flex items-center gap-3.5 p-4 text-left ${etroite ? "w-[260px] shrink-0" : "w-full"}`}>
      <AvatarVendeur v={v} />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[15px] font-extrabold">{v.nom}</span>
        <span className="mt-0.5 flex items-center gap-2 text-[12px] text-gris-500">
          <span style={{ color: STYLE_TYPE[v.type] }} className="font-bold">{v.type}</span>
          <span>{v.quartier}</span>
        </span>
        <span className="mt-1 flex items-center gap-3 text-[12px] text-gris-500">
          <Note v={v.note} /> <span>{v.ventes} ventes</span> <span>{offres} offres</span>
        </span>
      </span>
      {!etroite && <ChevronRight size={18} className="text-gris-400" />}
    </button>
  );
}

/* ---------- Publication ---------- */

function FormulairePublication({ fermer, notifier }: { fermer: () => void; notifier: (m: string) => void }) {
  const { publierAnnonce, publierProduit, nom } = useEtat();
  const [type, setType] = useState<"matiere" | "produit">("matiere");
  const [mat, setMat] = useState<MatiereId>("pet");
  const [titre, setTitre] = useState("");
  const [quantite, setQuantite] = useState(100);
  const [prix, setPrix] = useState(175);
  const [qualite, setQualite] = useState<Annonce["qualite"]>("A");
  const [categorie, setCategorie] = useState<CategorieProduit>("Maison et jardin");
  const [quartier, setQuartier] = useState("Plateau");
  const [description, setDescription] = useState("");
  const vendeurNom = nom || "Mon entreprise";

  const publier = () => {
    if (type === "matiere") {
      publierAnnonce({ titre: titre || matiere(mat).nom, matiere: mat, quantiteKg: quantite, qualite, prixKg: prix, quartier, vendeur: vendeurNom, description: description || "Annonce publiée depuis l'application." });
    } else {
      publierProduit({ nom: titre || "Nouveau produit", prix, atelier: vendeurNom, vendeurId: "moi", quartier, matiere: mat, emoji: matiere(mat).emoji, categorie, description: description || "Produit fabriqué à partir de matières recyclées.", stock: quantite });
    }
    notifier(type === "matiere" ? "Annonce publiée" : "Produit publié");
    fermer();
  };

  return (
    <div className="space-y-4">
      <div className="verre grid grid-cols-2 rounded-full p-1">
        {(["matiere", "produit"] as const).map((t) => (
          <button key={t} onClick={() => { setType(t); setPrix(t === "matiere" ? 175 : 5000); setQuantite(t === "matiere" ? 100 : 10); }} className={`h-10 rounded-full text-[14px] font-bold ${type === t ? "bg-menthe text-menthe-fonce" : "text-gris-500"}`}>
            {t === "matiere" ? "Une matière" : "Un produit"}
          </button>
        ))}
      </div>
      <div>
        <p className="etiquette">Matière</p>
        <div className="flex flex-wrap gap-2">
          {MATIERES.map((x) => (
            <button key={x.id} onClick={() => setMat(x.id)} className="filtre" style={mat === x.id ? { background: x.teinte, borderColor: x.teinte, color: "#06140F" } : { borderColor: "rgba(255,255,255,0.1)", color: "#B4C7BD", background: "rgba(255,255,255,0.065)" }}>
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
        <div>
          <label className="etiquette" htmlFor="qte">{type === "matiere" ? "Quantité (kg)" : "Stock (pièces)"}</label>
          <input id="qte" type="number" inputMode="numeric" className="champ" value={quantite} onChange={(e) => setQuantite(+e.target.value || 0)} />
        </div>
        <div>
          <label className="etiquette" htmlFor="px">{type === "matiere" ? "Prix (FCFA/kg)" : "Prix (FCFA)"}</label>
          <input id="px" type="number" inputMode="numeric" className="champ" value={prix} onChange={(e) => setPrix(+e.target.value || 0)} />
        </div>
      </div>
      {type === "matiere" ? (
        <div>
          <p className="etiquette">Qualité</p>
          <div className="grid gap-2">
            {(Object.keys(QUALITES) as Annonce["qualite"][]).map((q) => (
              <button key={q} onClick={() => setQualite(q)} className={`rounded-tuile border px-4 py-3 text-left text-[14px] font-medium transition ${qualite === q ? "border-menthe/60 bg-menthe/10" : "border-white/10 bg-verre"}`}>{QUALITES[q]}</button>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <label className="etiquette" htmlFor="cat">Catégorie</label>
          <select id="cat" className="champ" value={categorie} onChange={(e) => setCategorie(e.target.value as CategorieProduit)}>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
      )}
      <div>
        <label className="etiquette" htmlFor="qp">Quartier</label>
        <select id="qp" className="champ" value={quartier} onChange={(e) => setQuartier(e.target.value)}>
          {QUARTIERS.map((q) => <option key={q}>{q}</option>)}
        </select>
      </div>
      <div>
        <label className="etiquette" htmlFor="desc">Description</label>
        <textarea id="desc" rows={3} className="champ h-auto py-3" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="État, conditionnement, disponibilité" />
      </div>
      <button className="btn-action w-full" onClick={publier}>Publier sur le Market</button>
    </div>
  );
}

/* ---------- Page ---------- */

export default function Market() {
  const { annonces, produits, commandes, passerCommande } = useEtat();
  const [onglet, setOnglet] = useState<Onglet>("accueil");
  const [recherche, setRecherche] = useState("");
  const [filtreMat, setFiltreMat] = useState<MatiereId | "toutes">("toutes");
  const [filtreCat, setFiltreCat] = useState<CategorieProduit | "toutes">("toutes");
  const [filtreEquip, setFiltreEquip] = useState<Equipement["categorie"] | "tous">("tous");
  const [filtreType, setFiltreType] = useState<TypeVendeur | "tous">("tous");
  const [tri, setTri] = useState<Tri>("recent");
  const [comparer, setComparer] = useState<string[]>([]);
  const [comparaison, setComparaison] = useState(false);
  const [annonce, setAnnonce] = useState<Annonce | null>(null);
  const [produit, setProduit] = useState<ProduitMarche | null>(null);
  const [equip, setEquip] = useState<Equipement | null>(null);
  const [boutique, setBoutique] = useState<Vendeur | null>(null);
  const [quantite, setQuantite] = useState(100);
  const [nbProduit, setNbProduit] = useState(1);
  const [publication, setPublication] = useState(false);
  const [mesCommandes, setMesCommandes] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const fermerToast = useCallback(() => setToast(null), []);

  const q = recherche.trim().toLowerCase();
  const correspond = (t: string) => !q || t.toLowerCase().includes(q);

  const listeAnnonces = useMemo(() => {
    const r = annonces.filter((a) => (filtreMat === "toutes" || a.matiere === filtreMat) && correspond(`${a.titre} ${a.quartier} ${a.vendeur} ${matiere(a.matiere).nom}`));
    if (tri === "prix") return [...r].sort((a, b) => a.prixKg - b.prixKg);
    if (tri === "quantite") return [...r].sort((a, b) => b.quantiteKg - a.quantiteKg);
    return r;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [annonces, filtreMat, q, tri]);
  const listeProduits = produits.filter((p) => (filtreCat === "toutes" || p.categorie === filtreCat) && correspond(`${p.nom} ${p.atelier} ${p.categorie}`));
  const listeEquip = EQUIPEMENTS.filter((e) => (filtreEquip === "tous" || e.categorie === filtreEquip) && correspond(`${e.nom} ${e.fournisseur}`));
  const listeVendeurs = VENDEURS.filter((v) => (filtreType === "tous" || v.type === filtreType) && correspond(`${v.nom} ${v.quartier} ${v.type}`));

  const offresDe = (v: Vendeur) => ({
    annonces: annonces.filter((a) => a.vendeur === v.nom),
    produits: produits.filter((p) => p.vendeurId === v.id),
    equip: EQUIPEMENTS.filter((e) => FOURNISSEURS[e.fournisseur] === v.id),
  });
  const nbOffres = (v: Vendeur) => { const o = offresDe(v); return o.annonces.length + o.produits.length + o.equip.length; };

  const basculer = (id: string) => setComparer((c) => (c.includes(id) ? c.filter((x) => x !== id) : c.length >= 3 ? c : [...c, id]));
  const compares = annonces.filter((a) => comparer.includes(a.id));

  const ouvrirAnnonce = (a: Annonce) => { setAnnonce(a); setQuantite(Math.min(100, a.quantiteKg)); };
  const ouvrirProduit = (p: ProduitMarche) => { setProduit(p); setNbProduit(1); };
  const ouvrirBoutique = (v?: Vendeur) => { if (!v) return; setAnnonce(null); setProduit(null); setEquip(null); setBoutique(v); };

  const recherchePleine = q.length > 0;
  const vue: Onglet = recherchePleine && onglet === "accueil" ? "produits" : onglet;

  return (
    <div>
      <EnTete
        titre="Tsafta Market"
        sousTitre="Matières, produits recyclés et équipements"
        droite={
          <div className="flex gap-2">
            <button onClick={() => setMesCommandes(true)} aria-label="Mes achats" className="verre relative grid h-11 w-11 place-items-center rounded-full">
              <ShoppingBag size={19} />
              {commandes.length > 0 && <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-mil-500 px-1 text-[11px] font-extrabold text-[#2A1300]">{commandes.length}</span>}
            </button>
            <button onClick={() => setPublication(true)} aria-label="Publier" className="grid h-11 w-11 place-items-center rounded-full text-[#2A1300] shadow-bouton" style={{ background: "linear-gradient(180deg,#FFB547,#F26D0F)" }}>
              <Plus size={21} />
            </button>
          </div>
        }
      />

      <div className="space-y-4 px-5">
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gris-400" />
          <input className="champ rounded-full pl-11" placeholder="Bouteilles PET, sac, broyeur, Lazaret…" value={recherche} onChange={(e) => setRecherche(e.target.value)} aria-label="Rechercher" />
        </div>
        <Filtres
          options={[
            { id: "accueil" as Onglet, label: "À la une" },
            { id: "matieres" as Onglet, label: `Matières (${annonces.length})` },
            { id: "produits" as Onglet, label: `Produits (${produits.length})` },
            { id: "equipements" as Onglet, label: `Équipements (${EQUIPEMENTS.length})` },
            { id: "vendeurs" as Onglet, label: `Vendeurs (${VENDEURS.length})` },
          ]}
          valeur={vue}
          changer={setOnglet}
        />
      </div>

      {/* ---------- À la une ---------- */}
      {vue === "accueil" && (
        <div className="space-y-7 pt-5">
          <section className="px-5">
            <div className="relative overflow-hidden rounded-hero p-6 shadow-haut" style={{ background: "linear-gradient(150deg, #FFB547 0%, #FF8A1F 50%, #E0600A 100%)" }}>
              <span className="absolute -right-10 -top-10 h-44 w-44 rounded-full border-[18px] border-white/15" aria-hidden="true" />
              <span className="absolute -bottom-16 right-10 h-36 w-36 rounded-full bg-white/10" aria-hidden="true" />
              <div className="relative text-[#2A1300]">
                <p className="text-[13px] font-extrabold opacity-80">Le marché circulaire de Niamey</p>
                <h2 className="mt-2 max-w-[260px] text-[24px] font-extrabold leading-[1.1]">Achetez la matière, vendez ce que vous fabriquez</h2>
                <div className="mt-5 flex gap-5">
                  {[[annonces.length, "lots"], [produits.length, "produits"], [VENDEURS.filter((v) => v.verifie).length, "vendeurs vérifiés"]].map(([n, l]) => (
                    <div key={l as string}>
                      <p className="text-[22px] font-extrabold leading-none">{n}</p>
                      <p className="mt-1 text-[12px] font-bold opacity-75">{l}</p>
                    </div>
                  ))}
                </div>
                <button onClick={() => setPublication(true)} className="btn btn-sm mt-5 bg-[#2A1300] text-white">Vendre sur Tsafta</button>
              </div>
            </div>
          </section>

          <section>
            <EnTeteSection titre="Matières premières" voir={() => setOnglet("matieres")} />
            <div className="defile mt-3 gap-3">
              {annonces.slice(0, 6).map((a) => <CarteAnnonce key={a.id} a={a} ouvrir={() => ouvrirAnnonce(a)} />)}
            </div>
          </section>

          <section>
            <EnTeteSection titre="Produits recyclés" voir={() => setOnglet("produits")} />
            <div className="mt-3 grid grid-cols-2 gap-3 px-5">
              {produits.slice(0, 6).map((p) => <CarteProduit key={p.id} p={p} ouvrir={() => ouvrirProduit(p)} />)}
            </div>
          </section>

          <section>
            <EnTeteSection titre="Équipements" voir={() => setOnglet("equipements")} />
            <div className="defile mt-3 gap-3">
              {EQUIPEMENTS.slice(0, 6).map((e) => <CarteEquipement key={e.id} e={e} etroite ouvrir={() => setEquip(e)} />)}
            </div>
          </section>

          <section>
            <EnTeteSection titre="Vendeurs vérifiés" voir={() => setOnglet("vendeurs")} />
            <div className="defile mt-3 gap-3">
              {VENDEURS.filter((v) => v.verifie).map((v) => <CarteVendeur key={v.id} v={v} etroite offres={nbOffres(v)} ouvrir={() => ouvrirBoutique(v)} />)}
            </div>
          </section>
        </div>
      )}

      {/* ---------- Matières ---------- */}
      {vue === "matieres" && (
        <div className="space-y-4 px-5 pt-4">
          <Filtres options={[{ id: "toutes" as const, label: "Toutes" }, ...MATIERES.map((m) => ({ id: m.id, label: `${m.emoji} ${m.nom}` }))]} valeur={filtreMat} changer={setFiltreMat} />
          <div className="flex items-center justify-between">
            <p className="text-[14px] text-gris-500">{listeAnnonces.length} lots disponibles</p>
            <select className="verre h-9 rounded-full px-3 text-[13px] font-bold text-gris-600" value={tri} onChange={(e) => setTri(e.target.value as Tri)} aria-label="Trier">
              <option value="recent">Plus récents</option>
              <option value="prix">Prix croissant</option>
              <option value="quantite">Plus grandes quantités</option>
            </select>
          </div>
          {listeAnnonces.length === 0 ? (
            <EtatVide icone={<Search size={24} />} titre="Aucun lot trouvé" texte="Modifiez la recherche ou choisissez une autre matière." />
          ) : (
            <div className="space-y-3">
              {listeAnnonces.map((a) => <CarteAnnonce key={a.id} a={a} large ouvrir={() => ouvrirAnnonce(a)} comparer={{ coche: comparer.includes(a.id), basculer: () => basculer(a.id) }} />)}
            </div>
          )}
        </div>
      )}

      {/* ---------- Produits ---------- */}
      {vue === "produits" && (
        <div className="space-y-4 px-5 pt-4">
          <Filtres options={[{ id: "toutes" as const, label: "Tout" }, ...CATEGORIES.map((c) => ({ id: c, label: c }))]} valeur={filtreCat} changer={setFiltreCat} />
          <p className="text-[14px] text-gris-500">{listeProduits.length} produits fabriqués à Niamey</p>
          {listeProduits.length === 0 ? (
            <EtatVide icone={<Search size={24} />} titre="Aucun produit trouvé" texte="Modifiez la recherche ou publiez vos propres produits." />
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {listeProduits.map((p) => <CarteProduit key={p.id} p={p} ouvrir={() => ouvrirProduit(p)} />)}
            </div>
          )}
        </div>
      )}

      {/* ---------- Équipements ---------- */}
      {vue === "equipements" && (
        <div className="space-y-4 px-5 pt-4">
          <Filtres options={[{ id: "tous" as const, label: "Tout" }, ...(["Broyage", "Transformation", "Mesure", "Sécurité", "Manutention"] as const).map((c) => ({ id: c, label: c }))]} valeur={filtreEquip} changer={setFiltreEquip} />
          {listeEquip.length === 0 ? (
            <EtatVide icone={<Search size={24} />} titre="Aucun équipement trouvé" texte="Modifiez la recherche ou la catégorie." />
          ) : (
            <div className="space-y-3">{listeEquip.map((e) => <CarteEquipement key={e.id} e={e} ouvrir={() => setEquip(e)} />)}</div>
          )}
        </div>
      )}

      {/* ---------- Vendeurs ---------- */}
      {vue === "vendeurs" && (
        <div className="space-y-4 px-5 pt-4">
          <Filtres options={[{ id: "tous" as const, label: "Tous" }, ...TYPES_VENDEUR.map((t) => ({ id: t, label: `${t}s` }))]} valeur={filtreType} changer={setFiltreType} />
          <div className="space-y-3">{listeVendeurs.map((v) => <CarteVendeur key={v.id} v={v} offres={nbOffres(v)} ouvrir={() => ouvrirBoutique(v)} />)}</div>
        </div>
      )}

      {/* Barre de comparaison */}
      {vue === "matieres" && comparer.length > 0 && (
        <div className="fixed inset-x-0 bottom-[104px] z-30 flex justify-center px-5">
          <div className="verre flex w-full max-w-md animate-fondu items-center gap-3 rounded-full p-1.5 pl-5 shadow-haut">
            <span className="flex-1 text-[14px] font-bold">{comparer.length} sur 3 sélectionnés</span>
            <button className="btn btn-sm bg-menthe text-menthe-fonce" disabled={comparer.length < 2} onClick={() => setComparaison(true)}>Comparer</button>
          </div>
        </div>
      )}

      {/* ---------- Feuilles ---------- */}

      <Feuille ouvert={comparaison} fermer={() => setComparaison(false)} titre="Comparaison">
        <div className="-mx-5 overflow-x-auto px-5">
          <table className="w-full min-w-[320px] text-[14px]">
            <thead>
              <tr>
                <th className="w-24" />
                {compares.map((a) => (
                  <th key={a.id} className="px-2 pb-3 text-left align-top">
                    <IconeMatiere id={a.matiere} taille={38} />
                    <p className="mt-2 text-[13px] font-bold leading-tight">{a.titre}</p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[.07]">
              {([
                ["Prix", (a: Annonce) => `${a.prixKg} F/kg`, (a: Annonce) => a.prixKg === Math.min(...compares.map((x) => x.prixKg))],
                ["Quantité", (a: Annonce) => kg(a.quantiteKg), (a: Annonce) => a.quantiteKg === Math.max(...compares.map((x) => x.quantiteKg))],
                ["Qualité", (a: Annonce) => a.qualite, (a: Annonce) => a.qualite === "A"],
                ["Quartier", (a: Annonce) => a.quartier, () => false],
                ["Valeur du lot", (a: Annonce) => fcfa(a.prixKg * a.quantiteKg), () => false],
              ] as [string, (a: Annonce) => string, (a: Annonce) => boolean][]).map(([label, f, meilleur]) => (
                <tr key={label}>
                  <td className="py-3 text-[13px] text-gris-500">{label}</td>
                  {compares.map((a) => <td key={a.id} className={`px-2 py-3 font-bold ${meilleur(a) ? "text-menthe" : ""}`}>{f(a)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-[13px] text-gris-500">Les meilleures valeurs sont en vert.</p>
        <button className="btn-doux mt-4 w-full" onClick={() => { setComparer([]); setComparaison(false); }}>Vider la comparaison</button>
      </Feuille>

      <Feuille ouvert={!!annonce} fermer={() => setAnnonce(null)} titre="Lot de matière">
        {annonce && (() => {
          const v = vendeurParNom(annonce.vendeur);
          return (
            <div>
              <Visuel mat={annonce.matiere} arrondi="rounded-carte" coin={<span className={`puce px-2.5 py-1 text-[11px] ${QUALITE_STYLE[annonce.qualite]}`}>Qualité {annonce.qualite}</span>} />
              <h3 className="mt-4 text-[21px] font-extrabold leading-tight">{annonce.titre}</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                <PastilleMatiere id={annonce.matiere} />
                <span className="puce bg-white/10 text-gris-600"><MapPin size={12} /> {annonce.quartier}</span>
              </div>
              <p className="mt-4 text-[15px] leading-relaxed text-gris-600">{annonce.description}</p>
              <p className="mt-2 text-[13px] text-gris-500">{QUALITES[annonce.qualite]}</p>
              {v && (
                <button onClick={() => ouvrirBoutique(v)} className="carte mt-4 flex w-full items-center gap-3 p-3.5 text-left">
                  <AvatarVendeur v={v} taille={40} />
                  <span className="min-w-0 flex-1"><span className="block truncate text-[14px] font-bold">{v.nom}</span><span className="text-[12px] text-gris-500">{v.type}, {v.ventes} ventes</span></span>
                  <span className="text-[13px] font-bold text-menthe">Boutique</span>
                </button>
              )}
              <div className="carte mt-4 p-4">
                <div className="flex items-center justify-between">
                  <label htmlFor="qa" className="text-[14px] font-bold">Quantité souhaitée</label>
                  <span className="text-[13px] text-gris-500">sur {kg(annonce.quantiteKg)}</span>
                </div>
                <input id="qa" type="range" min={10} max={annonce.quantiteKg} step={10} value={quantite} onChange={(e) => setQuantite(+e.target.value)} className="mt-3 w-full" />
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="chiffre text-[20px]">{kg(quantite)}</span>
                  <span className="chiffre text-[24px] text-mil-500">{fcfa(quantite * annonce.prixKg)}</span>
                </div>
              </div>
              <button className="btn-action mt-5 w-full" onClick={() => {
                passerCommande({ type: "matiere", libelle: annonce.titre, quantite, unite: "kg", montant: quantite * annonce.prixKg, contrepartie: annonce.vendeur });
                setAnnonce(null);
                setToast("Demande d'achat envoyée");
              }}>Envoyer une demande d'achat</button>
              <p className="mt-3 text-center text-[13px] text-gris-500">Le vendeur confirme la disponibilité avant tout paiement.</p>
            </div>
          );
        })()}
      </Feuille>

      <Feuille ouvert={!!produit} fermer={() => setProduit(null)} titre="Produit recyclé">
        {produit && (() => {
          const v = vendeur(produit.vendeurId);
          return (
            <div>
              <Visuel photo={produit.image} mat={produit.matiere} symbole={produit.emoji} arrondi="rounded-carte" coin={<Puce sombre>{produit.categorie}</Puce>} />
              <h3 className="mt-4 text-[21px] font-extrabold leading-tight">{produit.nom}</h3>
              <div className="mt-2 flex items-center justify-between">
                <p className="chiffre text-[26px] text-mil-500">{fcfa(produit.prix)}</p>
                <span className="text-[13px] font-bold text-menthe">{produit.stock} en stock</span>
              </div>
              <p className="mt-3 text-[15px] leading-relaxed text-gris-600">{produit.description}</p>
              <div className="mt-3"><PastilleMatiere id={produit.matiere} /></div>
              {v && (
                <button onClick={() => ouvrirBoutique(v)} className="carte mt-4 flex w-full items-center gap-3 p-3.5 text-left">
                  <AvatarVendeur v={v} taille={40} />
                  <span className="min-w-0 flex-1"><span className="block truncate text-[14px] font-bold">{v.nom}</span><span className="text-[12px] text-gris-500">{v.type}, {v.quartier}</span></span>
                  <span className="text-[13px] font-bold text-menthe">Boutique</span>
                </button>
              )}
              <div className="mt-4 flex items-center justify-between">
                <span className="text-[14px] font-bold">Quantité</span>
                <div className="verre flex items-center gap-4 rounded-full p-1">
                  <button aria-label="Moins" onClick={() => setNbProduit((n) => Math.max(1, n - 1))} className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-[18px] font-bold">−</button>
                  <span className="chiffre w-6 text-center text-[17px]">{nbProduit}</span>
                  <button aria-label="Plus" onClick={() => setNbProduit((n) => Math.min(produit.stock, n + 1))} className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-[18px] font-bold">+</button>
                </div>
              </div>
              <button className="btn-action mt-5 w-full" onClick={() => {
                passerCommande({ type: "produit", libelle: produit.nom, quantite: nbProduit, unite: nbProduit > 1 ? "pièces" : "pièce", montant: produit.prix * nbProduit, contrepartie: produit.atelier });
                setProduit(null);
                setToast("Commande envoyée à l'atelier");
              }}>Commander pour {fcfa(produit.prix * nbProduit)}</button>
            </div>
          );
        })()}
      </Feuille>

      <Feuille ouvert={!!equip} fermer={() => setEquip(null)} titre="Équipement">
        {equip && (() => {
          const I = ICONE_EQUIP[equip.categorie];
          const v = vendeur(FOURNISSEURS[equip.fournisseur] ?? "");
          return (
            <div>
              <Visuel mat={equip.matieres[0]} symbole={<I size={48} strokeWidth={1.8} />} arrondi="rounded-carte" />
              <h3 className="mt-4 text-[21px] font-extrabold leading-tight">{equip.nom}</h3>
              <p className="chiffre mt-2 text-[26px] text-mil-500">{fcfa(equip.prix)}</p>
              <p className="mt-3 text-[15px] leading-relaxed text-gris-600">{equip.description}</p>
              <dl className="carte mt-4 divide-y divide-white/[.07] px-4">
                {[["Capacité", equip.capacite], ["Énergie", equip.energie], ["Disponibilité", equip.disponibilite], ["Fournisseur", equip.fournisseur]].map(([k, val]) => (
                  <div key={k} className="flex justify-between py-3 text-[14px]"><dt className="text-gris-500">{k}</dt><dd className="font-bold">{val}</dd></div>
                ))}
              </dl>
              <p className="etiquette mt-4">Adapté pour</p>
              <div className="flex flex-wrap gap-2">{equip.matieres.map((m) => <PastilleMatiere key={m} id={m} />)}</div>
              {v && (
                <button onClick={() => ouvrirBoutique(v)} className="mt-4 flex w-full items-center justify-between rounded-tuile bg-white/[.05] p-3.5 text-left text-[14px] font-bold">
                  Voir la boutique de {v.nom} <ChevronRight size={18} />
                </button>
              )}
              <button className="btn-action mt-5 w-full" onClick={() => {
                passerCommande({ type: "devis", libelle: equip.nom, quantite: 1, unite: "unité", montant: equip.prix, contrepartie: equip.fournisseur });
                setEquip(null);
                setToast("Demande de devis envoyée");
              }}>Demander un devis</button>
            </div>
          );
        })()}
      </Feuille>

      <Feuille ouvert={!!boutique} fermer={() => setBoutique(null)} titre="Boutique">
        {boutique && (() => {
          const o = offresDe(boutique);
          return (
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <AvatarVendeur v={boutique} taille={64} />
                <div className="min-w-0">
                  <p className="text-[20px] font-extrabold leading-tight">{boutique.nom}</p>
                  <p className="mt-1 text-[13px] font-bold" style={{ color: STYLE_TYPE[boutique.type] }}>{boutique.type}{boutique.verifie ? ", vérifié par Tsafta" : ""}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[[boutique.note.toFixed(1), "note"], [String(boutique.ventes), "ventes"], [boutique.depuis, "membre depuis"]].map(([n, l]) => (
                  <div key={l} className="carte p-3 text-center">
                    <p className="chiffre text-[18px]">{n}</p>
                    <p className="text-[11px] text-gris-500">{l}</p>
                  </div>
                ))}
              </div>
              <p className="text-[15px] leading-relaxed text-gris-600">{boutique.description}</p>
              <p className="flex items-center gap-1.5 text-[13px] text-gris-500"><MapPin size={14} /> {boutique.quartier}, Niamey</p>
              <button className="btn-doux w-full" onClick={() => setToast(`Message envoyé à ${boutique.nom}`)}><MessageCircle size={18} /> Contacter</button>

              {o.annonces.length > 0 && (
                <div>
                  <p className="etiquette flex items-center gap-1.5"><Package size={14} /> Lots de matières</p>
                  <div className="space-y-3">{o.annonces.map((a) => <CarteAnnonce key={a.id} a={a} large ouvrir={() => { setBoutique(null); ouvrirAnnonce(a); }} />)}</div>
                </div>
              )}
              {o.produits.length > 0 && (
                <div>
                  <p className="etiquette flex items-center gap-1.5"><Store size={14} /> Produits</p>
                  <div className="grid grid-cols-2 gap-3">{o.produits.map((p) => <CarteProduit key={p.id} p={p} ouvrir={() => { setBoutique(null); ouvrirProduit(p); }} />)}</div>
                </div>
              )}
              {o.equip.length > 0 && (
                <div>
                  <p className="etiquette flex items-center gap-1.5"><Cog size={14} /> Équipements</p>
                  <div className="space-y-3">{o.equip.map((e) => <CarteEquipement key={e.id} e={e} ouvrir={() => { setBoutique(null); setEquip(e); }} />)}</div>
                </div>
              )}
            </div>
          );
        })()}
      </Feuille>

      <Feuille ouvert={publication} fermer={() => setPublication(false)} titre="Vendre sur le Market">
        <FormulairePublication fermer={() => setPublication(false)} notifier={setToast} />
      </Feuille>

      <Feuille ouvert={mesCommandes} fermer={() => setMesCommandes(false)} titre="Mes achats">
        {commandes.length === 0 ? (
          <EtatVide icone={<ReceiptText size={24} />} titre="Aucun achat pour le moment" texte="Vos demandes d'achat, commandes et devis apparaîtront ici." />
        ) : (
          <div className="divide-y divide-white/[.07]">
            {commandes.map((c) => (
              <div key={c.id} className="flex items-center justify-between gap-3 py-3.5">
                <div className="min-w-0">
                  <p className="truncate text-[15px] font-bold">{c.libelle}</p>
                  <p className="text-[13px] text-gris-500">{c.quantite.toLocaleString("fr-FR")} {c.unite}, {c.contrepartie}</p>
                </div>
                <div className="text-right">
                  <p className="chiffre text-[15px]">{fcfa(c.montant)}</p>
                  <span className="puce mt-1 bg-mil-100 text-mil-600">{c.type === "devis" ? "Devis demandé" : "En attente"}</span>
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
