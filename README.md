# Urfa Grill Web App

A responsive restaurant ordering demo built with React, TypeScript, Redux Toolkit, React Router, and Vite.

## What works

- Responsive home page and mobile navigation
- Filterable German menu
- Product detail pages
- Add-to-cart flow with quantity controls and calculated totals
- Cart persistence in local storage
- Validated demo checkout with a clear no-payment notice
- Hash-based routing compatible with GitHub Pages
- Automated type checking, unit tests, production build, and Pages deployment

## Run locally

Requirements: Node.js 20.19 or newer.

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`.

## Verify

```bash
npm test
npm run build
```

The production bundle is written to `dist/`. GitHub Actions builds and deploys this directory automatically after changes reach `main`.

## Architecture

The deployable application lives at the repository root:

- `src/data` – local demo menu data
- `src/components` – reusable layout and product UI
- `src/features` – Redux product and cart state
- `src/pages` – route-level views
- `.github/workflows/pages.yml` – the only active Pages deployment workflow

The `backend/`, `frontend/`, and `urfa-next-app/` directories are earlier experiments and are not part of the current GitHub Pages build. A production ordering system would connect the root frontend to an authenticated API, database, real restaurant data, and a payment provider.
