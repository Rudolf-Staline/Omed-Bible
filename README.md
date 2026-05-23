# Omed Scripture

> Lire. Méditer. Retenir.

Omed Scripture est une application web moderne de lecture et d’étude biblique. Elle offre un environnement de lecture sobre, des outils d’annotation, la comparaison de traductions et une synchronisation cloud via Google Drive.

**Application :** https://omed-bible.vercel.app

---

## Fonctionnalités

### Lecture et étude
- Lecteur de chapitres avec navigation fluide par livre et chapitre.
- 6 traductions disponibles (français et anglais).
- Comparaison côte à côte de deux traductions.
- Lecture audio des chapitres.

### Outils personnels
- Marque-pages de versets.
- Surlignages et annotations.
- Notes personnelles.

### Organisation
- Parcours de lecture avec suivi de progression.

### Synchronisation
- Authentification Google.
- Synchronisation Google Drive des marque-pages, notes, surlignages, parcours et position de lecture.

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

- React 19
- TypeScript
- Vite 8
- Tailwind CSS 4
- React Router 7
- Zustand
- Framer Motion
- Lucide React
- React Hot Toast
- @react-oauth/google
- Vercel

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

### Variables d’environnement (optionnel)

Pour les traductions API.Bible (NIV, ESV, NLT), créez un fichier `.env` :

```env
VITE_BIBLE_API_KEY=votre_cle_api_bible
```

Clé disponible sur https://scripture.api.bible.

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

Configuration de proxy (`vercel.json`) :
- `/bible-api/` vers bible-api.com
- `/bible-proxy/` vers API.Bible
- `/:path*` vers `index.html` (SPA)

---

## Licence

Projet personnel à vocation éducative et spirituelle.
