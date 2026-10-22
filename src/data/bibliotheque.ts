// Bibliothèque vidéo de Tsafta Academy (prototype : miniatures seulement, vidéos à venir).

export type Theme = "plastique" | "liege" | "papier" | "fibres" | "construction";

export const THEMES: Record<Theme, { nom: string; couleur: string }> = {
  plastique: { nom: "Plastique et résine", couleur: "#5AB4F5" },
  liege: { nom: "Liège", couleur: "#F5BE55" },
  papier: { nom: "Papier et carton", couleur: "#F2E6C9" },
  fibres: { nom: "Fibres végétales", couleur: "#CDDA5C" },
  construction: { nom: "Construction et déco", couleur: "#FF9A2E" },
};

export interface Video {
  id: string;
  titre: string;
  theme: Theme;
  miniature: string; // chemin dans public/miniatures
  duree: string; // durée indicative affichée sur la miniature
}

export const VIDEOS: Video[] = [
  { id: "v1", titre: "Comment fabriquer des sous-verres hexagonaux décoratifs à effet marbré ?", theme: "plastique", miniature: "miniatures/sous-verres-marbres.jpg", duree: "12:40" },
  { id: "v2", titre: "Comment fabriquer des dessous-de-plat et objets décoratifs personnalisés à partir du liège ?", theme: "liege", miniature: "miniatures/liege-dessous-de-plat.jpg", duree: "9:15" },
  { id: "v3", titre: "Comment fabriquer des sacs et accessoires artisanaux à partir de fibres végétales ?", theme: "fibres", miniature: "miniatures/sacs-fibres-vegetales.jpg", duree: "18:05" },
  { id: "v4", titre: "Comment fabriquer des panneaux muraux décoratifs et acoustiques à partir de matériaux recyclés ?", theme: "construction", miniature: "miniatures/panneaux-muraux-acoustiques.jpg", duree: "15:30" },
  { id: "v5", titre: "Comment fabriquer un porte-bouteilles décoratif à partir de liège recyclé ?", theme: "liege", miniature: "miniatures/liege-porte-bouteilles.jpg", duree: "11:20" },
  { id: "v6", titre: "Comment fabriquer des pots de fleurs hexagonaux à partir de liège recyclé ?", theme: "liege", miniature: "miniatures/liege-pots-hexagonaux.jpg", duree: "8:45" },
  { id: "v7", titre: "Comment fabriquer du papier artisanal, des carnets et des objets décoratifs à partir de papier recyclé ?", theme: "papier", miniature: "miniatures/papier-artisanal-carnets.jpg", duree: "21:10" },
  { id: "v8", titre: "Comment fabriquer des sacs, portefeuilles et accessoires de mode à partir du liège ?", theme: "liege", miniature: "miniatures/liege-sacs-portefeuilles.jpg", duree: "16:55" },
];
