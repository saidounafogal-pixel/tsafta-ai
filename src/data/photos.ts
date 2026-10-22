// Photos du Market (banque d'images libre Pexels), nommées d'après l'identifiant de l'article.
// Un article sans photo (par exemple publié depuis l'application) garde le visuel dessiné.
const PHOTOS = import.meta.glob("../assets/marche/*.jpg", { eager: true, import: "default" }) as Record<string, string>;

export const photoArticle = (id: string): string | undefined => PHOTOS[`../assets/marche/${id}.jpg`];
