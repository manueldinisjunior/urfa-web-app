# Urfa Grill

Restaurant menu, basket, checkout and reservation interface built with React and TypeScript.

[Open the GitHub Pages demo](https://manueldinisjunior.github.io/urfa-web-app/#/menu)

Developed by **Manuel Dinis Júnior** — https://manueldinisjunior.de/

## Technology stack

| Area | Technologies |
| --- | --- |
| Frontend | React 18, TypeScript, Vite 8, React Router 5, Redux Toolkit |
| Styling | CSS, Phosphor icons, Inter and JetBrains Mono fonts |
| API | Node.js, Express 5, Zod validation, JOSE authentication, Helmet |
| Database | PostgreSQL; persistent PGlite for local development without a database URL |
| Supporting services | Luxon for dates, Nodemailer for optional email, Swagger UI for API documentation |
| Verification | Vitest, Node test runner, Supertest, TypeScript |
| Publishing | GitHub Actions and GitHub Pages |

Exact dependency versions are recorded in `package-lock.json`.

## Using the app

1. Open **Speisekarte** and select a category.
2. Open a product, review its description and choose available options or extras.
3. Add products to the basket, then adjust quantities or remove items.
4. Continue to checkout and complete the required customer and pickup fields.

GitHub Pages runs the **demonstration storefront** with `VITE_DEMO_MODE=true`. It does not run Express or PostgreSQL and does not submit real orders. Operational ordering, reservations and administration require the backend. Product pictures are example illustrations; the menu description and selected options determine the order. Online payment processing is not implemented.

## Local setup

Use Node.js **22.12 or later within the Node 22 release line** and npm.

```sh
npm ci
cp .env.example .env
```

Edit `.env` and replace `JWT_SECRET` with a private random value of at least 32 characters. Leave `DATABASE_URL` unset to use local PGlite, or configure a development PostgreSQL database.

```sh
npm run db:setup -- --seed
npm run dev
```

Open http://localhost:3000. The development script starts Vite and the API; Vite proxies `/api` to port 4000. Local PGlite data is stored in `.local-db`.

For a frontend-only demo, set `VITE_DEMO_MODE=true` in `.env` and run `npx vite`.

### Local administration

Set `ADMIN_EMAIL` and a private `ADMIN_PASSWORD` of at least 12 characters in `.env`, then run:

```sh
npm run db:setup -- --admin
```

Remove `ADMIN_PASSWORD` from `.env` afterward. Open `/#/admin` and sign in. Configure opening hours, tables, capacity and lead time before enabling order acceptance. The initial restaurant configuration is paused with all weekdays closed. Running the admin setup again can reset the existing administrator and revoke its sessions.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start frontend and backend locally |
| `npm run server` | Start the API server |
| `npm run typecheck` | Check TypeScript |
| `npm test` | Run frontend tests |
| `npm run test:api` | Run API tests |
| `npm run test:all` | Run both test suites |
| `npm run build` | Type-check and build with the GitHub Pages base path |
| `npm run build:server` | Type-check and build for same-origin server hosting |
| `npm run preview` | Preview the built frontend locally |
| `npm run format` | Format frontend and server source |

API tests must use a disposable database, never production. CI can use `TEST_DATABASE_URL` for PostgreSQL; local tests support PGlite.

## Project structure

- `src/`: React interface, state, styles and frontend data.
- `src/data/catalog.json`: bundled storefront product catalog.
- `src/data/branded-product-photos.json`: exact product-name to image-filename mapping.
- `src/components/product/ProductPhoto.tsx`: shared product-image presentation.
- `public/assets/`: static images and other public assets.
- `server/`: API, database setup, validation and backend tests.
- `server/seed-products.json`: backend seed catalog.
- `scripts/`: development and menu-import utilities.
- `.github/workflows/`: automated checks and GitHub Pages deployment.

## Product and image guidelines

- Keep product names, prices, ingredients, options and availability source-backed. Do not infer a new dish from a similar photograph.
- Use supplied or otherwise authorized photos. Preserve the food when editing its presentation; do not invent ingredients to make a match.
- Use white ceramic dishes with thin double dark-green rims, a tiny decorative detail, white backgrounds, warm soft light and subtle shadows.
- Keep the whole dish visible and use consistent centered sizing. Packaging such as the fries carton does not need a plate.
- Export square **768 × 768 WebP** images, each strictly below **35,000 bytes**. Check the final compressed image for clarity and cropping.
- Save images in `public/assets/` and map them to the exact catalog product name in `src/data/branded-product-photos.json`. Use a new filename for replacements to avoid stale cached images.
- Use the shared `ProductPhoto` component and preserve its example-image disclosure and accessible alternative text.
- Keep catalog and backend seed changes consistent when modifying products. Seeding inserts missing products; it does not overwrite existing administrative edits.

## Development guidelines

Keep changes focused and reuse existing components. Maintain TypeScript types, keyboard access, visible focus states and responsive layouts. Keep business rules and trusted price calculations on the server. Add tests for changed behavior and run `npm run test:all` plus `npm run build` before publishing.

Never commit credentials, `.env`, private tracking links or customer data. Browser-visible `VITE_` variables must contain no secrets. Product-image updates should not change prices, descriptions or hosting configuration.

## Publishing to GitHub Pages

The workflow in `.github/workflows/pages.yml` runs on pushes to `main` and supports manual dispatch. It installs dependencies, runs both test suites, builds with `VITE_DEMO_MODE=true`, uploads `dist` and deploys to Pages.

In repository settings, select **GitHub Actions** as the Pages source. After publishing, check the workflow result and verify updated images on the live menu. Hash routes and the `/urfa-web-app/` base path support repository hosting.

## Backend reference

Backend development and operation are separate from the Pages demo. A server build requires PostgreSQL in production, `DATABASE_URL`, a stable `JWT_SECRET`, `PUBLIC_URL` and `ALLOWED_ORIGINS`. Use a single HTTPS origin for frontend and `/api` so secure cookies work correctly.

Interactive API documentation is available at `/api/docs`, with the specification at `/api/openapi.json`. Request validation is defined in `server/validation.mjs`. Mutations require JSON, an allowed Origin and `X-Urfa-Request: 1`.

Optional email delivery requires `SMTP_URL` and `MAIL_FROM`. Delivery depends on configured provider credentials; a successful frontend build does not verify email delivery. Keep private order and reservation tokens out of public logs and analytics.
