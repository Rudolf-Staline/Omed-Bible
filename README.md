# Omed Scripture

Omed Scripture est une application web moderne de lecture, d’annotation et d’étude biblique. Elle permet de lire la Bible dans plusieurs traductions, de comparer les textes, d’écouter les chapitres en audio et de conserver ses repères d’étude grâce à une synchronisation cloud via Google Drive.

**Application en ligne :** https://omed-bible.vercel.app

---

## Vue d’ensemble

Le projet propose une expérience de lecture biblique complète, pensée pour un usage personnel quotidien :

- lecture par livres et chapitres
- traductions françaises et anglaises
- comparaison de traductions côte à côte
- audio des chapitres
- recherche de versets
- notes personnelles
- marque-pages
- surlignages
- parcours de lecture
- synchronisation Google Drive

---

## Fonctionnalités

### Lecture biblique
- Navigation fluide entre livres et chapitres
- 6 traductions disponibles
- Comparaison simultanée de deux traductions
- Lecteur audio intégré

### Recherche
- Recherche de versets par mots-clés

### Annotation et organisation
- Marque-pages pour sauvegarder des versets
- Surlignages avec couleurs personnalisables
- Notes personnelles associées aux versets

### Parcours de lecture
- Parcours de lecture biblique avec suivi de progression
- Vue détaillée des chapitres jour par jour

### Synchronisation Google Drive
- Authentification Google Sign-In
- Synchronisation automatique des marque-pages, notes, surlignages, parcours et position de lecture entre appareils

### Paramètres
- Personnalisation de l’expérience de lecture

---

## Design direction

L’application suit une direction de design calme et lisible, centrée sur le texte biblique. L’objectif est de réduire la distraction visuelle, de faciliter la concentration et d’offrir un cadre adapté à la lecture, à la méditation et à l’étude.

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
| **React 19** | Framework UI |
| **TypeScript** | Typage statique |
| **Vite 8** | Build et serveur de développement |
| **Tailwind CSS 4** | Styles utilitaires |
| **React Router 7** | Routage SPA |
| **Zustand** | État global |
| **Framer Motion** | Animations d’interface |
| **Lucide React** | Icônes |
| **React Hot Toast** | Notifications |
| **@react-oauth/google** | Authentification Google |
| **Vercel** | Déploiement et hébergement |

---

## Installation locale

### Prérequis
- **Node.js** ≥ 18
- **npm** ≥ 9

### Démarrage

```bash
git clone https://github.com/Rudolf-Staline/Omed-Bible.git
cd Omed-Bible
npm install
npm run dev
```

L’application sera accessible sur `http://localhost:5173`.

### Variables d’environnement (optionnel)

Pour activer les traductions API.Bible (NIV, ESV, NLT), créez un fichier `.env` :

```env
VITE_BIBLE_API_KEY=votre_cle_api_bible
```

Clé API disponible sur [scripture.api.bible](https://scripture.api.bible).

---

## Déploiement Vercel

Le projet est déployé automatiquement sur **Vercel** à chaque push sur la branche `main`.

### Configuration (`vercel.json`)

```json
{
  "rewrites": [
    { "source": "/bible-api/:path*", "destination": "https://bible-api.com/:path*" },
    { "source": "/bible-proxy/:path*", "destination": "https://api.scripture.api.bible/v1/:path*" },
    { "source": "/:path*", "destination": "/index.html" }
  ]
}
```

- `/bible-api/` : proxy vers bible-api.com (traductions anglaises)
- `/bible-proxy/` : proxy vers API.Bible (NIV, ESV, NLT)
- `/:path*` : redirection SPA vers `index.html`

Les traductions françaises ne passent pas par ces rewrites Vercel : selon la traduction, les appels sont effectués directement côté client vers la source configurée (par exemple `bolls.life` pour LSG et Darby).

---

## Licence

Projet personnel à but éducatif et spirituel.
