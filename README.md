# Omed Scripture

Omed Scripture est une application web de lecture, d’annotation et d’étude biblique. Elle privilégie une expérience sobre centrée sur le texte, la méditation, les notes personnelles et l’organisation des passages.

## État produit

Fonctions disponibles :

- accueil avec reprise de lecture ;
- verset du jour déterministe selon la date ;
- lecture par livres et chapitres ;
- traductions françaises et anglaises ;
- comparaison de deux traductions ;
- mode Lecture et mode Étude ;
- audio via synthèse vocale navigateur ;
- recherche de versets avec historique local ;
- notes, marque-pages et surlignages ;
- collections personnelles de versets ;
- parcours de lecture ;
- synchronisation Google Drive AppData ;
- cache local récent pour lecture hors ligne partielle.

## Branches et déploiement

État observé : la branche par défaut GitHub est `feature/omed-bible-completion-14526576659558922335`. La documentation précédente indiquait un déploiement sur `main`, mais `main` n’est pas la branche canonique la plus avancée.

Branche canonique actuelle pour les PR produit :

```text
feature/omed-bible-completion-14526576659558922335
```

Action manuelle recommandée avant une v1 : choisir une branche stable unique, puis aligner GitHub et Vercel. L’option propre est de remettre `main` à jour et de configurer Vercel pour déployer `main`. Tant que ce n’est pas fait, le dépôt doit considérer la branche feature ci-dessus comme branche stable temporaire.

## Traductions

Les traductions affichées viennent de `src/utils/bibleApi.ts`, source unique de vérité.

| Traduction | Code | Langue | Source | Recherche |
|---|---:|---|---|---|
| Louis Segond 1910 | `lsg` | Français | bolls.life | Oui |
| Darby Français | `darby` | Français | bolls.life | Oui |
| King James Version | `kjv` | Anglais | bible-api.com | Oui |
| World English Bible | `web` | Anglais | bible-api.com | Oui |
| Bible in Basic English | `bbe` | Anglais | bible-api.com | Non garantie / désactivée |
| New International Version | `niv` | Anglais | API.Bible | Seulement si `VITE_BIBLE_API_KEY` est configurée |

Les traductions nécessitant une clé API sont masquées lorsque la clé n’est pas configurée. L’application évite les fallbacks trompeurs : si une traduction ou une recherche n’est pas disponible, elle affiche un message clair.

## Stack technique

| Technologie | Rôle |
|---|---|
| React 19 | Interface utilisateur |
| TypeScript | Typage statique |
| Vite 8 | Build et serveur de développement |
| Tailwind CSS 4 | Styles |
| React Router 7 | Routage |
| Zustand | État global |
| Framer Motion | Animations |
| Lucide React | Icônes |
| React Hot Toast | Notifications |
| @react-oauth/google | Authentification Google |
| Vercel | Hébergement |

## Installation locale

Prérequis : Node.js >= 18 et npm >= 9.

```bash
git clone https://github.com/Rudolf-Staline/Omed-Bible.git
cd Omed-Bible
npm install
npm run dev
```

Application locale : `http://localhost:5173`

Variables d’environnement :

```bash
cp .env.example .env
```

```env
VITE_BIBLE_API_KEY=votre_cle_api_bible
VITE_GOOGLE_CLIENT_ID=votre_client_id_google
```

- `VITE_BIBLE_API_KEY` active les traductions dépendant d’API.Bible.
- `VITE_GOOGLE_CLIENT_ID` active Google Sign-In et la synchronisation Drive AppData.

## Déploiement

`vercel.json` configure :

- build : `npm run build` ;
- sortie : `dist` ;
- framework : Vite ;
- proxy `/bible-api/` vers bible-api.com ;
- proxy `/bible-proxy/` vers API.Bible ;
- rewrite SPA vers `index.html`.

Avant publication, vérifier manuellement que la branche de production Vercel correspond à la branche stable GitHub choisie.

## Limites restantes

- La synchronisation Google Drive doit encore être durcie côté auth/token.
- Les collections sont stockées localement et incluses dans l’upload Drive, mais la restauration automatique complète des collections reste à finaliser.
- La recherche dépend de bolls.life et n’est pas disponible pour toutes les traductions.
- Le cache offline reste limité aux chapitres récemment consultés.

## Licence

Projet personnel à vocation éducative et spirituelle.
