# Urfa Grill

Developed by **Manuel Dinis Júnior** — https://manueldinisjunior.de/

React/TypeScript storefront with Express, PostgreSQL, private order tracking, reservations and restaurant administration. German customer interface, Europe/Berlin scheduling and EUR pricing.

## Run locally

Node 22.12+ is required.

```sh
npm ci
cp .env.example .env
npm run db:setup -- --seed
npm run dev
```

Open http://localhost:3000. Without DATABASE_URL, development uses a persistent PGlite database in `.local-db`. Production requires PostgreSQL. Configure ADMIN_EMAIL and ADMIN_PASSWORD (12+ characters) privately, then run `npm run db:setup -- --admin`. This command also supports resetting an existing admin and revokes its sessions. Remove ADMIN_PASSWORD from the environment afterwards.

The restaurant starts paused with all weekdays closed. Set opening hours, tables, capacity and lead time under `/#/admin`, then enable acceptance. No opening hours are invented. Reservations hold one table; automatic combination of tables is not implemented.

## Features

- Separate basket and checkout, quantity updates, product choices/extras, error summary and field validation.
- 169 products across 13 categories imported from https://www.urfagrill-hildesheim.de/ on 12 September 2026. Includes source size variants, required choices, extras, drink deposit information and age confirmation. Import is a snapshot, not ongoing synchronization. Restaurant must review changes before accepting orders.
- No unrelated dish photograph is assigned to imported products. Existing supplied photography remains in the homepage gallery. Ingredient and optional GLB/GLTF fields prepare future product experiences; no 3D renderer or Next.js migration is included.
- Orders have server-calculated prices, expected-total checks, transactional idempotency, private tracking links and enforced status transitions. Past dates/times, closed days and insufficient preparation time are rejected on the server. Checkout uses native date minimums and validates before submission.
- Four-step booking with availability, overlapping-table protection, private cancellation link and optional automatic confirmation.
- Cookie-based admin authentication, dashboard, order management, product CRUD, reservation calendar and operating settings. Audit history and soft-deleted products preserve historical references.
- Polling updates menus, orders, reservations and tracking. Notifications reflect actual status changes, never simulated timers.
- FAQ, green navigation drawer, category navigation, breadcrumbs, keyboard focus handling and reduced-motion support.

## Production

```sh
npm run build:server
NODE_ENV=production npm run db:setup -- --seed
NODE_ENV=production npm run server
```

Set DATABASE_URL, a stable JWT_SECRET of at least 32 characters, PUBLIC_URL and ALLOWED_ORIGINS. Serve the frontend and API through the same HTTPS origin so Secure/SameSite cookies work reliably. Dockerfile, compose.yml and railway.json are included. Railway pre-deploy runs migrations; explicitly run initial seeding/admin creation once. Configure PostgreSQL backups and deployment secrets in your hosting account. Provider provisioning and production deployment are not completed by this source change.

The GitHub Pages workflow explicitly builds a **demonstration storefront** (`VITE_DEMO_MODE=true`): Pages cannot run Express/PostgreSQL and does not submit real orders. Use the server build for the operational application. A separate frontend host needs a same-origin `/api` reverse proxy to the backend; simply pointing at an unrelated domain is insufficient for SameSite cookies.

Email requires SMTP_URL and MAIL_FROM. An outbox worker retries failures and sends reservation reminders within two hours. Delivery is at-least-once; stable Message-IDs help deduplication but cannot guarantee exactly-once delivery. Optional Twilio reminders require TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN and TWILIO_FROM plus explicit customer opt-in and international phone format. No real email or SMS delivery has been verified without provider credentials. After eight failures, inspect the provider and outbox before retrying.

Keep JWT_SECRET stable: private idempotent-response tokens are derived from it. Secret rotation invalidates sessions and can affect retried private links. No public account creation, online payment processing, password-reset email, MFA or multi-table booking is included. Payment is at pickup; revenue widgets report completed-order value, not settled payment transactions.

## API and checks

Interactive endpoint reference: `/api/docs`; machine-readable: `/api/openapi.json`. Request shapes are defined in `server/validation.mjs`. Mutations require JSON, an allowed Origin and `X-Urfa-Request: 1`. Private tracking uses `X-Order-Token`; cancellation uses `X-Reservation-Token`. Never expose private links in analytics or public logs.

```sh
npm run test:all
npm run build:server
npm audit --omit=dev
```

Tests cover authentication, refresh/logout, CSRF, server pricing, stock/choices, idempotency, status transitions, overlapping reservations, cancellation, past dates, DST gaps, notification retries and all imported configurations. Local API tests use PGlite. GitHub CI uses PostgreSQL 17 via TEST_DATABASE_URL and a disposable database. Do not point tests at production.

Import scripts accept downloaded public source files: `node scripts/import-menu.mjs path/to/source.html`, followed by `node scripts/merge-menu-options.mjs path/to/options-directory`. `--seed` inserts missing products and does not overwrite administrative edits. Retire legacy demo products through administration when upgrading an existing development database.
