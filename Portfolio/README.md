# Portfolio

Site statique - HTML / CSS / JavaScript, sans dépendance ni compilation.
Ouvre `index.html` dans un navigateur, c'est tout.

## Structure

```
Portfolio/
├── index.html        Accueil : animation d'arrivée + pop-ups CV et compétences
├── parcours.html     Formations, diplômes, certifications
├── stages.html       Stages et expériences professionnelles
├── projets.html      Réalisations
├── assets/
│   ├── css/style.css Toute la mise en forme (variables de couleur en haut)
│   ├── js/main.js    Intro, menu mobile, pop-ups, onglets, apparitions
│   ├── cv/           ← dépose ici `cv.pdf`
│   ├── img/          ← visuels des projets
│   └── docs/         ← rapports de stage, attestations
└── README.md
```

## Par quoi commencer

1. ~~**Ton identité**~~ - fait : nom, titres d'onglets, écran d'intro, logo et pied de page
   affichent « Raphaël Bierlaire ».
2. ~~**Le contact**~~ - fait : e-mail, GitHub (`Waaallyy`) et LinkedIn sont branchés
   dans le pied de page des 4 pages.
3. ~~**Parcours et stages**~~ - fait : bac 2024 mention Bien, césure 2024-2025,
   BTS SIO SLAM 2025-2027, stage Groupe Open 2026. Les pages sont remplies.
4. ~~**Le CV PDF**~~ - fait : `assets/cv/cv.pdf` est en place et s'affiche dans la
   pop-up. Pour le mettre à jour, écrase simplement ce fichier.
   L'onglet « Version web » reprend les mêmes informations, **sans le numéro de
   téléphone ni la date de naissance** (à ne pas exposer sur une page publique).
5. **Les compétences** - pop-up « Tableau de compétences » dans `index.html`.
   Les **6 blocs et 21 sous-compétences** du référentiel BTS SIO sont en place.
   Pour chacune :
   - le niveau se règle sur `<td class="level">` : `data-level="0"` (vide) à `"5"` ;
   - un clic sur l'intitulé déplie un panneau **Situation + liens de preuve** ;
   - un lien se duplique en copiant un `<a class="proof__link">` et peut pointer
     vers un projet, un dépôt GitHub, une page du site ou un PDF de `assets/docs/`.
6. **Les projets** - [projets.html](projets.html) est vide, tu t'en occupes.
   Le modèle de carte est en commentaire dans le fichier : remplace le bloc
   `.empty-state` par la grille, puis duplique l'`<article class="card">`.
7. ~~**À préciser**~~ - fait : stage Open du 15 mars au 23 avril 2026, anglais B2 validé.

Chaque bloc à dupliquer est signalé par un commentaire `▼▼ MODÈLE ▼▼` dans le HTML.

## Repères techniques

| Élément | Où |
| --- | --- |
| Couleurs | `assets/css/style.css`, bloc `:root` en haut |
| Durée de l'animation d'intro | `assets/js/main.js`, constante `MIN_DUREE` |
| Ajouter une page | copie `projets.html`, change le contenu, ajoute le lien dans le `<nav>` des 4 pages |

L'intro ne joue qu'une fois par session de navigation (mémorisée dans
`sessionStorage`). Pour la revoir : ouvre un nouvel onglet, ou vide le stockage
de session.

## Palette

| Nom | Rôle | Code |
| --- | --- | --- |
| Marsh Green | fonds, du plus sombre au plus clair | `#192115` → `#4E6241` |
| In the Limelight | textes | `#F6F8EC` → `#A9B681` |
| Darling Clementine | accent, liens, niveaux | `#EE7B3C` |

## Mise en ligne

Le site étant 100 % statique, tu peux l'héberger tel quel sur **GitHub Pages**,
**Netlify** ou **Vercel** : dépose le dossier, aucune configuration n'est requise.
