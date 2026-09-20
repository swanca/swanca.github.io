# Portail de projets swanca — conception

Date : 20 septembre 2026

## Objectif

Créer un portail public bilingue pour présenter les projets web de Swan Carenini et donner accès à ses dépôts GitHub publics. Le site sera publié gratuitement à l’adresse `https://swanca.github.io`.

## Contenu

La page d’accueil présente quatre projets :

- Plus en Poche — service d’estimation de droits et d’économies, en ligne sur `https://plusenpoche.fr`.
- Steffi Couture — site de couturière à domicile, en ligne sur `https://stefficouture.fr`.
- AOclair — outil consacré aux appels d’offres, en ligne sur `https://aoclair.fr`.
- TrackMyDex — suivi de collection de cartes, affiché comme « bientôt disponible » sans lien actif tant que le domaine n’est pas déployé.

Chaque projet utilise une capture réalisée depuis le site réel. TrackMyDex utilise un aperçu produit préparé à partir de son identité locale. Les captures servent de contenu et non de décoration.

Une seconde page, « Dépôts / Repositories », affiche les dépôts publics du compte GitHub `swanca`. Elle interroge l’API publique GitHub dans le navigateur, trie les dépôts par dernière mise à jour et montre le nom, la description, le langage principal, les étoiles et le lien GitHub. Un message clair reste visible si GitHub est momentanément indisponible.

## Identité et navigation

L’en-tête affiche « swanca », les liens « Projets / Projects » et « Dépôts / Repositories », un bouton GitHub, un bouton LinkedIn et le sélecteur FR/EN.

Le lien GitHub pointe vers `https://github.com/swanca`. Le lien LinkedIn pointe vers `https://www.linkedin.com/in/swan-c-35044b11a/`.

## Langues

Le français et l’anglais sont présents dans le même site statique. Au premier chargement, le navigateur choisit l’anglais lorsque sa langue commence par `en`, sinon le français. Le choix manuel est mémorisé dans `localStorage`. Tous les titres, descriptions, libellés, états et métadonnées principales ont leur traduction.

## Direction visuelle

Le portail adopte une galerie éditoriale inspirée d’un atelier de produits numériques :

- fond clair légèrement bleuté `#F4F7FB`;
- encre `#10233F`;
- bleu de structure `#2457D6`;
- bleu pâle `#DCE8FF`;
- jaune de repère `#F4C95D`;
- blanc `#FFFFFF`.

La typographie est nette et technique, avec une fonte sans serif variable chargée localement ou une pile système robuste. Le signe distinctif est la grande pile de fenêtres de navigateur présentant les vrais sites. Les autres éléments restent sobres : peu de rayons, aucune succession de petites cartes identiques, aucune animation décorative continue.

Sur ordinateur, les projets alternent texte et capture. Sur mobile, chaque capture précède le texte et occupe toute la largeur. Une seule apparition légère au chargement est autorisée et disparaît avec `prefers-reduced-motion`.

## Architecture

Le site reste volontairement statique :

- `index.html` pour les projets ;
- `repos/index.html` pour les dépôts ;
- `assets/css/styles.css` pour la présentation ;
- `assets/js/site.js` pour la langue et la navigation ;
- `assets/js/repos.js` pour l’API GitHub ;
- `assets/images/` pour les captures optimisées ;
- `.nojekyll` pour une publication directe ;
- `404.html`, `robots.txt` et `sitemap.xml`.

Aucun framework, serveur, cookie publicitaire, formulaire ou outil de suivi n’est nécessaire.

## Accessibilité et qualité

Le site respecte la navigation clavier, les contrastes, les titres structurés, les textes alternatifs, les états de chargement et `prefers-reduced-motion`. Les liens externes sont identifiables et ouvrent sans piège de navigation.

Les vérifications couvrent :

- validité des liens et des métadonnées ;
- présence des traductions FR et EN ;
- bascule et mémorisation de langue ;
- affichage de secours de la page des dépôts ;
- rendu mobile et ordinateur ;
- absence de débordement horizontal ;
- poids raisonnable des captures ;
- publication réelle sur `swanca.github.io`.

## Publication

Le dépôt public sera `swanca/swanca.github.io`, branche `main`. GitHub Pages publiera la racine du dépôt. Une fois en ligne, le portail conservera son adresse gratuite `https://swanca.github.io`.
