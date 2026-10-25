# InfinityHub — MySQL backend and Docker deployment

This project uses a React + Vite frontend, an Express/TypeScript API, Prisma ORM, and MySQL 8.4.

## Run with Docker (recommended)

1. Install Docker Desktop (Windows/macOS) or Docker Engine + Compose (Linux).
2. Copy `.env.docker.example` to `.env` in the project root.
3. Edit `.env`: set strong, unique values for `MYSQL_PASSWORD`, `MYSQL_ROOT_PASSWORD`, and `JWT_SECRET` (at least 32 random characters). Do not commit `.env`.
4. Start the stack from the project root:

   ```sh
   docker compose up --build -d
   ```

5. Open `http://localhost:8080`. API health is available at `http://localhost:8080/api/health`.
6. Check logs with `docker compose logs -f api`; stop with `docker compose down`. To preserve data, do not remove the `mysql_data` volume. `docker compose down -v` permanently deletes the database volume.

The API waits for MySQL to become healthy, applies the Prisma schema, then starts. The backend automatically seeds the starter product catalogue and missions if the product table is empty.

## Run locally without Docker

1. Install Node.js 22+ and MySQL 8+.
2. Create a MySQL database and user, then copy `server/.env.example` to `server/.env` and set `DATABASE_URL` to `mysql://USER:PASSWORD@localhost:3306/DATABASE` and a strong `JWT_SECRET`.
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
- If an API key or secret was ever committed or shared in an archive, revoke/rotate it. Keep `.env` files out of version control and archives.


## How the pieces connect

- **Browser → API:** the frontend calls `/api/*`. In development Vite proxies this to `http://localhost:5000`; in Docker nginx proxies it to the `api` container. Override with `VITE_API_BASE_URL` if the API lives elsewhere.
- **API → database:** Prisma talks to MySQL via `DATABASE_URL`. On first start the server seeds the catalogue, shopping missions, shared list and a demo account (`fatma.shaikh@infinityhub.ai` / `Password123!`; change or remove it before a public launch).
- **Guest vs signed-in:** every browser gets a random guest id (`x-guest-id`). Cart, wishlist and price alerts are stored against it, and are merged into the account when the visitor signs in or registers.
- **Live vs offline indicator:** the top bar shows **Live data** when the API answered, or **Offline demo** when the frontend fell back to its bundled demo data (nothing is saved in that mode).
- **Health:** `GET /api/health` returns `200` when the database answers and `503` when it does not.

## Checks before deploying

```bash
npm run typecheck            # frontend
cd server && npm run typecheck && npm run build   # backend (must compile; production runs dist/)
```
