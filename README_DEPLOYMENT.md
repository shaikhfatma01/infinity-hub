# InfinityHub — Supabase Postgres backend and deployment

This project uses a React + Vite frontend, an Express/TypeScript API, Prisma ORM, and Supabase Postgres.

## Configure Supabase

1. Create or open your Supabase project and go to **Connect** in the project dashboard.
2. Copy the **Transaction pooler** connection string (port `6543`) into `DATABASE_URL`. Keep `pgbouncer=true` and `sslmode=require`.
3. Copy the **Direct connection** string (port `5432`) into `DIRECT_URL`. Prisma uses this URL for schema changes. If your network cannot reach the direct host, use Supabase's **Session pooler** connection string for this URL instead.
4. URL-encode special characters in the database password (for example, `@` as `%40` and `#` as `%23`). Keep both URLs private and never commit `.env` files.

The app's current MySQL data is not copied automatically. The first run creates the schema in Supabase and seeds the demo catalogue if it is empty. Export and migrate any MySQL data you need to keep before switching production traffic.

## Administrator access

The Admin Panel lists registered account names, email addresses, roles, and account dates. Passwords and password hashes are never returned. The user-list API requires a signed-in account whose database role is `ADMIN`; registering an account cannot grant this role.

1. Register your own account and sign in once.
2. In the Supabase SQL Editor, promote only your trusted account by replacing the email below:

   ```sql
   UPDATE "User"
   SET role = 'ADMIN'
   WHERE email = 'your-trusted-email@example.com';
   ```

3. Confirm that one row was updated, then sign out and sign back in. The **Admin Panel** button will appear in the top bar.

Do not promote the seeded demo account or any email address you do not control. Keep admin credentials private and remove the `ADMIN` role from accounts that no longer need access.

## Run with Docker

1. Install Docker Desktop (Windows/macOS) or Docker Engine + Compose (Linux).
2. Copy `.env.docker.example` to `.env` in the project root.
3. Set `DATABASE_URL`, `DIRECT_URL`, and a random `JWT_SECRET` of at least 32 characters.
4. Start the stack from the project root:

   ```sh
   docker compose up --build -d
   ```

5. Open `http://localhost:8080`. API health is available at `http://localhost:8080/api/health`.
6. Check logs with `docker compose logs -f api`; stop with `docker compose down`.

The API applies the Prisma schema using `DIRECT_URL`, then starts and seeds the starter catalogue and missions if the product table is empty.

## Run locally without Docker

1. Install Node.js 22+.
2. Copy `server/.env.example` to `server/.env`, fill in `DATABASE_URL` and `DIRECT_URL` from your Supabase project, and set a strong `JWT_SECRET`.
3. From `server/`, run:

   ```sh
   npm ci
   npx prisma generate
   npx prisma db push
   npm run db:seed
   npm run dev
   ```

4. In another terminal at the project root, run `npm ci` and `npm run dev`. The frontend is at `http://localhost:3000`; Vite proxies `/api` to `http://localhost:5000`.

## Deployment notes

- For a public deployment, terminate HTTPS at a trusted reverse proxy/load balancer and set `CLIENT_URL` to the public frontend origin.
- Configure real provider credentials only in deployment environment secrets. The app's store adapters default to demo mode; demo mode is not a live retailer integration.
- A Gemini key is optional. Without it (or if the call fails), the application uses its local rule-based AI fallback. The model is set with `GEMINI_MODEL` (default `gemini-3.5-flash`); Google retired `gemini-2.0-flash` on 2026-06-01, so keep this value current.
- The demo seed creates a demo account with a known starter password in the source. Do not use that account in production; remove or change it before exposing the app publicly.
- If an API key or secret was ever committed or shared in an archive, revoke/rotate it. Keep all `.env` files private.

## How the pieces connect

- **Browser → API:** the frontend calls `/api/*`. In development Vite proxies this to `http://localhost:5000`; in Docker nginx proxies it to the `api` container. Override with `VITE_API_BASE_URL` if the API lives elsewhere.
- **API → database:** Prisma uses the Supabase Transaction pooler URL in `DATABASE_URL`; schema setup uses the direct or session pooler URL in `DIRECT_URL`. On first start the server seeds the catalogue, shopping missions, shared list, and a demo account (`fatma.shaikh@infinityhub.ai` / `Password123!`; change or remove it before a public launch).
- **Guest vs signed-in:** every browser gets a random guest id (`x-guest-id`). Cart, wishlist and price alerts are stored against it, and are merged into the account when the visitor signs in or registers.
- **Live vs offline indicator:** the top bar shows **Live data** when the API answered, or **Offline demo** when the frontend fell back to its bundled demo data (nothing is saved in that mode).
- **Health:** `GET /api/health` returns `200` when the database answers and `503` when it does not.

## Checks before deploying

```bash
npm run typecheck            # frontend
cd server && npm run typecheck && npm run build   # backend (must compile; production runs dist/)
```
