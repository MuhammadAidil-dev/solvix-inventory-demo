---
type: "query"
date: "2026-11-24T12:17:44.473619+00:00"
question: "pahami arsitektur projek, kemudian rangkumkan dalam sesi chat ini"
contributor: "graphify"
outcome: "useful"
source_nodes: ["app/page.tsx", "LoginForm.tsx", "fetcher.ts", "auth.ts", "proxy.ts", "StatusCard.tsx"]
---

# Q: pahami arsitektur projek, kemudian rangkumkan dalam sesi chat ini

## Answer

Expanded from graph vocabulary: [app, auth, api, fetcher, hooks, login, page, proxy, request, service, state, status]. This repo is a Next.js App Router frontend template. Routes in app compose feature modules. Auth and status features use components, hooks, schemas, and services. Services call shared lib/fetcher.ts. NEXT_PUBLIC_API_URL points to the backend. Zustand stores the in-memory access token; refresh uses an httpOnly cookie. proxy.ts guards /dashboard by cookie presence. Current routes are / and /login; no dashboard page exists. apiAuth supports one refresh and retry, but current feature services use apiPublic. The API contract and scripts are documented in README.md and package.json.

## Outcome

- Signal: useful

## Source Nodes

- app/page.tsx
- LoginForm.tsx
- fetcher.ts
- auth.ts
- proxy.ts
- StatusCard.tsx