# Customer and admin architecture

Author: Manuel Dinis Júnior

The storefront is public. `/account` contains only the authenticated customer's favorites and orders. `/admin/login` authenticates staff against the separate admins table; every administrative API uses server-side admin verification. Customer credentials never grant administrative access. The public dashboard preview was removed.

First successful order creation creates one unverified customer record per normalized email address. A random, single-use, 20-minute email link verifies email ownership before issuing a seven-day HttpOnly customer cookie. Only token hashes are stored. Existing accounts request new links at `/account`; responses do not disclose whether an account exists. This is passwordless authentication, not a password emailed in plaintext. Admin authentication remains password plus short-lived JWT and rotated refresh token.

Customers can save products with PUT/DELETE `/api/customer/favorites/:id`, read their orders at `/api/customer/orders`, and synchronize their cart at `/api/customer/cart`. Identity comes from the server session, never a submitted customer ID. Cart prices are untrusted; the order endpoint independently validates options, availability and totals.

The cart expires 24 hours after its first non-empty save. Edits do not extend the deadline. Emptying or purchasing clears it; a later new cart starts a new deadline. API reads exclude and delete expired carts. The server's minute worker also deletes expired carts, login tokens and sessions. Browser timers clear open carts; the local cart expires across reloads too. Admin `/api/admin/carts` displays only non-expired registered-customer carts, separate from revenue and orders. Customer logout clears the local selection. Server carts are restored on login.

New orders use the existing private order dashboard and durable email outbox. `ADMIN_NOTIFICATION_EMAIL` specifies the staff recipient; mail contains the order reference and private dashboard URL, not customer contact details. Delivery retries use the existing worker. Product management already includes category filtering, name search and sorting.

## Deployment

GitHub Pages hosts only the public static storefront. Its demo build offers no customer login or public dashboard, and does not submit real orders. It cannot execute the backend.

Use the repository Docker/Railway configuration for a same-origin full-stack deployment. Required production configuration: `DATABASE_URL`, strong `JWT_SECRET`, `PUBLIC_URL`, `ALLOWED_ORIGINS`, initial `ADMIN_EMAIL` and `ADMIN_PASSWORD`, `SMTP_URL`, `MAIL_FROM`, `ADMIN_NOTIFICATION_EMAIL`, `VITE_API_URL=/api`, `VITE_DEMO_MODE=false`. Do not commit credentials. Run migrations (including 002) and setup before starting. Same-origin deployment is recommended for the SameSite=Lax cookies.

Before accepting real customer data, complete and approve the privacy/operator documents, including automatic account creation, staff visibility of carts and retention. Configure SMTP and verify real inbox delivery. Tests use the outbox/test transport and do not prove external mail delivery.

API additions: POST customer/login, verify, logout; GET customer/me, orders, favorites, cart; PUT/DELETE customer/favorites/:id; PUT customer/cart; GET admin/carts (all paths under `/api`). See server/tests/customers.test.mjs for isolation, replay and expiration tests.
