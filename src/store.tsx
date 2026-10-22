import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { ANNONCES, PRODUITS, TRANSACTIONS_INITIALES, type Annonce, type MatiereId, type Produit, type Transaction } from "./data/donnees";

export type Profil = "citoyen" | "collecteur" | "atelier" | "acheteur";

export const PROFILS: Record<Profil, { nom: string; role: string }> = {
  citoyen: { nom: "Citoyen", role: "Je trie et je fais collecter mes déchets" },
  collecteur: { nom: "Collecteur", role: "Je récupère, je pèse et je revends" },
  atelier: { nom: "Atelier", role: "Je transforme les matières en produits" },
  acheteur: { nom: "Acheteur", role: "J'achète des matières recyclables" },
};

// Demande de collecte envoyée par un citoyen à un collecteur.
export interface Demande {
  id: string;
  date: string;
  matiere: MatiereId;
  poidsEstimeKg: number;
  quartier: string;
  collecteurId: string;
  collecteurNom: string;
  photo?: string;
  statut: "en_attente" | "collectee";
}

export interface Commande {
  id: string;
  date: string;
  type: "matiere" | "produit" | "devis";
  libelle: string;
  quantite: number;
  unite: string;
  montant: number;
  contrepartie: string;
}

export interface Ecriture {
  id: string;
  date: string;
  type: "vente" | "depense";
  libelle: string;
  montant: number;
}

interface Donnees {
  profil: Profil;
  nom: string;
  demandes: Demande[];
  transactions: Transaction[];
  annonces: Annonce[];
  produits: Produit[];
  commandes: Commande[];
  progression: Record<string, string[]>; // formationId -> leçons terminées
  journal: Ecriture[];
}

interface Etat extends Donnees {
  changerProfil: (p: Profil) => void;
  changerNom: (n: string) => void;
  ajouterDemande: (d: Omit<Demande, "id" | "date" | "statut">) => void;
  validerCollecte: (demandeId: string | null, t: Omit<Transaction, "id" | "date">) => string;
  publierAnnonce: (a: Omit<Annonce, "id">) => void;
  publierProduit: (p: Omit<Produit, "id">) => void;
  passerCommande: (c: Omit<Commande, "id" | "date">) => void;
  basculerLecon: (formationId: string, leconId: string) => void;
  ajouterEcriture: (e: Omit<Ecriture, "id" | "date">) => void;
  supprimerEcriture: (id: string) => void;
  reinitialiser: () => void;
}

const Ctx = createContext<Etat | null>(null);
const CLE = "tsafta-etat-v2";

const DEPART: Donnees = {
  profil: "citoyen",
  nom: "",
  demandes: [],
  transactions: TRANSACTIONS_INITIALES,
  annonces: ANNONCES,
  produits: PRODUITS,
  commandes: [],
  progression: {},
  journal: [
    { id: "j1", date: "2026-10-14", type: "depense", libelle: "Achat de 50 kg de cartons", montant: 4000 },
    { id: "j2", date: "2026-10-16", type: "vente", libelle: "12 carnets recyclés", montant: 4800 },
    { id: "j3", date: "2026-10-19", type: "vente", libelle: "Lot de 30 briquettes", montant: 3000 },
  ],
};

function charger(): Donnees {
  try {
    const brut = localStorage.getItem(CLE);
    if (brut) return { ...DEPART, ...JSON.parse(brut) };
  } catch {
    /* stockage indisponible : données de démonstration */
  }
  return DEPART;
}

export const nouvelId = () => Math.random().toString(36).slice(2, 8).toUpperCase();
const aujourdhui = () => new Date().toISOString().slice(0, 10);

export function FournisseurEtat({ children }: { children: ReactNode }) {
  const [d, setD] = useState<Donnees>(charger);

  useEffect(() => {
    try {
      localStorage.setItem(CLE, JSON.stringify(d));
    } catch {
      /* ignoré */
    }
  }, [d]);

  const valeur: Etat = {
    ...d,
    changerProfil: (profil) => setD((e) => ({ ...e, profil })),
    changerNom: (nom) => setD((e) => ({ ...e, nom })),
    ajouterDemande: (x) =>
      setD((e) => ({ ...e, demandes: [{ ...x, id: nouvelId(), date: aujourdhui(), statut: "en_attente" }, ...e.demandes] })),
    validerCollecte: (demandeId, t) => {
      const id = nouvelId();
      setD((e) => ({
        ...e,
        demandes: e.demandes.map((x) => (x.id === demandeId ? { ...x, statut: "collectee" } : x)),
        transactions: [{ ...t, id, date: aujourdhui() }, ...e.transactions],
      }));
      return id;
    },
    publierAnnonce: (a) => setD((e) => ({ ...e, annonces: [{ ...a, id: nouvelId() }, ...e.annonces] })),
    publierProduit: (p) => setD((e) => ({ ...e, produits: [{ ...p, id: nouvelId() }, ...e.produits] })),
    passerCommande: (c) => setD((e) => ({ ...e, commandes: [{ ...c, id: nouvelId(), date: aujourdhui() }, ...e.commandes] })),
    basculerLecon: (f, l) =>
      setD((e) => {
        const faites = e.progression[f] ?? [];
        return { ...e, progression: { ...e.progression, [f]: faites.includes(l) ? faites.filter((x) => x !== l) : [...faites, l] } };
      }),
    ajouterEcriture: (x) => setD((e) => ({ ...e, journal: [{ ...x, id: nouvelId(), date: aujourdhui() }, ...e.journal] })),
    supprimerEcriture: (id) => setD((e) => ({ ...e, journal: e.journal.filter((x) => x.id !== id) })),
    reinitialiser: () => setD(DEPART),
  };

  return <Ctx.Provider value={valeur}>{children}</Ctx.Provider>;
}

export function useEtat() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useEtat doit être utilisé dans FournisseurEtat");
  return c;
}
