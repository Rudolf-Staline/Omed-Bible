# Audit léger accessibilité & responsive

## Problèmes trouvés

- Plusieurs boutons icône-only n'avaient pas de label accessible (`aria-label`) : lecteur audio, actions de verset, boutons de comparaison/audio dans le lecteur.
- Certaines zones cliquables étaient trop petites sur mobile (notamment actions de verset et contrôles secondaires).
- La mise en page du lecteur pouvait provoquer des difficultés de lecture/navigation sur petit écran (double colonne trop tôt, sélecteurs serrés).
- Risque d'overflow horizontal via certains conteneurs (layout global + barre d'actions de verset).
- Navigation mobile peu pratique avec sidebar desktop uniquement.
- Formulaire de recherche moins ergonomique sur mobile (bouton superposé, champ dense).

## Corrections appliquées

- Ajout d'`aria-label` sur les boutons sans texte visible dans:
  - `src/components/AudioPlayer.tsx`
  - `src/features/reader/ReaderPage.tsx`
  - `src/features/reader/VerseActions.tsx`
  - `src/features/search/SearchPage.tsx`
- Agrandissement des cibles tactiles vers ~44px mini pour les boutons critiques (actions de verset, contrôles audio secondaires).
- Amélioration responsive du lecteur:
  - sélecteurs plus espacés et plus hauts,
  - passage en empilement vertical avant `lg` pour la zone de comparaison,
  - espacements mobiles ajustés.
- Ajout d'une navigation mobile basse simple dans `Sidebar` (sans refonte de logique), tout en conservant la sidebar desktop.
- Prévention d'overflow horizontal:
  - `overflow-x-hidden` sur le layout global,
  - conteneur d'actions de verset contraint avec scroll horizontal local si besoin.
- Ajustements du formulaire de recherche mobile:
  - bouton de soumission pleine largeur sur petit écran,
  - tailles de texte/espacement adaptées.

## Recommandations restantes (non appliquées pour éviter une refonte)

- Vérifier les contrastes avec un outil automatisé (ex. axe/Lighthouse) sur toutes les variantes de thème/couleurs.
- Ajouter une vraie navigation clavier avancée (ordre de tab, focus ring harmonisé, gestion `Esc`/fermeture pour popovers).
- Introduire des composants UI partagés pour standardiser les tailles minimales tactiles et labels ARIA.
- Ajouter des tests e2e d'accessibilité (axe-playwright/cypress-axe) pour éviter les régressions.
