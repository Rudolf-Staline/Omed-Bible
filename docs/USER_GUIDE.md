# Guide utilisateur — Omed Scripture

## 1. Présentation

Omed Scripture est une application de lecture, d’étude et d’organisation biblique. Elle permet de lire différents livres et chapitres, de changer de traduction, de comparer deux traductions, d’écouter l’audio, d’ajouter des notes, de sauvegarder des passages, de créer des collections et de suivre des parcours de lecture.

## 2. Accueil

La page d’accueil présente deux éléments principaux :

- la reprise de lecture, avec le dernier livre, chapitre et traduction utilisés ;
- le verset du jour, choisi de manière déterministe selon la date.

Le verset du jour peut être copié, ouvert dans son chapitre ou ajouté aux marque-pages.

## 3. Lire un chapitre

Depuis la page de lecture, choisissez une traduction, un livre et un chapitre. Le texte s’affiche dans une vue conçue pour la lecture prolongée.

Le mode Lecture privilégie la fluidité. Le mode Étude ajoute plus d’espace et rend les versets plus faciles à examiner lentement.

## 4. Changer de traduction

Utilisez le sélecteur de traduction dans l’en-tête du lecteur ou dans les préférences.

Les traductions visibles dans l’application sont uniquement celles réellement configurées :

- Louis Segond 1910 ;
- Darby Français ;
- King James Version ;
- World English Bible ;
- Bible in Basic English ;
- NIV seulement si la clé API.Bible est configurée.

Certaines traductions peuvent être lisibles sans supporter la recherche textuelle.

## 5. Comparer deux traductions

Activez l’option de comparaison depuis le lecteur. Sur grand écran, deux colonnes apparaissent. Sur mobile ou petit écran, la comparaison s’empile pour éviter une interface cassée.

## 6. Écouter l’audio

Le bouton audio ouvre le lecteur vocal du chapitre courant. La lecture utilise la synthèse vocale disponible dans le navigateur. La qualité et les voix dépendent de l’appareil.

## 7. Rechercher un passage

La page Recherche permet de chercher un mot ou une expression dans la traduction par défaut.

La recherche conserve localement les dernières requêtes. Vous pouvez relancer une recherche depuis l’historique ou effacer cet historique.

Si la traduction choisie ne supporte pas la recherche, l’application affiche un message clair au lieu d’utiliser une autre traduction en silence.

## 8. Sauvegarder un passage

Sélectionnez un verset puis utilisez l’action de marque-page. Le passage est conservé dans la section Marque-pages.

## 9. Collections de versets

La section Collections permet de regrouper des passages par thème : Foi, Prière, Sagesse, Consolation, Combat intérieur, Espérance, Repentance ou Gratitude.

La première version des collections stocke les données localement. Les collections sont incluses dans l’export local et préparées pour la synchronisation Drive, mais la restauration automatique complète reste à finaliser.

## 10. Ajouter une note

Sélectionnez un verset puis ouvrez l’action de note. Les notes sont liées aux versets et peuvent être retrouvées dans la section Notes.

## 11. Surligner un verset

Sélectionnez un verset puis choisissez une couleur de surlignage. Les surlignages servent à repérer rapidement des passages importants.

## 12. Utiliser les parcours de lecture

La section Parcours permet de suivre une progression structurée. Chaque parcours affiche les étapes déjà complétées et celles restantes.

## 13. Synchroniser avec Google Drive

Connectez-vous avec Google pour synchroniser les données personnelles via Google Drive AppData. Les données restent associées au compte Google utilisé pour la connexion.

États possibles :

- non connecté ;
- connecté mais non synchronisé ;
- synchronisation en cours ;
- synchronisé ;
- erreur de synchronisation.

L’application reste utilisable localement sans compte Google.

## 14. Cache hors ligne

Les chapitres récemment consultés peuvent être relus hors ligne. Ce cache est volontairement limité : l’application ne télécharge pas toute la Bible.

## 15. Limites actuelles

- Certaines traductions nécessitent une clé API.
- La disponibilité de l’audio dépend du navigateur et des voix installées.
- La recherche n’est pas disponible pour toutes les traductions.
- La restauration automatique complète des collections depuis Drive reste à finaliser.
- Le token Google doit encore être durci dans une passe de sécurité dédiée.

## 16. Résolution de problèmes courants

Si une traduction ne charge pas, vérifiez la connexion internet et la configuration des variables d’environnement.

Si la synchronisation ne fonctionne pas, reconnectez-vous avec Google, vérifiez que la synchronisation est activée dans les préférences, puis relancez une restauration ou une sauvegarde Drive.

Si la recherche est indisponible, choisissez une traduction compatible comme LSG, Darby, KJV ou WEB.
