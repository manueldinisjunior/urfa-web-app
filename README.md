# Urfa Grill Web App

A responsive restaurant ordering demo built with React, TypeScript, Redux Toolkit, React Router, and Vite.

## What works

- Kasushi-inspired responsive editorial design with local food imagery
- Complete home, menu, about, contact, careers, product, and cart pages
- Mobile navigation plus global search and category filters
- Product detail pages
- Add-to-cart flow with quantity controls and calculated totals
- Cart persistence in local storage
- Validated demo checkout with a clear no-payment notice
- Restaurant contact links and a local-only careers form
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
- `src/features` – Redux cart state
- `src/pages` – route-level views
- `.github/workflows/pages.yml` – the only active Pages deployment workflow


## Author

Website developed by **Manuel Dinis Júnior** — https://manueldinisjunior.de/

## Ordering

Product options and extras are demo data. Checkout validates locally; it does not transmit orders or payments. Restaurant contact details and social links were supplied by the owner of this project.
