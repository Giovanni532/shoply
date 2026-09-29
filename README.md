# Shoply

Boutique en ligne de démonstration (des lampes de poche) qui va au bout d'un vrai parcours e-commerce : catalogue, fiches techniques, panier, commande, comptes clients et adresses, en français et en anglais. Le paiement est simulé.

**[Démo en ligne](https://shoply-zeta.vercel.app)** · [Présentation dans mon portfolio](https://www.giovannisalcuni.dev/projects/shoply)

![Page d'accueil de Shoply](https://www.giovannisalcuni.dev/projets/shoply/accueil.webp)

| Fiche produit | Comparatif | Commande |
| --- | --- | --- |
| ![Fiche produit](https://www.giovannisalcuni.dev/projets/shoply/fiche-produit.webp) | ![Comparatif](https://www.giovannisalcuni.dev/projets/shoply/comparatif.webp) | ![Commande](https://www.giovannisalcuni.dev/projets/shoply/commande.webp) |

## Fonctionnalités

- **Catalogue** : gamme, fiches produits avec modes d'éclairage (éco à turbo), comparatif et explorateur de portée.
- **Panier** : persistant dans le navigateur, avec son tiroir.
- **Commande** : adresse de livraison, récapitulatif, confirmation ; paiement simulé.
- **Compte client** : inscription, connexion, profil, historique des commandes et adresses.
- **Deux langues** (next-intl) et deux thèmes, nuit par défaut et jour.

## Stack

Next.js 16 (App Router, Server Actions) · TypeScript · Tailwind CSS · Drizzle ORM · SQLite / Turso · Better-Auth · next-intl · Zod · next-safe-action · Zustand · Framer Motion

## Organisation du code

```
app/[locale]/     pages localisées (produits, panier, commande, compte)
actions/          Server Actions (commande, adresses, compte)
db/               schéma Drizzle
lib/catalog.ts    fiches techniques et géométrie des lampes, par slug de produit
components/lamp/  lampes dessinées en SVG paramétrique
store/            panier (Zustand)
i18n/             routage et messages FR / EN
scripts/seed.ts   remplit le catalogue (idempotent)
```

## Points techniques

- **Stock toujours juste** : la commande vérifie le stock dans une transaction et le décrémente de façon atomique (`WHERE stock >= quantité`). S'il a changé entre-temps, toute la commande est annulée. Voir [`actions/checkout.ts`](actions/checkout.ts).
- **Accès aux adresses** : chaque modification ou suppression vérifie que l'adresse appartient au client connecté (correction d'une faille IDOR).
- **Redirection après connexion** : le paramètre `from` ramène à la page d'origine, en refusant les redirections vers un autre site.
- **Lampes en SVG** : dans le hero, la lampe suit la souris et éclaire le titre à travers un masque.

## Démarrer en local

Prérequis : Node.js 20 ou plus.

```bash
npm install
cp .env.example .env   # puis remplir BETTER_AUTH_SECRET (openssl rand -base64 32)
npm run db:push        # crée le schéma dans la base locale (file:local.db)
npm run db:seed        # ajoute les produits
npm run dev
```

L'application tourne sur http://localhost:3000. En local, la base est un simple fichier SQLite : aucun compte Turso n'est nécessaire.

| Script | Rôle |
| --- | --- |
| `npm run dev` | serveur de développement |
| `npm run build` / `npm start` | build et serveur de production |
| `npm run lint` | ESLint |
| `npm run db:push` | applique le schéma Drizzle à la base |
| `npm run db:seed` | remplit le catalogue (sans rien supprimer) |
| `npm run db:studio` | explore la base dans Drizzle Studio |

---

Conçu et développé par [Giovanni Salcuni](https://www.giovannisalcuni.dev).
