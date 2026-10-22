// Contenus fictifs pour Tsafta Academy, Tsafta Lab et Tsafta Equip.
import type { MatiereId } from "./donnees";

/* ---------------- Academy ---------------- */

export type FormatLecon = "video" | "fiche" | "pratique";

export interface Lecon {
  id: string;
  titre: string;
  format: FormatLecon;
  duree: string;
  contenu: string[]; // étapes ou points clés
}

export interface Formation {
  id: string;
  titre: string;
  matiere: MatiereId;
  niveau: "Débutant" | "Intermédiaire";
  formateur: string;
  resume: string;
  lecons: Lecon[];
}

export const FORMATIONS: Formation[] = [
  {
    id: "f-papier",
    titre: "Fabriquer du papier recyclé à la main",
    matiere: "papier",
    niveau: "Débutant",
    formateur: "Papeterie Kalley",
    resume: "Transformez cartons et vieux cahiers en feuilles, carnets et cartes vendables.",
    lecons: [
      { id: "l1", titre: "Trier et préparer le papier", format: "video", duree: "6 min", contenu: ["Séparez le papier blanc, le papier imprimé et le carton.", "Retirez agrafes, plastiques et rubans adhésifs.", "Déchirez en morceaux de 2 à 3 cm."] },
      { id: "l2", titre: "Préparer la pâte à papier", format: "fiche", duree: "5 min", contenu: ["Faites tremper 12 heures dans l'eau.", "Mixez jusqu'à obtenir une pâte lisse.", "Comptez environ 1 kg de papier pour 10 litres d'eau."] },
      { id: "l3", titre: "Former et sécher les feuilles", format: "pratique", duree: "1 séance", contenu: ["Plongez le cadre tamis dans la cuve et relevez-le à plat.", "Retournez la feuille sur un tissu et pressez.", "Faites sécher à l'ombre pendant 24 heures."] },
      { id: "l4", titre: "Fixer un prix et vendre", format: "fiche", duree: "4 min", contenu: ["Calculez le coût de l'eau, du temps et du matériel.", "Proposez des lots (10 cartes, 5 carnets).", "Publiez vos produits sur Tsafta Market."] },
    ],
  },
  {
    id: "f-compost",
    titre: "Produire un compost de qualité",
    matiere: "organique",
    niveau: "Débutant",
    formateur: "Compost Harobanda",
    resume: "Valorisez les déchets de marché en engrais naturel pour les maraîchers.",
    lecons: [
      { id: "l1", titre: "Choisir le site et les matières", format: "video", duree: "7 min", contenu: ["Un endroit ombragé, proche d'un point d'eau.", "Mélangez matières vertes (épluchures) et brunes (paille, feuilles).", "Évitez plastique, verre et métal."] },
      { id: "l2", titre: "Monter le tas ou la fosse", format: "pratique", duree: "1 séance", contenu: ["Alternez des couches de 20 cm vertes et brunes.", "Arrosez chaque couche sans détremper.", "Couvrez avec de la paille contre le soleil."] },
      { id: "l3", titre: "Entretenir et retourner", format: "fiche", duree: "5 min", contenu: ["Retournez toutes les 2 semaines.", "Le tas doit être chaud au centre et humide comme une éponge essorée.", "Le compost est mûr après 2 à 3 mois : brun, friable, odeur de terre."] },
      { id: "l4", titre: "Conditionner et vendre", format: "fiche", duree: "4 min", contenu: ["Tamisez pour retirer les morceaux grossiers.", "Ensachez par 25 kg.", "Ciblez les maraîchers du fleuve et les pépinières."] },
    ],
  },
  {
    id: "f-fibres",
    titre: "Valoriser les fibres végétales",
    matiere: "fibres",
    niveau: "Débutant",
    formateur: "Coopérative Femmes Talladjé",
    resume: "Nattes, paniers et objets décoratifs en palmier doum et tiges de mil.",
    lecons: [
      { id: "l1", titre: "Récolter et sécher les fibres", format: "video", duree: "5 min", contenu: ["Coupez les feuilles de doum jeunes et souples.", "Séchez 5 à 7 jours à l'ombre.", "Fendez en lanières régulières."] },
      { id: "l2", titre: "Les tressages de base", format: "pratique", duree: "2 séances", contenu: ["Tresse à trois brins pour les bordures.", "Tressage croisé pour les nattes.", "Spirale cousue pour les paniers."] },
      { id: "l3", titre: "Teindre naturellement", format: "fiche", duree: "4 min", contenu: ["Feuilles de henné pour l'orange.", "Écorce et indigo pour le bleu.", "Fixez la couleur avec de l'eau salée."] },
    ],
  },
  {
    id: "f-pave",
    titre: "Pavés et tuiles en plastique recyclé",
    matiere: "pet",
    niveau: "Intermédiaire",
    formateur: "Atelier Pavé Sahel",
    resume: "Mélangez plastique fondu et sable pour produire des pavés résistants.",
    lecons: [
      { id: "l1", titre: "Sécurité avant tout", format: "video", duree: "8 min", contenu: ["Travaillez en plein air, jamais dans un local fermé.", "Masque à cartouche, gants et lunettes obligatoires.", "Ne brûlez jamais le plastique à flamme nue."] },
      { id: "l2", titre: "Préparer le mélange", format: "fiche", duree: "6 min", contenu: ["Lavez et broyez le plastique.", "Proportion type : 1 volume de plastique pour 2 à 3 volumes de sable tamisé.", "Chauffez dans un fût fermé en remuant constamment."] },
      { id: "l3", titre: "Mouler et démouler", format: "pratique", duree: "2 séances", contenu: ["Huilez les moules métalliques.", "Versez et tassez rapidement.", "Démoulez après refroidissement complet."] },
      { id: "l4", titre: "Contrôle qualité et vente", format: "fiche", duree: "5 min", contenu: ["Vérifiez qu'il n'y a ni fissures ni bulles.", "Proposez des lots aux mairies, écoles et particuliers.", "Mettez en avant la durabilité et l'origine recyclée."] },
    ],
  },
  {
    id: "f-sachets",
    titre: "Tisser des sacs avec des sachets plastiques",
    matiere: "pehd",
    niveau: "Débutant",
    formateur: "Coopérative Femmes Talladjé",
    resume: "Transformez les sachets en fil plastique pour crocheter sacs et tapis.",
    lecons: [
      { id: "l1", titre: "Laver et découper le « plarn »", format: "video", duree: "6 min", contenu: ["Lavez et séchez les sachets.", "Découpez des bandes de 3 cm.", "Nouez-les en un long fil continu."] },
      { id: "l2", titre: "Crocheter un cabas", format: "pratique", duree: "3 séances", contenu: ["Base en spirale, puis montée droite.", "Renforcez les anses par une double rangée.", "Comptez 60 à 80 sachets par sac."] },
    ],
  },
];

/* ---------------- Lab ---------------- */

export interface Debouche {
  produit: string;
  prixVente: string;
  marche: string;
}

export interface FicheLab {
  matiere: MatiereId;
  potentiel: 1 | 2 | 3; // attractivité économique
  accroche: string;
  debouches: Debouche[];
  competences: string[];
  equipements: string[]; // identifiants Equip
  investissement: [number, number]; // fourchette FCFA
  rendement: number; // part de la matière brute valorisée (0-1)
  prixProduitKg: number; // valeur moyenne du produit fini par kg de matière
  autresCoutsKg: number; // énergie, main-d'œuvre, consommables par kg
  delai: string;
}

export const LAB: FicheLab[] = [
  { matiere: "pet", potentiel: 3, accroche: "La matière la plus abondante à Niamey, avec des débouchés dans la construction.", debouches: [{ produit: "Pavés autobloquants", prixVente: "500 FCFA / pièce", marche: "Mairies, écoles, particuliers" }, { produit: "Paillettes PET lavées", prixVente: "250 FCFA / kg", marche: "Recycleurs régionaux" }, { produit: "Tuiles et bordures", prixVente: "750 FCFA / pièce", marche: "Chantiers" }], competences: ["Tri et lavage", "Sécurité thermique", "Moulage"], equipements: ["e-broyeur", "e-fut", "e-moules", "e-epi"], investissement: [450000, 2500000], rendement: 0.85, prixProduitKg: 420, autresCoutsKg: 120, delai: "2 à 3 mois" },
  { matiere: "pehd", potentiel: 2, accroche: "Bidons et sachets se transforment en objets durables et en fil à crocheter.", debouches: [{ produit: "Sacs cabas tissés", prixVente: "3 500 FCFA", marche: "Marchés, boutiques" }, { produit: "Granulés PEHD", prixVente: "300 FCFA / kg", marche: "Industriels" }], competences: ["Crochet", "Tri par couleur", "Broyage"], equipements: ["e-broyeur", "e-epi"], investissement: [50000, 1800000], rendement: 0.8, prixProduitKg: 520, autresCoutsKg: 160, delai: "1 mois" },
  { matiere: "papier", potentiel: 2, accroche: "Peu d'investissement pour démarrer, idéal pour un premier atelier.", debouches: [{ produit: "Carnets et cartes", prixVente: "400 FCFA / carnet", marche: "Écoles, cadeaux" }, { produit: "Briquettes combustibles", prixVente: "100 FCFA / pièce", marche: "Ménages, restaurants" }, { produit: "Emballages en pâte moulée", prixVente: "150 FCFA / pièce", marche: "Restaurants" }], competences: ["Fabrication de pâte", "Pressage", "Finition"], equipements: ["e-mixeur", "e-presse", "e-tamis"], investissement: [80000, 600000], rendement: 0.7, prixProduitKg: 300, autresCoutsKg: 90, delai: "2 à 4 semaines" },
  { matiere: "metal", potentiel: 3, accroche: "Forte valeur au kilo, filière déjà organisée autour des ferrailleurs.", debouches: [{ produit: "Aluminium compacté", prixVente: "450 FCFA / kg", marche: "Fonderies régionales" }, { produit: "Ustensiles fondus", prixVente: "2 000 FCFA / pièce", marche: "Marchés" }], competences: ["Tri des métaux", "Compactage", "Fonderie artisanale"], equipements: ["e-compacteur", "e-balance", "e-epi"], investissement: [200000, 3000000], rendement: 0.9, prixProduitKg: 480, autresCoutsKg: 110, delai: "1 mois" },
  { matiere: "fibres", potentiel: 2, accroche: "Un savoir-faire sahélien existant, valorisé par le design et la vente en ligne.", debouches: [{ produit: "Nattes", prixVente: "7 500 FCFA", marche: "Ménages, hôtels" }, { produit: "Paniers décoratifs", prixVente: "4 000 FCFA", marche: "Boutiques, export" }], competences: ["Tressage", "Teinture naturelle", "Finition"], equipements: ["e-outils-tressage"], investissement: [25000, 300000], rendement: 0.75, prixProduitKg: 650, autresCoutsKg: 260, delai: "2 semaines" },
  { matiere: "organique", potentiel: 2, accroche: "Des volumes énormes et une demande réelle des maraîchers.", debouches: [{ produit: "Compost tamisé", prixVente: "100 FCFA / kg", marche: "Maraîchers, pépinières" }, { produit: "Lombricompost", prixVente: "250 FCFA / kg", marche: "Jardins urbains" }], competences: ["Gestion du tas", "Contrôle d'humidité", "Tamisage"], equipements: ["e-tamis", "e-brouette", "e-balance"], investissement: [60000, 900000], rendement: 0.45, prixProduitKg: 110, autresCoutsKg: 20, delai: "3 mois" },
  { matiere: "verre", potentiel: 1, accroche: "Réemploi rentable des bouteilles, transformation plus exigeante.", debouches: [{ produit: "Bouteilles lavées pour réemploi", prixVente: "75 FCFA / pièce", marche: "Producteurs de jus et d'huile" }, { produit: "Objets décoratifs", prixVente: "1 500 FCFA", marche: "Boutiques" }], competences: ["Lavage", "Découpe du verre", "Sécurité"], equipements: ["e-coupe-verre", "e-epi"], investissement: [40000, 400000], rendement: 0.8, prixProduitKg: 150, autresCoutsKg: 50, delai: "1 mois" },
];

/* ---------------- Equip ---------------- */

export type Energie = "Manuel" | "Électrique" | "Solaire";

export interface Equipement {
  id: string;
  nom: string;
  categorie: "Broyage" | "Transformation" | "Mesure" | "Sécurité" | "Manutention";
  matieres: MatiereId[];
  energie: Energie;
  capacite: string;
  prix: number;
  fournisseur: string;
  disponibilite: "En stock" | "Sur commande" | "Location possible";
  description: string;
}

export const EQUIPEMENTS: Equipement[] = [
  { id: "e-broyeur", nom: "Broyeur à plastique 3 kW", categorie: "Broyage", matieres: ["pet", "pehd"], energie: "Électrique", capacite: "50 kg / heure", prix: 1850000, fournisseur: "Sahel Machines", disponibilite: "Sur commande", description: "Broie bouteilles et bidons en paillettes. Lames en acier traité, grille de 10 mm." },
  { id: "e-fut", nom: "Fût de fusion avec malaxeur", categorie: "Transformation", matieres: ["pet", "pehd"], energie: "Manuel", capacite: "30 kg / cycle", prix: 185000, fournisseur: "Soudure Gamkallé", disponibilite: "En stock", description: "Fût métallique fermé avec malaxeur manuel pour le mélange plastique et sable." },
  { id: "e-moules", nom: "Lot de 10 moules à pavés", categorie: "Transformation", matieres: ["pet", "pehd"], energie: "Manuel", capacite: "10 pavés / cycle", prix: 120000, fournisseur: "Soudure Gamkallé", disponibilite: "En stock", description: "Moules en acier pour pavés autobloquants 20 × 10 cm." },
  { id: "e-compacteur", nom: "Compacteur de canettes", categorie: "Transformation", matieres: ["metal"], energie: "Manuel", capacite: "200 canettes / heure", prix: 95000, fournisseur: "Sahel Machines", disponibilite: "En stock", description: "Réduit le volume des canettes de 80 % pour le transport." },
  { id: "e-presse", nom: "Presse à papier à vis", categorie: "Transformation", matieres: ["papier"], energie: "Manuel", capacite: "20 feuilles / pressée", prix: 145000, fournisseur: "Menuiserie Kalley", disponibilite: "Sur commande", description: "Presse en bois dur pour l'essorage des feuilles et des briquettes." },
  { id: "e-mixeur", nom: "Pulpeur à papier 1,5 kW", categorie: "Broyage", matieres: ["papier"], energie: "Électrique", capacite: "15 kg / heure", prix: 380000, fournisseur: "Sahel Machines", disponibilite: "Location possible", description: "Cuve en inox pour transformer le papier trempé en pâte homogène." },
  { id: "e-tamis", nom: "Cadres tamis (lot de 4)", categorie: "Transformation", matieres: ["papier", "organique"], energie: "Manuel", capacite: "A4 et A3", prix: 28000, fournisseur: "Menuiserie Kalley", disponibilite: "En stock", description: "Cadres en bois avec toile inox, pour le papier ou le tamisage du compost." },
  { id: "e-balance", nom: "Balance plateforme solaire 300 kg", categorie: "Mesure", matieres: ["pet", "pehd", "papier", "metal", "fibres", "organique", "verre"], energie: "Solaire", capacite: "300 kg, précision 100 g", prix: 165000, fournisseur: "Énergie Verte Niger", disponibilite: "En stock", description: "Indispensable pour peser et enregistrer chaque collecte. Batterie rechargée par panneau intégré." },
  { id: "e-epi", nom: "Kit de protection complet", categorie: "Sécurité", matieres: ["pet", "pehd", "metal", "verre"], energie: "Manuel", capacite: "1 personne", prix: 35000, fournisseur: "Sécurité Plus Niamey", disponibilite: "En stock", description: "Masque à cartouche, lunettes, gants anti-coupure et tablier." },
  { id: "e-brouette", nom: "Brouette renforcée", categorie: "Manutention", matieres: ["organique", "fibres", "papier"], energie: "Manuel", capacite: "120 litres", prix: 42000, fournisseur: "Quincaillerie Wadata", disponibilite: "En stock", description: "Roue gonflable, châssis renforcé pour terrains sableux." },
  { id: "e-outils-tressage", nom: "Kit d'outils de tressage", categorie: "Transformation", matieres: ["fibres"], energie: "Manuel", capacite: "1 artisan", prix: 15000, fournisseur: "Coopérative Femmes Talladjé", disponibilite: "En stock", description: "Alênes, aiguilles, couteaux de fente et gabarits." },
  { id: "e-coupe-verre", nom: "Coupe-bouteilles et ponceuse", categorie: "Transformation", matieres: ["verre"], energie: "Manuel", capacite: "40 bouteilles / jour", prix: 38000, fournisseur: "Sahel Machines", disponibilite: "Sur commande", description: "Découpe nette des bouteilles pour verres, lampes et pots." },
  { id: "e-tricycle", nom: "Tricycle de collecte", categorie: "Manutention", matieres: ["pet", "pehd", "papier", "metal", "verre"], energie: "Manuel", capacite: "250 kg", prix: 320000, fournisseur: "Quincaillerie Wadata", disponibilite: "Location possible", description: "Benne grillagée, idéal pour les tournées de collecte en quartier." },
];

export const equipement = (id: string) => EQUIPEMENTS.find((e) => e.id === id);
