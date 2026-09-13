# URFA: Supabase database + existing Express backend

Author: Manuel Dinis Júnior

This setup retains the existing tested customer/admin authentication. Supabase Auth is not used; do not mix its user accounts with the application's customers/admins tables. No Supabase SDK or database password belongs in the browser.

## 1. Create the database

Create a Supabase project named `urfa-web-app`, selecting a suitable EU region and saving its strong database password in a password manager. Disable the Data API for this server-only database. Migration 003 also enables RLS on every application table, with no public access policies. The server uses the trusted owner connection; browser clients must never receive it.

In Connect, choose Session pooler for an IPv4-compatible persistent connection. Copy the exact connection string and insert the URL-encoded database password. Store it only as the backend variable `DATABASE_URL`. Use TLS certificate verification; follow the Supabase connection guide for certificates. Never use `rejectUnauthorized:false`.

## 2. Deploy the server

In Railway create a project from GitHub repository `manueldinisjunior/urfa-web-app`. Review the provider's billing before selecting a paid plan. The existing Dockerfile builds the frontend and server; railway.json runs database setup before deployment and checks `/api/health`.

Generate a Railway public domain. Configure these **server variables** before deploying:

| Variable | Value |
| --- | --- |
| NODE_ENV | production |
| DATABASE_URL | Supabase connection string from step 1 |
| JWT_SECRET | At least 32 random characters, generated privately |
| PUBLIC_URL | Your Railway HTTPS app origin, without a trailing slash |
| ALLOWED_ORIGINS | The same exact origin |
| ADMIN_EMAIL | Owner's login email |
| ADMIN_PASSWORD | Unique initial password, at least 12 characters |
| SMTP_URL | Your email provider's SMTP connection string |
| MAIL_FROM | Verified sender address |
| ADMIN_NOTIFICATION_EMAIL | Restaurant recipient for new-order notifications |

Initial admin setup inserts an admin only when missing. Remove ADMIN_PASSWORD from hosted variables after successful provisioning; changing it later is not a password reset. The Docker server build uses same-origin `/api` and does not set demo mode. Do not put secrets in GitHub Pages variables, frontend code, screenshots or chat.

## 3. Verify the production candidate

Confirm the deployment and `/api/health` succeed. Visit `/#/admin/login`, sign in and confirm private product/category management. Verify SMTP delivery with a controlled test order coordinated with the restaurant. Confirm the customer email link works once, favorites persist, customers cannot access admin endpoints, the admin gets one order notification, and cart expiry removes abandoned selections. Existing automated tests cover those backend rules but do not prove external email delivery.

Complete the operator/privacy documents before accepting real customer orders. The account notices must cover automatic account creation and staff visibility of carts.

## Keeping GitHub Pages

The existing Pages deployment remains a static demonstration until deliberately connected. The simplest live setup serves the frontend and API together on Railway; the code still lives on GitHub.

To keep the **live frontend** on Pages, first assign it a custom HTTPS domain, with the API on an HTTPS subdomain of that same site. Then configure the Pages build's VITE_API_URL to the API URL ending in `/api`, set VITE_DEMO_MODE=false, and update backend PUBLIC_URL/ALLOWED_ORIGINS to the frontend origin. These variables are build-time settings. The server's exact-origin CSRF checks and credentialed requests must stay enabled. Do not connect unrelated github.io and railway.app origins and assume SameSite=Lax cookies will work.

Using GitHub Pages with only Supabase Auth/Data API is a different implementation: it requires replacing the existing auth/API, designing RLS policies and moving trusted order pricing, email, and cart cleanup into server-side functions. Simply adding a sign-in SDK does not complete this restaurant backend.

Sources: https://supabase.com/docs/guides/database/connecting-to-postgres · https://supabase.com/docs/guides/api/securing-your-api · https://docs.railway.com/builds/dockerfiles
