# Site Kakushin Kaï

Site vitrine responsive en HTML, CSS et JavaScript.

## Lancer
Ouvrez `index.html` dans un navigateur, ou utilisez VS Code avec Live Server.

## À personnaliser avant mise en ligne
- Les liens Spotify et Apple Podcasts sont configurés.
- Remplacer `contact@kakushinkai.fr` par l'adresse réelle.
- Connecter la newsletter à Brevo ou Mailchimp.
- Connecter le formulaire à Formspree, Netlify Forms ou un backend.
- Remplacer les cartes de galerie par les vrais liens de publications.

Le visuel principal a été généré avec Microsoft Copilot.

## Mise à jour automatique des épisodes
La section « Derniers épisodes » lit le flux RSS Spotify for Creators à chaque ouverture du site via RSS2JSON. Les trois épisodes les plus récents sont triés par date et affichés automatiquement. En cas d’indisponibilité du service, un bouton de secours renvoie vers Spotify.

## Lecteur intégré
Chaque épisode possède un lecteur HTML5 alimenté par l’URL audio présente dans le flux RSS. Une seule piste peut jouer à la fois. Si une URL audio manque, un bouton ouvre la page de l’épisode.
