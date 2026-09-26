# Urfa Grill Web App

A restaurant web application for exploring the menu, configuring dishes, managing a basket, placing pickup orders and booking tables. The repository includes a React storefront and an Express API with restaurant administration.

**[Live demo](https://manueldinisjunior.github.io/urfa-web-app/)** · **[Repository](https://github.com/manueldinisjunior/urfa-web-app)** · **[Developer](https://manueldinisjunior.de/)**

> The GitHub Pages deployment is a demonstration storefront. It does not accept real orders, process payments or run the backend. Operational features require a separately configured API and database.

## Contents

- [Application capabilities](#application-capabilities)
- [Technology stack](#technology-stack)
- [Architecture](#architecture)
- [Getting started](#getting-started)
- [Configuration](#configuration)
- [Using the application](#using-the-application)
- [Development commands](#development-commands)
- [Project structure](#project-structure)
- [Content and design guidelines](#content-and-design-guidelines)
- [Testing and quality checks](#testing-and-quality-checks)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## Application capabilities

| Area | Implemented functionality | Runtime |
| --- | --- | --- |
| Storefront | Product categories, search, product details, options and extras | Demo and full stack |
| Basket | Add, remove and adjust products; browser persistence | Demo and full stack |
| Orders | Pickup checkout, server-side validation, tracking and administration | Backend required for submission and management |
| Reservations | Availability, table bookings and cancellation | Backend required |
| Customer area | Account-related features, favourites and carts | Backend required |
| Administration | Products, orders, reservations, settings and dashboard | Authenticated backend required |
| Notifications | Configurable email and opt-in SMS | Backend and provider credentials required |
| Languages | German, English, Turkish and Portuguese; Mozambique flag for Portuguese | Automatic translation requires Google connectivity |

Online payment processing is **not implemented**. A payment method displayed by the application must not be interpreted as an integrated payment gateway.

## Technology stack

| Layer | Technologies |
| --- | --- |
| Interface | React 18, TypeScript, Vite 8 |
| Routing and state | React Router 5 with hash routes, Redux Toolkit, React Redux |
| Presentation | CSS, SVG, Phosphor icons, Inter and JetBrains Mono |
| API | Node.js, Express 5, Zod, JOSE, Helmet |
| Persistence | PostgreSQL; PGlite for local development |
| Dates and notifications | Luxon, Nodemailer; optional Twilio configuration |
| API reference | OpenAPI and Swagger UI |
| Verification | TypeScript, Vitest, Node test runner, Supertest |
| Delivery | GitHub Actions and GitHub Pages |

Dependency versions are pinned by [package-lock.json](package-lock.json). Available scripts are defined in [package.json](package.json).

## Architecture

The frontend runs in two modes, selected at build time:

- **Demo mode:** uses the bundled catalog in `src/data/catalog.json`. GitHub Pages serves the compiled HTML, JavaScript, CSS and assets. Backend-dependent journeys display their demo limitations.
- **Full-stack mode:** the frontend calls `/api`. Express validates requests, applies business rules and persists operational data in PostgreSQL. Local development can use persistent PGlite without a database server.

Vite proxies `/api` to `http://127.0.0.1:4000` during development. For server hosting, Express also serves the built `dist` directory. Prices and operational validation belong on the server; browser state is not a trusted source for order totals.

Hash routing supports direct navigation on GitHub Pages without server rewrite rules. The production frontend build uses the `/urfa-web-app/` base path; the server build uses `/`.

### API reference

With the API running locally:

| Resource | URL |
| --- | --- |
| Health check | `http://localhost:4000/api/health` |
| Interactive documentation | `http://localhost:4000/api/docs` |
| OpenAPI specification | `http://localhost:4000/api/openapi.json` |

See [server/app.mjs](server/app.mjs), [server/customers.mjs](server/customers.mjs) and [server/validation.mjs](server/validation.mjs) for implemented routes and validation. The frontend API client sends credentials, JSON content headers and `X-Urfa-Request: 1`. Mutations also require an allowed Origin.

## Getting started

### Prerequisites

- Git and npm.
- Node.js **22.12+ within the Node 22 release line**, matching the CI runtime.
- PostgreSQL for production; optional for local development.

### Install

```sh
git clone https://github.com/manueldinisjunior/urfa-web-app.git
cd urfa-web-app
npm ci
cp .env.example .env
```

On Windows PowerShell, use `Copy-Item .env.example .env` instead of `cp`.

Replace the sample `JWT_SECRET` with a private random value of at least 32 characters. Keep `DATABASE_URL` unset for local PGlite, or point it to a development PostgreSQL database.

### Start the full-stack application

```sh
npm run dev
```

Open **http://localhost:3000**. The development script applies migrations, inserts missing seed products, then starts Vite and the API. PGlite stores local data in `.local-db` by default.

To run database initialization separately:

```sh
npm run db:setup -- --seed
```

Seeding inserts missing products; it does not overwrite existing product edits.

### Start only the demo frontend

Set `VITE_DEMO_MODE=true` in `.env`, then run:

```sh
npx vite
```

This mode does not require a database or API. Restart Vite after changing environment variables.

### Create a local administrator

Set `ADMIN_EMAIL` and a unique `ADMIN_PASSWORD` of at least 12 characters in `.env`, then run:

```sh
npm run db:setup -- --admin
```

Remove `ADMIN_PASSWORD` from `.env` afterward. Open **http://localhost:3000/#/admin** and sign in. Configure opening hours, tables, capacity and lead time before accepting orders. The initial configuration is paused with all weekdays closed.

Running `--admin` again can reset the existing administrator password and revoke its sessions. Use it intentionally.

## Configuration

Start from [.env.example](.env.example). Never commit `.env` or real credentials.

| Variable | Purpose |
| --- | --- |
| `NODE_ENV` | Runtime mode; use `production` for the deployed API |
| `PORT` | API port; defaults to `4000` |
| `DATABASE_URL` | PostgreSQL connection string; required in production |
| `LOCAL_DATABASE_PATH` | Optional local PGlite directory; defaults to `./.local-db` |
| `JWT_SECRET` | Stable, private authentication secret; at least 32 characters in production |
| `PUBLIC_URL` | Public application origin used by the backend |
| `ALLOWED_ORIGINS` | Comma-separated allowed frontend origins |
| `VITE_API_URL` | Browser API base path; defaults to `/api` |
| `VITE_DEMO_MODE` | `true` for the static demonstration storefront |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Administrator setup credentials |
| `SMTP_URL`, `MAIL_FROM` | Enable email delivery when both are configured |
| `ADMIN_NOTIFICATION_EMAIL` | Recipient for administrator notifications |
| `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM` | Optional SMS provider settings |
| `TEST_DATABASE_URL` | Disposable PostgreSQL database for API tests |

`VITE_` values are embedded in the frontend bundle and must never contain secrets. Changing them on a deployed static site requires rebuilding.

## Using the application

### Customers

1. Open **Speisekarte** and search or select a category.
2. Open a dish and review its description, available options and extras.
3. Add it to the basket and adjust quantities as needed.
4. Continue to checkout and provide the required customer and pickup information.
5. In full-stack mode, use the available order tracking and reservation flows.

Product images are example illustrations. Product descriptions and selected options determine the requested dish.

### Navigation

The homepage has six independent sections, in this order:

1. Welcome / hero.
2. Restaurant favourites.
3. Urfa on TikTok.
4. Service information.
5. Turkish cuisine gallery.
6. Location and contact information.

The side navigation links to each section and marks the current section. The service entrance waits for scrolling to settle and resets after leaving the viewport. Reduced-motion preferences disable the decorative animation.

### Languages and external media

The header selector provides German, English, Turkish and Portuguese. Non-German selections load Google Translate on demand and store the preference under `urfa-language` in local storage. The custom menu replaces the visible translation toolbar. Returning to German clears the translation cookie and reloads the application.

Most content is machine translated and may need editorial review. The restaurant-favourites heading has explicit translations to keep “restaurant” singular. Translation availability depends on Google and browser/network settings.

TikTok embeds load only after the visitor activates a video. Translation and activated embeds establish connections to their respective external providers.

## Development commands

| Command | Purpose |
| --- | --- |
| `npm ci` | Install dependencies from the lockfile |
| `npm run dev` | Initialize local data and start frontend plus API |
| `npm run server` | Start the API and serve an existing `dist` build |
| `npm run db:setup` | Apply database initialization and migrations |
| `npm run typecheck` | Check TypeScript without generating output |
| `npm test` | Run frontend tests |
| `npm run test:api` | Run backend tests |
| `npm run test:all` | Run both test suites |
| `npm run build` | Type-check and build for GitHub Pages |
| `npm run build:server` | Type-check and build for same-origin server hosting |
| `npm run preview` | Preview an existing frontend build |
| `npm run format` | Format frontend and server source |

## Project structure

| Path | Responsibility |
| --- | --- |
| `src/App.tsx` | Application shell and routes |
| `src/pages/` | Storefront and informational pages |
| `src/components/` | Shared layout, language and product components |
| `src/features/` | Cart, checkout, customer, reservation and administration features |
| `src/hooks/` | Catalog and resource-loading hooks |
| `src/store.ts` | Redux store and basket persistence |
| `src/data/` | Bundled catalog and branded image mapping |
| `src/styles/` | Shared layout, branding and responsive styling |
| `src/utils/` | API, asset, price, cart and scheduling utilities |
| `public/assets/` | Public images, flags and static assets |
| `server/` | API, authentication, validation and notification handling |
| `server/migrations/` | SQL migration files; migration orchestration is in `server/db.mjs` |
| `server/seed-products.json` | Backend product seed data |
| `server/tests/` | Backend test suites |
| `scripts/` | Development and catalog utilities |
| `.github/workflows/` | CI verification and Pages deployment |

## Content and design guidelines

### Catalog maintenance

Keep names, prices, ingredients, options and availability grounded in approved menu information. Update the bundled catalog and backend seed data consistently. Existing database products must be updated through the operational workflow; rerunning seed initialization does not replace them.

### Product photography

- Use supplied or otherwise authorized images and preserve the represented food.
- Standard presentation: white ceramic dish, thin double dark-green rim, tiny decorative detail, white background, warm soft light and a subtle shadow.
- Keep the whole dish visible at a consistent scale. Packaging such as a fries carton does not require a plate.
- Export square **768 × 768 WebP** assets, strictly below **35,000 bytes** each. Inspect the compressed result for clarity and cropping.
- Store assets in `public/assets/` and map the exact catalog product name in `src/data/branded-product-photos.json`.
- Use a new filename when replacing an image to avoid stale cached content.
- Reuse `ProductPhoto` and retain its alternative text and example-image disclosure.

### Interface and accessibility

Reuse established components and styling. Preserve responsive layouts, keyboard navigation, visible focus indicators, semantic headings and reduced-motion support. Scope decorative motion to the relevant section and keep controls usable during transitions.

## Testing and quality checks

Before publishing a functional change:

```sh
npm run test:all
npm run build
```

The server build is also checked in CI. Frontend tests use Vitest; API tests use the Node test runner and Supertest. CI runs backend verification against PostgreSQL 17. Local API tests also support PGlite.

**Use a disposable database for tests, never a production database.** Add meaningful coverage for changed business rules and user behaviour. A successful build alone does not verify external translation, email, SMS or the complete customer journey.

For interface changes, also verify the affected route, mobile layout, keyboard interaction and relevant language state in the browser.

## Deployment

### GitHub Pages — current public demo

[pages.yml](.github/workflows/pages.yml) runs on pushes to `main` or manual dispatch. It installs dependencies, runs both test suites, builds with `VITE_DEMO_MODE=true`, uploads `dist` and deploys to GitHub Pages.

Select **GitHub Actions** as the Pages source in repository settings. Keep the repository base path in [vite.config.ts](vite.config.ts) aligned with the repository name. After publishing, check the workflow result and verify the affected public page.

### Full-stack hosting reference

The API requires a Node.js host and PostgreSQL; GitHub Pages cannot run them. Configure `NODE_ENV=production`, `DATABASE_URL`, a stable `JWT_SECRET`, `PUBLIC_URL` and `ALLOWED_ORIGINS` for that environment.

Build with demo mode disabled:

```sh
npm run build:server
npm run db:setup -- --seed
npm run server
```

Serve the frontend and `/api` through one HTTPS origin so secure cookies work correctly. Provision the administrator separately, maintain database backups and configure notification providers if needed. This section documents backend operation; the current public demo remains on GitHub Pages.

## Troubleshooting

| Symptom | Check |
| --- | --- |
| Backend features unavailable on Pages | This is expected in demo mode; use the full-stack runtime for operational flows |
| `/api` requests fail locally | Ensure the API is running on port `4000` and `VITE_API_URL` is `/api` |
| Request rejected because of Origin | Match the frontend origin exactly in `ALLOWED_ORIGINS` |
| No pickup times or order acceptance paused | Review opening hours, capacity, lead time and acceptance settings in administration |
| Local administrator cannot sign in | Confirm the configured database and that administrator setup was completed |
| Translation does not load | Check access to Google; the language menu provides an error and retry path |
| Old image still displayed | Confirm the exact product-name mapping, deployed filename and browser cache |
| Assets fail after deployment | Check the build mode and repository base path |
| Email or SMS not delivered | Verify provider credentials and notification configuration; inspect backend errors without exposing private tokens |

## Contributing

Keep each change focused. Describe the problem, resulting behaviour and verification in the commit or pull request. Update this documentation when commands, configuration or user flows change. Preserve the lockfile when updating dependencies.

Do not commit secrets, customer data, private tracking links, local databases or generated build output. Keep trusted pricing, permissions and validation on the server. Image-only changes should not alter prices, ingredients or hosting configuration.

## Author and licensing

Developed by **Manuel Dinis Júnior** — [manueldinisjunior.de](https://manueldinisjunior.de/).

The package declares the **MIT** license. Third-party assets retain their own licensing requirements; flag SVGs are from flag-icons under [their included MIT license](public/assets/flags/LICENSE). Verify rights separately before reusing restaurant branding or photography.
