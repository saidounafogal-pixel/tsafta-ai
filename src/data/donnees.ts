// Données fictives pour le prototype Tsafta AI (pilote Niamey).
// Les prix sont indicatifs, en FCFA, et devront être remplacés par des données réelles.

export type MatiereId = "pet" | "pehd" | "papier" | "metal" | "fibres" | "organique" | "verre";

export interface Matiere {
  id: MatiereId;
  nom: string;
  exemples: string;
  prixKg: number; // prix moyen indicatif payé au citoyen, FCFA/kg
  teinte: string; // couleur principale de la matière
  fond: string; // teinte claire assortie
  emoji: string;
  conseil: string;
}

export const MATIERES: Matiere[] = [
  { id: "pet", nom: "Plastique PET", exemples: "Bouteilles d'eau, de jus, de boisson", prixKg: 100, teinte: "#5AB4F5", fond: "#5AB4F524", emoji: "🧴", conseil: "Videz et écrasez les bouteilles, retirez les bouchons si possible." },
  { id: "pehd", nom: "Plastique PEHD", exemples: "Bidons, seaux, flacons de détergent", prixKg: 125, teinte: "#9AA3FF", fond: "#9AA3FF24", emoji: "🪣", conseil: "Rincez les bidons et séparez-les des sachets." },
  { id: "papier", nom: "Papier et carton", exemples: "Cartons, cahiers, journaux, emballages", prixKg: 50, teinte: "#F5BE55", fond: "#F5BE5524", emoji: "📦", conseil: "Gardez-les au sec et pliez les cartons à plat." },
  { id: "metal", nom: "Métal et canettes", exemples: "Canettes, boîtes de conserve, ferraille", prixKg: 250, teinte: "#B3BFD1", fond: "#B3BFD124", emoji: "🥫", conseil: "Écrasez les canettes pour gagner de la place." },
  { id: "fibres", nom: "Fibres végétales", exemples: "Tiges de mil, feuilles de palmier doum, paille", prixKg: 40, teinte: "#CDDA5C", fond: "#CDDA5C24", emoji: "🌾", conseil: "Séchez les fibres avant la collecte pour éviter la moisissure." },
  { id: "organique", nom: "Déchets organiques", exemples: "Épluchures, restes de repas, déchets de marché", prixKg: 15, teinte: "#45E0A0", fond: "#45E0A024", emoji: "🥬", conseil: "Séparez-les des plastiques : ils serviront au compostage." },
  { id: "verre", nom: "Verre", exemples: "Bouteilles et bocaux en verre", prixKg: 30, teinte: "#4FDCD3", fond: "#4FDCD324", emoji: "🫙", conseil: "Manipulez avec précaution et ne mélangez pas le verre cassé." },
];

export const matiere = (id: MatiereId) => MATIERES.find((m) => m.id === id)!;

export const QUARTIERS = [
  "Plateau", "Lazaret", "Koira Kano", "Yantala", "Talladjé", "Gamkallé", "Dar Es Salam",
  "Boukoki", "Harobanda", "Banifandou", "Kalley", "Wadata", "Recasement", "Bobiel",
];

export interface Collecteur {
  id: string;
  nom: string;
  type: "Collecteur" | "Point de dépôt" | "Coopérative";
  quartier: string;
  distanceKm: number;
  matieres: MatiereId[];
  note: number;
  horaires: string;
}

export const COLLECTEURS: Collecteur[] = [
  { id: "c1", nom: "Issa Collecte Express", type: "Collecteur", quartier: "Lazaret", distanceKm: 1.2, matieres: ["pet", "pehd", "metal"], note: 4.7, horaires: "Lun–Sam, 7h–18h" },
  { id: "c2", nom: "Point Vert Yantala", type: "Point de dépôt", quartier: "Yantala", distanceKm: 2.4, matieres: ["pet", "pehd", "papier", "verre"], note: 4.5, horaires: "Tous les jours, 8h–19h" },
  { id: "c3", nom: "Coopérative Femmes Talladjé", type: "Coopérative", quartier: "Talladjé", distanceKm: 3.1, matieres: ["fibres", "organique", "papier"], note: 4.9, horaires: "Lun–Ven, 8h–16h" },
  { id: "c4", nom: "Moussa Ferraille", type: "Collecteur", quartier: "Boukoki", distanceKm: 3.8, matieres: ["metal"], note: 4.3, horaires: "Lun–Sam, 6h–17h" },
  { id: "c5", nom: "Dépôt Koira Kano", type: "Point de dépôt", quartier: "Koira Kano", distanceKm: 4.5, matieres: ["pet", "papier", "metal", "verre"], note: 4.4, horaires: "Lun–Sam, 8h–18h" },
  { id: "c6", nom: "Compost Harobanda", type: "Coopérative", quartier: "Harobanda", distanceKm: 6.2, matieres: ["organique", "fibres"], note: 4.6, horaires: "Mar–Sam, 7h–13h" },
];

export interface Annonce {
  id: string;
  titre: string;
  matiere: MatiereId;
  quantiteKg: number;
  qualite: "A" | "B" | "C";
  prixKg: number;
  quartier: string;
  vendeur: string;
  description: string;
}

export const QUALITES: Record<Annonce["qualite"], string> = {
  A: "A — triée, propre, prête à transformer",
  B: "B — triée, à nettoyer",
  C: "C — en vrac, tri nécessaire",
};

export const ANNONCES: Annonce[] = [
  { id: "a1", titre: "Bouteilles PET compactées", matiere: "pet", quantiteKg: 850, qualite: "A", prixKg: 175, quartier: "Lazaret", vendeur: "Issa Collecte Express", description: "Balles de bouteilles PET transparentes, sans bouchons ni étiquettes." },
  { id: "a2", titre: "Bidons PEHD triés par couleur", matiere: "pehd", quantiteKg: 420, qualite: "B", prixKg: 190, quartier: "Yantala", vendeur: "Point Vert Yantala", description: "Bidons de 5 à 25 L, triés blanc / couleur, à rincer." },
  { id: "a3", titre: "Cartons d'emballage", matiere: "papier", quantiteKg: 1200, qualite: "A", prixKg: 80, quartier: "Koira Kano", vendeur: "Dépôt Koira Kano", description: "Cartons secs, pliés à plat, issus de commerces du quartier." },
  { id: "a4", titre: "Canettes aluminium", matiere: "metal", quantiteKg: 310, qualite: "A", prixKg: 420, quartier: "Boukoki", vendeur: "Moussa Ferraille", description: "Canettes écrasées, aluminium uniquement." },
  { id: "a5", titre: "Feuilles de palmier doum séchées", matiere: "fibres", quantiteKg: 600, qualite: "A", prixKg: 70, quartier: "Talladjé", vendeur: "Coopérative Femmes Talladjé", description: "Idéal pour la vannerie et les nattes." },
  { id: "a6", titre: "Compost mûr", matiere: "organique", quantiteKg: 2000, qualite: "A", prixKg: 60, quartier: "Harobanda", vendeur: "Compost Harobanda", description: "Compost de 3 mois, tamisé, pour le maraîchage." },
  { id: "a7", titre: "Plastique PET en vrac", matiere: "pet", quantiteKg: 300, qualite: "C", prixKg: 110, quartier: "Dar Es Salam", vendeur: "Collecte Dar Es Salam", description: "Mélange de bouteilles, tri et lavage à prévoir." },
  { id: "a8", titre: "Bouteilles en verre", matiere: "verre", quantiteKg: 500, qualite: "B", prixKg: 45, quartier: "Plateau", vendeur: "Point Vert Yantala", description: "Bouteilles entières, à laver." },
];

export interface Produit {
  id: string;
  nom: string;
  prix: number;
  atelier: string;
  quartier: string;
  matiere: MatiereId;
  emoji: string;
}

export const PRODUITS: Produit[] = [
  { id: "p1", nom: "Pavés en plastique recyclé (lot de 50)", prix: 25000, atelier: "Atelier Pavé Sahel", quartier: "Gamkallé", matiere: "pet", emoji: "🧱" },
  { id: "p2", nom: "Sac cabas tissé en sachets", prix: 3500, atelier: "Coopérative Femmes Talladjé", quartier: "Talladjé", matiere: "pehd", emoji: "👜" },
  { id: "p3", nom: "Natte en palmier doum", prix: 7500, atelier: "Coopérative Femmes Talladjé", quartier: "Talladjé", matiere: "fibres", emoji: "🧺" },
  { id: "p4", nom: "Compost en sac de 25 kg", prix: 2500, atelier: "Compost Harobanda", quartier: "Harobanda", matiere: "organique", emoji: "🌱" },
  { id: "p5", nom: "Carnets en papier recyclé (x10)", prix: 4000, atelier: "Papeterie Kalley", quartier: "Kalley", matiere: "papier", emoji: "📒" },
  { id: "p6", nom: "Briquettes de charbon de papier", prix: 1500, atelier: "Papeterie Kalley", quartier: "Kalley", matiere: "papier", emoji: "🔥" },
];

export interface Transaction {
  id: string;
  date: string; // ISO
  matiere: MatiereId;
  poidsKg: number;
  prixKg: number;
  collecteur: string;
  quartier: string;
  destination: string;
}

export const DESTINATIONS = [
  "Atelier Pavé Sahel (pavés)",
  "Papeterie Kalley (papier recyclé)",
  "Coopérative Femmes Talladjé (vannerie)",
  "Compost Harobanda (compost)",
  "Exportation vers recycleur régional",
  "En stock chez le collecteur",
];

// Historique de départ pour que le tableau de bord ne soit pas vide.
export const TRANSACTIONS_INITIALES: Transaction[] = [
  { id: "t1", date: "2026-10-01", matiere: "pet", poidsKg: 42, prixKg: 100, collecteur: "Issa Collecte Express", quartier: "Lazaret", destination: "Atelier Pavé Sahel (pavés)" },
  { id: "t2", date: "2026-10-03", matiere: "papier", poidsKg: 85, prixKg: 50, collecteur: "Dépôt Koira Kano", quartier: "Koira Kano", destination: "Papeterie Kalley (papier recyclé)" },
  { id: "t3", date: "2026-10-05", matiere: "metal", poidsKg: 18, prixKg: 250, collecteur: "Moussa Ferraille", quartier: "Boukoki", destination: "Exportation vers recycleur régional" },
  { id: "t4", date: "2026-10-08", matiere: "organique", poidsKg: 210, prixKg: 15, collecteur: "Compost Harobanda", quartier: "Harobanda", destination: "Compost Harobanda (compost)" },
  { id: "t5", date: "2026-10-10", matiere: "fibres", poidsKg: 64, prixKg: 40, collecteur: "Coopérative Femmes Talladjé", quartier: "Talladjé", destination: "Coopérative Femmes Talladjé (vannerie)" },
  { id: "t6", date: "2026-10-13", matiere: "pet", poidsKg: 57, prixKg: 100, collecteur: "Point Vert Yantala", quartier: "Yantala", destination: "Atelier Pavé Sahel (pavés)" },
  { id: "t7", date: "2026-10-15", matiere: "pehd", poidsKg: 33, prixKg: 125, collecteur: "Issa Collecte Express", quartier: "Lazaret", destination: "En stock chez le collecteur" },
  { id: "t8", date: "2026-10-18", matiere: "papier", poidsKg: 120, prixKg: 50, collecteur: "Dépôt Koira Kano", quartier: "Koira Kano", destination: "Papeterie Kalley (papier recyclé)" },
  { id: "t9", date: "2026-10-20", matiere: "pet", poidsKg: 75, prixKg: 100, collecteur: "Issa Collecte Express", quartier: "Lazaret", destination: "Atelier Pavé Sahel (pavés)" },
];

export const fcfa = (n: number) => `${Math.round(n).toLocaleString("fr-FR")} FCFA`;
export const kg = (n: number) => `${n.toLocaleString("fr-FR", { maximumFractionDigits: 1 })} kg`;
