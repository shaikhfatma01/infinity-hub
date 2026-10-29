# Changes made in this review

## Would have stopped the app from working
- **Production server could not start** (running the compiled server crashed with `ERR_MODULE_NOT_FOUND`): two imports lacked `.js`. Fixed, and `tsconfig` now uses `NodeNext` so this becomes a compile error from now on.
- **Frontend `npm run build` failed** (`Cannot find namespace 'NodeJS'` in `HeroSection.tsx`).
- **Frontend and backend were not actually connected.** Cart, wishlist, alerts, missions, shared list and the optimizer called endpoints with the wrong HTTP method, field names or response shape, and every failure was swallowed by `.catch(() => {})`. The UI ran entirely on hard-coded state. `catalogService` / `AppContext` now match the real API; the server is the source of truth, and failures roll back and show a toast.
- **Express 4 + async handlers:** a thrown error (e.g. unknown product) left the request hanging. All routes are wrapped and errors map to proper 4xx codes.
- **Snap & Shop modal crashed on open** (`useRef` after an early `return`).
- **Docker/Prisma on Alpine** needs OpenSSL; added to both stages.

## Wrong results
- Natural-language search ("laptop under 60000") matched nothing; now parsed into budget/rating + keywords.
- Cart optimizer ignored cheaper stores for products whose twin offers lived on a sibling listing (same `productGroupId`).
- "Apply savings" stored price+shipping wrongly; now stored separately.
- Mock data was looked up by array position and pointed at the wrong products; now by id.
- Hard-coded numbers disagreed with data (College Setup is Rs 14,217, not 13,700); now computed.
- Build My Look added the first 3 catalogue items, not the look shown.
- Deals pages listed non-deals ("FAIR PRICE").
- Placeholder store credentials made 5 stores appear "live".
- Gemini model `gemini-2.0-flash` was retired by Google (2026-06-01); now configurable via `GEMINI_MODEL`.

## Security / robustness
- Cart rows could be edited by anyone when no identity was sent; ownership is now enforced.
- Invalid/expired tokens are rejected (401) instead of silently becoming a guest; the client clears them.
- Guest cart, wishlist and alerts are merged on login/register (only the cart was before).
- Input validation for quantities, prices and query params; health endpoint returns 503 if the DB is down.
- Missing `server/.env.example` created; invalid `STORE_DATA_MODE=mock` fixed.
