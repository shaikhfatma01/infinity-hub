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
- A Gemini key is optional. Without it, the application uses its local rule-based AI fallback.
- The demo seed creates a demo account with a known starter password in the source. Do not use that account in production; remove or change it before exposing the app publicly.
- If an API key or secret was ever committed or shared in an archive, revoke/rotate it. Keep `.env` files out of version control and archives.
