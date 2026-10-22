# Tsafta AI

**Apprendre, collecter, transformer et entreprendre.**

Tsafta AI est une plateforme nigérienne qui connecte les acteurs de l'économie circulaire : citoyens, collecteurs, recycleurs, entrepreneurs, fournisseurs d'équipements et acheteurs. Projet pilote : Niamey.

## Modules

| Module | Rôle |
| --- | --- |
| **Collecte** | Le citoyen photographie ses déchets, la matière est identifiée, il choisit un collecteur proche. Le collecteur pèse, enregistre la transaction et remet un reçu avec code de traçabilité. |
| **Tsafta Market** | Annonces de matières recyclables (filtres nature, quantité, qualité, prix), comparaison jusqu'à 3 lots, demandes d'achat, vente de produits recyclés. |
| **Tsafta Academy** | Formations en vidéos, fiches illustrées et ateliers pratiques, avec suivi de progression. |
| **Tsafta Lab** | Potentiel économique de chaque matière : débouchés, compétences, équipements, investissement et simulateur de rentabilité. |
| **Tsafta Equip** | Catalogue de machines et d'outils filtrable par catégorie et budget, demande de devis. |
| **Mon atelier** | Journal des ventes et dépenses de la micro-entreprise, bénéfice et marge. |
| **Traçabilité** | Quantités par matière et par quartier, destinations, registre des transactions, export CSV. |

L'application s'adapte au profil choisi : citoyen, collecteur, atelier ou acheteur.

## Technique

- React 18, TypeScript, Vite, Tailwind CSS
- Application web installable (PWA), pensée pour le mobile
- Données de démonstration enregistrées sur l'appareil (localStorage)

```bash
npm install
npm run dev      # développement
npm run build    # version de production dans dist/
```

Chaque push sur `main` met l'application en ligne via GitHub Pages (`.github/workflows/deploy.yml`).

## Prototype : ce qui reste à brancher

- **Identification des matières** : l'analyse actuelle se base sur les couleurs de la photo. Elle doit être remplacée par un modèle de vision entraîné sur des photos de déchets de Niamey.
- **Backend et comptes** : base de données partagée (utilisateurs, annonces, transactions), authentification par numéro de téléphone.
- **Paiement** : Mobile Money (Airtel Money, Moov Money, Zamani Cash).
- **Données réelles** : prix, collecteurs, ateliers et fournisseurs du pilote.

## Design

Palette : vert forêt profond (`#081A13` à `#145A42`), cartes en verre dépoli, orange lumineux en dégradé (`#FFB547` à `#F26D0F`) pour les actions, menthe (`#45E0A0`) pour les états actifs. Typographie Plus Jakarta Sans. Mascotte : Tsafti, un fennec du Sahel dessiné en SVG.

## Crédits photos

Les photos du Market proviennent de [Pexels](https://www.pexels.com) (licence Pexels : utilisation gratuite, attribution non obligatoire). Elles illustrent le prototype et seront remplacées par des photos des collecteurs et ateliers du pilote. Les miniatures de la bibliothèque vidéo ont été fournies par le porteur du projet.
