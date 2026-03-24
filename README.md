# 📖 Omed-Bible

> *La Parole, toujours avec vous.*

Application web de lecture biblique moderne, construite avec React et déployée sur Vercel. Omed-Bible permet de lire, comparer et étudier la Bible dans plusieurs traductions, avec synchronisation cloud via Google Drive.

🔗 **[Accéder à l'application](https://omed-bible.vercel.app)**

---

## ✨ Fonctionnalités

### 📚 Lecture
- **Lecteur de chapitres** avec navigation fluide entre livres et chapitres
- **6 traductions disponibles** — françaises et anglaises
- **Comparaison côte à côte** de deux traductions simultanément
- **Lecteur audio** intégré pour l'écoute des chapitres

### 🔍 Recherche
- Recherche de versets par mots-clés (via API.Bible pour NIV/ESV/NLT)

### ⭐ Favoris & Notes
- **Favoris** — sauvegardez vos versets préférés
- **Surlignage** de versets avec couleurs personnalisables
- **Notes personnelles** associées aux versets

### 📅 Plans de lecture
- Plans de lecture biblique avec suivi de progression
- Détail de chaque plan avec chapitres jour par jour

### ☁️ Synchronisation
- **Google Sign-In** pour l'authentification
- **Google Drive** — synchronisation automatique des favoris, notes, surlignages, plans et position de lecture entre appareils

### ⚙️ Paramètres
- Personnalisation de l'expérience de lecture

---

## 🌐 Traductions disponibles

| Traduction | Code | Langue | Source API |
|---|---|---|---|
| Louis Segond 1910 | `LSG` | 🇫🇷 Français | [api.getbible.net](https://api.getbible.net) |
| Darby (Français) | `DBY` | 🇫🇷 Français | [api.getbible.net](https://api.getbible.net) |
| Martin 1744 | `MAR` | 🇫🇷 Français | [api.getbible.net](https://api.getbible.net) |
| King James Version | `KJV` | 🇬🇧 English | [bible-api.com](https://bible-api.com) |
| World English Bible | `WEB` | 🇬🇧 English | [bible-api.com](https://bible-api.com) |
| New International Version | `NIV` | 🇬🇧 English | [API.Bible](https://scripture.api.bible) |

---

## 🛠️ Stack technique

| Technologie | Rôle |
|---|---|
| **React 19** | Framework UI |
| **TypeScript** | Typage statique |
| **Vite 8** | Build & dev server |
| **Tailwind CSS 4** | Styles utilitaires |
| **React Router 7** | Routage SPA |
| **Zustand** | État global (stores) |
| **Framer Motion** | Animations |
| **Lucide React** | Icônes |
| **React Hot Toast** | Notifications |
| **@react-oauth/google** | Authentification Google |
| **Vercel** | Déploiement & hébergement |

---

## 🚀 Installation locale

### Prérequis
- **Node.js** ≥ 18
- **npm** ≥ 9

### Lancer le projet

```bash
# Cloner le dépôt
git clone https://github.com/Rudolf-Staline/Omed-Bible.git
cd Omed-Bible

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

L'application sera accessible sur `http://localhost:5173`.

### Variables d'environnement (optionnel)

Pour utiliser les traductions API.Bible (NIV, ESV, NLT), créez un fichier `.env` :

```env
VITE_BIBLE_API_KEY=votre_cle_api_bible
```

> Obtenez une clé gratuite sur [scripture.api.bible](https://scripture.api.bible).

---

## 📁 Structure du projet

```
src/
├── components/          # Composants réutilisables
│   ├── AudioPlayer.tsx  # Lecteur audio intégré
│   ├── Layout.tsx       # Layout principal avec sidebar
│   └── Sidebar.tsx      # Navigation latérale
├── features/            # Pages et fonctionnalités
│   ├── auth/            # Authentification Google
│   ├── favorites/       # Gestion des favoris
│   ├── notes/           # Notes personnelles
│   ├── plans/           # Plans de lecture
│   ├── reader/          # Lecteur biblique principal
│   ├── search/          # Recherche de versets
│   └── settings/        # Paramètres
├── store/               # State management (Zustand)
│   ├── useAuthStore.ts
│   ├── useBibleStore.ts
│   ├── useFavoritesStore.ts
│   ├── useHighlightsStore.ts
│   ├── useNotesStore.ts
│   ├── usePlansStore.ts
│   └── useSettingsStore.ts
├── utils/
│   ├── bibleApi.ts      # Logique d'appels API Bible
│   └── driveSync.ts     # Synchronisation Google Drive
├── App.tsx              # Routes de l'application
└── main.tsx             # Point d'entrée
```

---

## 🌍 Déploiement

Le projet est déployé automatiquement sur **Vercel** à chaque push sur la branche `main`.

### Configuration Vercel (`vercel.json`)

```json
{
  "rewrites": [
    { "source": "/bible-api/:path*", "destination": "https://bible-api.com/:path*" },
    { "source": "/bible-proxy/:path*", "destination": "https://api.scripture.api.bible/v1/:path*" },
    { "source": "/:path*", "destination": "/index.html" }
  ]
}
```

- **`/bible-api/`** → Proxy vers bible-api.com (traductions anglaises)
- **`/bible-proxy/`** → Proxy vers API.Bible (NIV, ESV, NLT)
- **`/:path*`** → Catch-all SPA vers `index.html`

> Les traductions françaises (LSG, Darby, Martin) appellent directement `api.getbible.net` qui supporte CORS nativement.

---

## 📄 Licence

Ce projet est un projet personnel à but éducatif et spirituel.

---

<p align="center">
  <em>Fait avec ❤️ et foi</em>
</p>
