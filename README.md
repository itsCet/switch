# Switch

Le compagnon du social media manager multi-clients. Un seul tap pour basculer entre tes espaces client sans perdre le fil.

## Fonctionnalites

- **Vue "espace" par entreprise** - theme et ton propres a chaque marque (GTP : institutionnel/sportif, Fourteen : mode/"Passion Is Always Right"). Le switch recharge automatiquement le dernier post en brouillon et la prochaine echeance.
- **Calendrier fusionne + filtre** - une vue combinee qui detecte les conflits (ex. match le meme jour qu'un shooting), et une vue filtree par entreprise.
- **Checklist de publication** - verifications rapides par marque avant de poster (hashtag officiel, mention obligatoire, ton respecte) pour ne pas se planter en changeant de contexte.
- **Journal de contexte** - un post-it numerique par entreprise pour reprendre le fil en 10 secondes apres un switch.
- **Rappels de planning de split** - lundi-mardi GTP, mercredi les deux, jeudi-vendredi Fourteen, avec une notif "tu passes chez X demain".

- **Compte** - connexion par email/mot de passe (Supabase Auth). Les donnees sont liees a ton compte et se retrouvent identiques sur n'importe quel appareil.

## Stack

Next.js (App Router) + TypeScript + Tailwind CSS + Supabase (auth + Postgres).

## Configuration Supabase

1. Cree un projet sur [supabase.com/dashboard](https://supabase.com/dashboard).
2. Dans le **SQL Editor**, execute le contenu de [`supabase/schema.sql`](supabase/schema.sql) (cree la table `app_state` avec RLS).
3. Dans **Project Settings > API Keys**, recupere l'URL du projet et la cle `anon` / `publishable`.
4. Cree un fichier `.env.local` a la racine :

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_xxxxx
```

5. Ajoute les memes deux variables dans **Vercel > Project Settings > Environment Variables** pour que le deploiement fonctionne.

## Developpement

```bash
npm install
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000).

## Deploiement

Importe le repo sur [vercel.com/new](https://vercel.com/new), puis renseigne les deux variables d'environnement Supabase (voir ci-dessus) avant le premier deploiement.
