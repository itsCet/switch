# Switch

Le compagnon du social media manager multi-clients. Un seul tap pour basculer entre tes espaces client sans perdre le fil.

## Fonctionnalites

- **Vue "espace" par entreprise** - theme et ton propres a chaque marque (GTP : institutionnel/sportif, Fourteen : mode/"Passion Is Always Right"). Le switch recharge automatiquement le dernier post en brouillon, la prochaine echeance et le dernier partenaire contacte.
- **Calendrier fusionne + filtre** - une vue combinee qui detecte les conflits (ex. match le meme jour qu'un shooting), et une vue filtree par entreprise.
- **Banque de contenu recurrent** - templates reutilisables par marque (carrousel stats, coverage joueur, contenu partenaire pour GTP ; contenu FIBA/Swiss Basketball pour Fourteen).
- **Journal de contexte** - un post-it numerique par entreprise pour reprendre le fil en 10 secondes apres un switch.
- **Rappels de planning de split** - lundi-mardi GTP, mercredi les deux, jeudi-vendredi Fourteen, avec une notif "tu passes chez X demain".

## Stack

Next.js (App Router) + TypeScript + Tailwind CSS. L'etat est persiste en `localStorage` (pas de backend requis pour cette version).

## Developpement

```bash
npm install
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000).

## Deploiement

Pret pour Vercel : importe le repo sur [vercel.com/new](https://vercel.com/new), aucune configuration additionnelle necessaire.
