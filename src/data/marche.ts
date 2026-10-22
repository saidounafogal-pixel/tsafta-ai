// Données de démonstration de Tsafta Market : vendeurs, lots de matières, produits recyclés.
// Prix indicatifs en FCFA, à remplacer par les données réelles du pilote.
import type { Annonce, MatiereId, Produit } from "./donnees";

export type TypeVendeur = "Collecteur" | "Coopérative" | "Recycleur" | "Atelier" | "Fournisseur";

export interface Vendeur {
  id: string;
  nom: string;
  type: TypeVendeur;
  quartier: string;
  note: number;
  ventes: number;
  verifie: boolean;
  depuis: string;
  description: string;
}

export const VENDEURS: Vendeur[] = [
  { id: "issa", nom: "Issa Collecte Express", type: "Collecteur", quartier: "Lazaret", note: 4.7, ventes: 312, verifie: true, depuis: "2024", description: "Tournées quotidiennes en tricycle sur Lazaret et Koira Kano. Spécialiste des bouteilles PET et des bidons." },
  { id: "pointvert", nom: "Point Vert Yantala", type: "Collecteur", quartier: "Yantala", note: 4.5, ventes: 188, verifie: true, depuis: "2025", description: "Point de dépôt ouvert tous les jours. Plastiques triés par couleur, verre et carton." },
  { id: "moussa", nom: "Moussa Ferraille", type: "Collecteur", quartier: "Boukoki", note: 4.3, ventes: 405, verifie: true, depuis: "2019", description: "Ferrailleur depuis 15 ans. Aluminium, cuivre et acier triés et pesés." },
  { id: "talladje", nom: "Coopérative Femmes Talladjé", type: "Coopérative", quartier: "Talladjé", note: 4.9, ventes: 264, verifie: true, depuis: "2023", description: "42 femmes artisanes : vannerie en palmier doum, sacs en fibres et en sachets recyclés." },
  { id: "compost", nom: "Compost Harobanda", type: "Recycleur", quartier: "Harobanda", note: 4.6, ventes: 97, verifie: true, depuis: "2024", description: "Compostage des déchets du marché de Harobanda pour les maraîchers du fleuve." },
  { id: "pave", nom: "Atelier Pavé Sahel", type: "Recycleur", quartier: "Gamkallé", note: 4.8, ventes: 156, verifie: true, depuis: "2022", description: "Pavés, tuiles et bordures en plastique recyclé et sable. Commandes pour mairies et écoles." },
  { id: "kalley", nom: "Papeterie Kalley", type: "Atelier", quartier: "Kalley", note: 4.7, ventes: 133, verifie: true, depuis: "2024", description: "Papier artisanal, carnets, briquettes combustibles à partir de cartons collectés." },
  { id: "liege", nom: "Atelier Bouchon d'Or", type: "Atelier", quartier: "Plateau", note: 4.6, ventes: 74, verifie: false, depuis: "2025", description: "Objets en liège aggloméré récupéré : dessous-de-plat, pots, sacs et accessoires." },
  { id: "resine", nom: "Studio Marbré Niamey", type: "Atelier", quartier: "Koira Kano", note: 4.4, ventes: 58, verifie: false, depuis: "2025", description: "Objets décoratifs coulés à partir de plastique fondu et de résine colorée." },
  { id: "sahelmachines", nom: "Sahel Machines", type: "Fournisseur", quartier: "Zone industrielle", note: 4.5, ventes: 41, verifie: true, depuis: "2018", description: "Broyeurs, pulpeurs et compacteurs. Installation et formation incluses à Niamey." },
  { id: "gamkalle", nom: "Soudure Gamkallé", type: "Fournisseur", quartier: "Gamkallé", note: 4.6, ventes: 89, verifie: true, depuis: "2016", description: "Fûts de fusion, moules à pavés et structures métalliques sur mesure." },
];

export const vendeur = (id: string) => VENDEURS.find((v) => v.id === id);
export const vendeurParNom = (nom: string) => VENDEURS.find((v) => v.nom === nom);

/* Lots de matières premières (vendus par les collecteurs et coopératives). */
export const ANNONCES_MARCHE: Annonce[] = [
  { id: "a1", titre: "Bouteilles PET compactées en balles", matiere: "pet", quantiteKg: 850, qualite: "A", prixKg: 175, quartier: "Lazaret", vendeur: "Issa Collecte Express", description: "Balles de 40 kg, bouteilles transparentes sans bouchons ni étiquettes. Livraison possible en tricycle." },
  { id: "a2", titre: "Bidons PEHD triés par couleur", matiere: "pehd", quantiteKg: 420, qualite: "B", prixKg: 190, quartier: "Yantala", vendeur: "Point Vert Yantala", description: "Bidons de 5 à 25 L, triés blanc et couleur, à rincer avant broyage." },
  { id: "a3", titre: "Cartons d'emballage secs", matiere: "papier", quantiteKg: 1200, qualite: "A", prixKg: 80, quartier: "Koira Kano", vendeur: "Point Vert Yantala", description: "Cartons pliés à plat, issus des commerces du quartier. Stockés à l'abri." },
  { id: "a4", titre: "Canettes aluminium compactées", matiere: "metal", quantiteKg: 310, qualite: "A", prixKg: 420, quartier: "Boukoki", vendeur: "Moussa Ferraille", description: "Aluminium uniquement, compacté en blocs de 10 kg." },
  { id: "a5", titre: "Feuilles de palmier doum séchées", matiere: "fibres", quantiteKg: 600, qualite: "A", prixKg: 70, quartier: "Talladjé", vendeur: "Coopérative Femmes Talladjé", description: "Séchées 7 jours à l'ombre, prêtes à fendre. Idéales pour la vannerie." },
  { id: "a6", titre: "Déchets organiques du marché", matiere: "organique", quantiteKg: 3000, qualite: "B", prixKg: 10, quartier: "Harobanda", vendeur: "Compost Harobanda", description: "Épluchures et invendus collectés chaque matin, à composter." },
  { id: "a7", titre: "Sachets plastiques lavés", matiere: "pehd", quantiteKg: 180, qualite: "A", prixKg: 140, quartier: "Talladjé", vendeur: "Coopérative Femmes Talladjé", description: "Sachets lavés et séchés, triés par couleur pour le tissage." },
  { id: "a8", titre: "Plastique PET en vrac", matiere: "pet", quantiteKg: 300, qualite: "C", prixKg: 110, quartier: "Dar Es Salam", vendeur: "Issa Collecte Express", description: "Mélange de bouteilles, tri et lavage à prévoir. Prix dégressif au-delà de 200 kg." },
  { id: "a9", titre: "Bouteilles en verre entières", matiere: "verre", quantiteKg: 500, qualite: "B", prixKg: 45, quartier: "Plateau", vendeur: "Point Vert Yantala", description: "Bouteilles entières, à laver. Adaptées au réemploi." },
  { id: "a10", titre: "Ferraille acier mélangée", matiere: "metal", quantiteKg: 1500, qualite: "C", prixKg: 120, quartier: "Boukoki", vendeur: "Moussa Ferraille", description: "Tôles, fers à béton et pièces diverses, à trier." },
];

export type CategorieProduit = "Décoration" | "Maison et jardin" | "Mode et accessoires" | "Papeterie" | "Construction" | "Agriculture" | "Énergie";

export interface ProduitMarche extends Produit {
  image?: string; // nom de fichier dans src/assets/miniatures
  categorie: CategorieProduit;
  description: string;
  vendeurId: string;
  stock: number;
}

/* Produits fabriqués à partir de matières recyclées (ateliers, recycleurs, coopératives). */
export const PRODUITS_MARCHE: ProduitMarche[] = [
  { id: "p1", nom: "Sac cabas en fibres végétales", prix: 8500, atelier: "Coopérative Femmes Talladjé", vendeurId: "talladje", quartier: "Talladjé", matiere: "fibres", emoji: "👜", image: "sacs-fibres-vegetales.jpg", categorie: "Mode et accessoires", stock: 24, description: "Tissé à la main en palmier doum, anses en cuir recyclé. Pièce unique." },
  { id: "p2", nom: "Carnet en papier artisanal", prix: 2500, atelier: "Papeterie Kalley", vendeurId: "kalley", quartier: "Kalley", matiere: "papier", emoji: "📒", image: "papier-artisanal-carnets.jpg", categorie: "Papeterie", stock: 120, description: "80 pages en papier recyclé incrusté de pétales. Couverture rigide." },
  { id: "p3", nom: "Panneaux muraux acoustiques (lot de 10)", prix: 45000, atelier: "Atelier Pavé Sahel", vendeurId: "pave", quartier: "Gamkallé", matiere: "pet", emoji: "🧱", image: "panneaux-muraux-acoustiques.jpg", categorie: "Construction", stock: 15, description: "Hexagones en fibres plastiques compressées. Réduisent l'écho des salles de classe et bureaux." },
  { id: "p4", nom: "Sous-verres hexagonaux marbrés (x6)", prix: 6000, atelier: "Studio Marbré Niamey", vendeurId: "resine", quartier: "Koira Kano", matiere: "pet", emoji: "🎨", image: "sous-verres-marbres.jpg", categorie: "Décoration", stock: 40, description: "Coulés à partir de plastique fondu et de pigments. Chaque motif est unique." },
  { id: "p5", nom: "Dessous-de-plat illustrés en liège", prix: 3500, atelier: "Atelier Bouchon d'Or", vendeurId: "liege", quartier: "Plateau", matiere: "fibres", emoji: "🍽️", image: "liege-dessous-de-plat.jpg", categorie: "Maison et jardin", stock: 60, description: "Liège aggloméré et carreau imprimé. Résiste à la chaleur des marmites." },
  { id: "p6", nom: "Range-bouteilles en bois de récupération", prix: 15000, atelier: "Atelier Bouchon d'Or", vendeurId: "liege", quartier: "Plateau", matiere: "fibres", emoji: "🍾", image: "liege-porte-bouteilles.jpg", categorie: "Maison et jardin", stock: 8, description: "Neuf emplacements, assemblé à partir de palettes récupérées. Pour bouteilles d'huile, de jus ou de sirop." },
  { id: "p7", nom: "Pots de fleurs recyclés (x3)", prix: 9000, atelier: "Atelier Bouchon d'Or", vendeurId: "liege", quartier: "Plateau", matiere: "fibres", emoji: "🪴", image: "liege-pots-hexagonaux.jpg", categorie: "Maison et jardin", stock: 30, description: "Terre cuite et liège de récupération. Isolent les racines de la chaleur." },
  { id: "p8", nom: "Sac bandoulière crocheté en fil recyclé", prix: 6500, atelier: "Coopérative Femmes Talladjé", vendeurId: "talladje", quartier: "Talladjé", matiere: "pehd", emoji: "👛", image: "liege-sacs-portefeuilles.jpg", categorie: "Mode et accessoires", stock: 18, description: "Crocheté à la main avec du fil issu de sachets recyclés. Léger et lavable." },
  { id: "p9", nom: "Pavés autobloquants en plastique (x50)", prix: 25000, atelier: "Atelier Pavé Sahel", vendeurId: "pave", quartier: "Gamkallé", matiere: "pet", emoji: "🧱", categorie: "Construction", stock: 200, description: "Plastique fondu et sable, plus résistants que le béton aux chocs. 20 × 10 cm." },
  { id: "p10", nom: "Compost tamisé (sac de 25 kg)", prix: 2500, atelier: "Compost Harobanda", vendeurId: "compost", quartier: "Harobanda", matiere: "organique", emoji: "🌱", categorie: "Agriculture", stock: 340, description: "Compost mûr de 3 mois, tamisé. Pour maraîchage et pépinières." },
  { id: "p11", nom: "Briquettes de charbon de papier (x30)", prix: 3000, atelier: "Papeterie Kalley", vendeurId: "kalley", quartier: "Kalley", matiere: "papier", emoji: "🔥", categorie: "Énergie", stock: 90, description: "Remplacent le bois de chauffe. Brûlent 45 minutes sans fumée épaisse." },
  { id: "p12", nom: "Natte tressée en palmier doum", prix: 7500, atelier: "Coopérative Femmes Talladjé", vendeurId: "talladje", quartier: "Talladjé", matiere: "fibres", emoji: "🧺", categorie: "Maison et jardin", stock: 35, description: "2 × 1,5 m, teinture naturelle au henné et à l'indigo." },
  { id: "p13", nom: "Cabas crocheté en sachets recyclés", prix: 3500, atelier: "Coopérative Femmes Talladjé", vendeurId: "talladje", quartier: "Talladjé", matiere: "pehd", emoji: "🛍️", categorie: "Mode et accessoires", stock: 50, description: "70 sachets par sac, solide et lavable." },
];

/* Fournisseur d'un équipement (par nom). */
export const FOURNISSEURS: Record<string, string> = {
  "Sahel Machines": "sahelmachines",
  "Soudure Gamkallé": "gamkalle",
};

export type { MatiereId };
