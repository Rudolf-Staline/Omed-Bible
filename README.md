# Omed Scripture

Omed Scripture est une application web moderne de lecture, d’annotation et d’étude biblique. Elle propose une expérience sobre centrée sur le texte biblique, avec plusieurs traductions, un mode comparaison, des outils personnels d’organisation et une synchronisation cloud via Google Drive.

**Application :** https://omed-bible.vercel.app

---

## Vue d’ensemble

Omed Scripture vise à offrir un espace calme pour lire, étudier et méditer les Écritures. L’application rassemble les fonctions essentielles d’un lecteur biblique personnel dans une interface lisible, structurée et pensée pour la concentration.

Fonctions principales :

- lecture par livres et chapitres ;
- traductions françaises et anglaises ;
- comparaison de traductions côte à côte ;
- lecture audio des chapitres ;
- recherche de versets ;
- notes personnelles ;
- marque-pages ;
- surlignages ;
- parcours de lecture ;
- synchronisation Google Drive.

---

## Fonctionnalités

### Lecture biblique

- Navigation fluide entre livres et chapitres.
- Six traductions disponibles en français et en anglais.
- Comparaison simultanée de deux traductions.
- Lecteur audio intégré pour écouter un chapitre.

### Recherche

- Recherche de versets par mots-clés.
- Accès rapide aux passages trouvés.

### Annotation et organisation

- Marque-pages pour sauvegarder des versets importants.
- Surlignages avec plusieurs couleurs.
- Notes personnelles associées aux versets.

### Parcours de lecture

- Parcours de lecture biblique avec suivi de progression.
- Vue détaillée des étapes de lecture.

### Synchronisation Google Drive

- Authentification Google Sign-In.
- Synchronisation des marque-pages, notes, surlignages, parcours et position de lecture.
- Stockage des données applicatives via Google Drive AppData.

### Préférences

- Personnalisation de l’expérience de lecture.
- Réglages visuels et options d’affichage selon les paramètres disponibles dans l’application.

---

## Design direction

L’application suit une direction visuelle calme, adulte et lisible. L’objectif est de réduire la distraction, de renforcer le confort de lecture et de donner au texte biblique une place centrale. L’interface privilégie la sobriété, l’espacement, une hiérarchie claire et des éléments d’action discrets.

---

## Documentation

Un guide utilisateur court est disponible dans [`docs/USER_GUIDE.md`](docs/USER_GUIDE.md). Il couvre la lecture, les traductions, la comparaison, l’audio, les marque-pages, les notes, les surlignages, les parcours et la synchronisation Google Drive.

---

## Traductions disponibles

| Traduction | Code | Langue | Source API |
|---|---|---|---|
| Louis Segond 1910 | `LSG` | Français | [api.getbible.net](https://api.getbible.net) |
| Darby (Français) | `DBY` | Français | [api.getbible.net](https://api.getbible.net) |
| Martin 1744 | `MAR` | Français | [api.getbible.net](https://api.getbible.net) |
| King James Version | `KJV` | English | [bible-api.com](https://bible-api.com) |
| World English Bible | `WEB` | English | [bible-api.com](https://bible-api.com) |
| New International Version | `NIV` | English | [API.Bible](https://scripture.api.bible) |

---

## Stack technique

| Technologie | Rôle |
|---|---|
| React 19 | Interface utilisateur |
| TypeScript | Typage statique |
| Vite 8 | Build et serveur de développement |
| Tailwind CSS 4 | Système de styles utilitaires |
| React Router 7 | Routage côté client |
| Zustand | Gestion d’état global |
| Framer Motion | Animations d’interface |
| Lucide React | Icônes |
| React Hot Toast | Notifications |
| @react-oauth/google | Authentification Google |
| Vercel | Déploiement et hébergement |

---

## Installation locale

### Prérequis

- Node.js >= 18
- npm >= 9

### Démarrage

```bash
git clone https://github.com/Rudolf-Staline/Omed-Bible.git
cd Omed-Bible
npm install
npm run dev
```

Application locale : `http://localhost:5173`

### Variables d’environnement

Copiez le fichier d’exemple puis renseignez les valeurs nécessaires :

```bash
cp .env.example .env
```

```env
VITE_BIBLE_API_KEY=votre_cle_api_bible
VITE_GOOGLE_CLIENT_ID=votre_client_id_google
```

- `VITE_BIBLE_API_KEY` : clé utilisée pour les traductions dépendant d’API.Bible.
- `VITE_GOOGLE_CLIENT_ID` : identifiant OAuth utilisé pour Google Sign-In et la synchronisation Google Drive AppData.

Clé API.Bible disponible sur https://scripture.api.bible.

---

## Structure du projet

```text
src/
├── components/          # Composants réutilisables
├── features/            # Pages fonctionnelles
├── store/               # Stores Zustand
├── utils/               # API Bible + synchronisation Drive
├── App.tsx              # Routes
└── main.tsx             # Entrée application
```

---

## Déploiement

Le projet est déployé sur Vercel à chaque push sur `main`.

Configurez les variables d’environnement nécessaires dans les paramètres du projet Vercel avant le déploiement.

Configuration de proxy dans `vercel.json` :

- `/bible-api/` vers bible-api.com ;
- `/bible-proxy/` vers API.Bible ;
- `/:path*` vers `index.html` pour le routage SPA.

---

## Licence

Projet personnel à vocation éducative et spirituelle.
