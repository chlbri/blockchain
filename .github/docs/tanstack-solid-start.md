# TanStack Solid Start

## Vue d'ensemble

TanStack Solid Start est un framework full-stack moderne construit sur
SolidJS, offrant une expérience de développement exceptionnelle avec un
routage basé sur les fichiers, un rendu côté serveur optimisé, et une
architecture prête pour la production.

## Caractéristiques principales

### Framework full-stack

- **Frontend** : SolidJS pour l'interface utilisateur réactive
- **Backend** : API routes intégrées
- **Base de données** : Support des bases de données populaires
- **Déploiement** : Optimisé pour Vercel, Netlify, et autres plateformes

### Routage basé sur les fichiers

- Structure de routes définie par les fichiers
- Routes API automatiques
- Support des routes dynamiques et imbriquées

### Rendu optimisé

- **SSR/SSG** : Server-Side Rendering et Static Site Generation
- **Streaming** : Rendu progressif pour de meilleures performances
- **Islands Architecture** : Hydratation sélective des composants

## Structure de projet

```
my-app/
├── src/
│   ├── routes/
│   │   ├── index.tsx          # Page d'accueil
│   │   ├── about.tsx          # Page À propos
│   │   ├── api/
│   │   │   └── users.ts       # Route API
│   │   └── users/
│   │       ├── index.tsx      # Liste des utilisateurs
│   │       └── [id].tsx       # Profil utilisateur
│   ├── components/
│   ├── lib/
│   └── root.tsx               # Layout racine
├── app.config.ts              # Configuration
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## Création d'un projet

```bash
# Créer un nouveau projet
npm create solid@latest my-app
# ou avec pnpm
pnpm create solid my-app

# Sélectionner "solid-start" comme template
```

## Pages et routes

### Page simple

```tsx
// src/routes/index.tsx
export default function Home() {
  return (
    <main>
      <h1>Bienvenue sur Solid Start</h1>
      <p>Framework full-stack moderne</p>
    </main>
  );
}
```

### Page avec données

```tsx
// src/routes/users/[id].tsx
import { createAsync } from '@solidjs/router';

export default function UserProfile() {
  const user = createAsync(async () => {
    const response = await fetch(`/api/users/${params.id}`);
    return response.json();
  });

  return (
    <div>
      <h1>{user()?.name}</h1>
      <p>{user()?.email}</p>
    </div>
  );
}
```

## Routes API

### Route API simple

```typescript
// src/routes/api/users.ts
import { json } from 'solid-start/server';

export async function GET() {
  const users = await db.users.findMany();
  return json(users);
}

export async function POST({ request }) {
  const data = await request.json();
  const user = await db.users.create({ data });
  return json(user);
}
```

### Route API avec paramètres

```typescript
// src/routes/api/users/[id].ts
import { json } from 'solid-start/server';

export async function GET({ params }) {
  const user = await db.users.findUnique({
    where: { id: params.id },
  });
  return json(user);
}

export async function PUT({ params, request }) {
  const data = await request.json();
  const user = await db.users.update({
    where: { id: params.id },
    data,
  });
  return json(user);
}
```

## Gestion d'état

### Signaux locaux

```tsx
import { createSignal } from 'solid-js';

function Counter() {
  const [count, setCount] = createSignal(0);

  return (
    <button onClick={() => setCount(count() + 1)}>Count: {count()}</button>
  );
}
```

### État global avec stores

```tsx
// src/lib/store.ts
import { createStore } from 'solid-js/store';

export const [appState, setAppState] = createStore({
  user: null,
  theme: 'light',
});
```

## Base de données

### Configuration Prisma

```typescript
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
}
```

### Utilisation dans les routes

```typescript
// src/routes/api/users.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const users = await prisma.user.findMany();
  return json(users);
}
```

## Authentification

### Middleware d'authentification

```typescript
// src/middleware.ts
import { createMiddleware } from 'solid-start/middleware';

export default createMiddleware({
  onRequest: async event => {
    const session = await getSession(event.request);
    event.locals.session = session;
  },
});
```

### Protection des routes

```tsx
// src/routes/dashboard.tsx
import { redirect } from 'solid-start/server';

export async function routeData() {
  const session = await getSession(request);

  if (!session) {
    throw redirect('/login');
  }

  return { user: session.user };
}
```

## Déploiement

### Configuration pour Vercel

```typescript
// app.config.ts
import { defineConfig } from 'solid-start/config';

export default defineConfig({
  adapter: 'solid-start-vercel',
});
```

### Build et déploiement

```bash
# Build pour la production
npm run build

# Déploiement
npm run deploy
```

## Fonctionnalités avancées

### Streaming SSR

```tsx
// Permet le rendu progressif
export default function StreamingPage() {
  const data = createAsync(async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { message: 'Données chargées' };
  });

  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <div>{data()?.message}</div>
    </Suspense>
  );
}
```

### Islands Architecture

```tsx
// Composants hydratés sélectivement
import { island } from 'solid-start/island';

const InteractiveComponent = island(() => {
  const [count, setCount] = createSignal(0);

  return <button onClick={() => setCount(count() + 1)}>{count()}</button>;
});
```

## Avantages

1. **Performance** : SSR optimisé et hydratation intelligente
2. **DX exceptionnelle** : Hot reload et TypeScript complet
3. **Full-stack** : Frontend et backend dans un seul projet
4. **Évolutif** : Architecture prête pour la production
5. **Moderne** : Technologies et patterns à jour

## Écosystème

- **SolidJS** : Bibliothèque de base réactive
- **TanStack Router** : Routage avancé
- **TanStack Query** : Gestion des données serveur
- **Prisma** : ORM de base de données
- **Tailwind CSS** : Framework CSS

## Ressources

- [Documentation officielle](https://start.solidjs.com/)
- [Guide de démarrage](https://docs.solidjs.com/solid-start)
- [Exemples](https://github.com/solidjs/solid-start/tree/main/examples)
- [GitHub](https://github.com/solidjs/solid-start)
