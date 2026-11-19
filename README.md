    # CineTrip — Explorateur de Lieux de Tournage & Météo

Projet réalisé en binôme dans le cadre de la formation **Concepteur Développeur d'Applications (CDA)**.

## Équipe & Répartition du Binôme

- **MESTIRI Intissar** 
- **BEN TMELIST Moataza** 

## Présentation du Projet

Cette application Web permet de rechercher une série ou un film, de localiser ses lieux de tournage sur une carte et de consulter la météo locale en temps réel :
- **Recherche dynamique** par titre de série ou d'œuvre audiovisuelle (*Breaking Bad*, *Emily in Paris*, *Game of Thrones*...).
- **Affichage détaillé** avec affiche officielle, synopsis, genres et informations de production.
- **Carte interactive & Météo** permettant de visualiser le lieu de tournage et les conditions climatiques actuelles sur place.

## Documentation des APIs Utilisées

- **API TVMaze (Séries & Métadonnées) :** 100 % gratuite et sans clé API.
  - **Endpoint de recherche :**
    `https://api.tvmaze.com/search/shows?q={titre}`
- **API Nominatim / OpenStreetMap (Géolocalisation) :** Gratuite et sans clé API.
  - **Endpoint de géocodage :**
    `https://nominatim.openstreetmap.org/search?q={lieu}&format=json`
- **API Open-Meteo (Météo en temps réel) :** Gratuite et sans clé API.
  - **Endpoint météo :**
    `https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current_weather=true`

## Lancement dans Antigravity IDE

> **Important :** Comme le projet utilise les modules ES6 (`import` / `export`), il doit être ouvert via un serveur local (et non en double-cliquant sur le fichier HTML).

1. Ouvrir le dossier `cinetrip` dans **Antigravity IDE**.
2. Faire un clic droit sur `index.html` puis sélectionner **Open with Live Server** (ou lancer `npx serve` dans le terminal intégré).