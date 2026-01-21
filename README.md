# Weather Comfort Analytics Application

## Overview
This application delivers real-time weather intelligence backed by a server-computed Comfort Index. It ingests city codes from the bundled dataset, retrieves live conditions from OpenWeatherMap, applies a weighted comfort model, ranks cities, and presents the results through an authenticated, responsive Next.js interface. Server-side caching keeps responses fast while reducing external API calls.

## Quick Start
1) Prerequisites: Node 18+, npm. Create an OpenWeatherMap API key and Auth0 app (see Environment).
2) Install:
```bash
npm install
```
3) Configure environment (copy .env.example if present):
```bash
NEXT_PUBLIC_OPENWEATHER_API_KEY=<your_key>
AUTH0_SECRET=<random_long_secret>
AUTH0_BASE_URL=http://localhost:3000
AUTH0_ISSUER_BASE_URL=https://<your-tenant>.auth0.com
AUTH0_CLIENT_ID=<client_id>
AUTH0_CLIENT_SECRET=<client_secret>
```
4) Run locally:
```bash
npm run dev
```
5) Production build:
```bash
npm run build && npm start
```

## Architecture
- Framework: Next.js 16 (App Router) with React 19 and TypeScript.
- UI: Tailwind (via Next styles) with responsive layouts for desktop and mobile.
- Data fetching: Server routes under `app/api`. Client uses React Query for caching on the client side of already processed data.
- Authentication: Auth0 via `@auth0/nextjs-auth0` (login/logout, whitelisted test user flow, MFA enforced at Auth0 tenant level).
- Caching: In-memory NodeCache (5 minute TTL, 60s sweep). Raw and processed weather payloads share the same cache layer.
- Comfort Index: Calculated on the server; frontend only renders ranked results.

## Environment Variables
- `NEXT_PUBLIC_OPENWEATHER_API_KEY`: OpenWeatherMap API key.
- `AUTH0_SECRET`: Long random string for cookie encryption.
- `AUTH0_BASE_URL`: Application base URL (e.g., http://localhost:3000).
- `AUTH0_ISSUER_BASE_URL`: Auth0 tenant URL.
- `AUTH0_CLIENT_ID` / `AUTH0_CLIENT_SECRET`: Auth0 application credentials.

## Data Flow
1) City codes are read from `cities.json` (minimum 10 cities as required).
2) `/api/weather` fetches each city from OpenWeatherMap using metric units.
3) Server computes Comfort Index per city, sorts by score, assigns rank, and caches the aggregated response for 5 minutes.
4) Responses return a `cacheHit` flag plus a timestamp for observability.
5) `/api/cache` exposes cache status and allows cache flush for debugging.

## Comfort Index Model
**Formula:**
$$CI = 0.40\times T_s + 0.25\times H_s + 0.20\times W_s + 0.15\times V_s$$

- Temperature score (\(T_s\)): Optimal 18–24°C; tapered penalties outside this band.
- Humidity score (\(H_s\)): Optimal 40–60%; steeper drop beyond 70% as perceived mugginess increases.
- Wind score (\(W_s\)): Optimal 0–2 m/s; higher winds reduce comfort.
- Visibility score (\(V_s\)): Optimal ≥10 km; low visibility signals adverse conditions.

**Why these weights**
- Temperature (40%): Primary human comfort driver in typical daily conditions.
- Humidity (25%): Materially affects perceived temperature and breathability.
- Wind (20%): Moderates temperature but becomes uncomfortable when high.
- Visibility (15%): Captures air clarity and precipitation effects without dominating the score.

**Trade-offs**
- Simplicity vs. completeness: Dew point, solar radiation, and pressure are omitted for brevity and API availability.
- Linear segment scoring favors interpretability over meteorological precision.
- In-memory cache keeps latency low but is not durable across instances.

## Caching Design
- Library: NodeCache with `stdTTL=300` seconds and `checkperiod=60` seconds.
- Scope: Raw OpenWeather responses and processed ranked payload share the same cache key per aggregate request (`weather_data_all_cities`).
- Observability: `/api/weather` returns `cacheHit`; `/api/cache` returns keys and stats; `/api/cache` DELETE clears cache.
- Rationale: Reduces external API calls, stabilizes UX, meets assignment’s 5-minute TTL requirement.

## Authentication and Authorization
- Auth0-managed login/logout using the Next.js Auth0 SDK.
- Dashboard access intended for authenticated users only; Auth0 tenant should disable public signups and whitelist the provided test user (careers@fidenz.com / Pass#fidenz) with MFA enforced via email.

## API Endpoints
- `GET /api/weather` — Returns ranked weather data with comfort scores and `cacheHit` flag.
- `GET /api/cache` — Returns cache keys and stats for debugging.
- `DELETE /api/cache` — Flushes the cache (development/debug utility).

## UI Behavior
- Displays city name, description, temperature, comfort score, and rank.
- Sorted from most to least comfortable.
- Responsive layouts for desktop and mobile; cards stack on small screens.

## Technologies
- Next.js 16, React 19, TypeScript
- Auth0 (`@auth0/nextjs-auth0`)
- React Query
- NodeCache
- Tailwind (styles) and clsx/tailwind-merge helpers

## Known Limitations
- In-memory cache is per-instance and non-persistent; scale-out would need a shared store (Redis).
- No automated tests yet for the Comfort Index (bonus item pending).
- API rate limits from OpenWeatherMap can still apply if cache is flushed frequently.
- MFA, signup restrictions, and whitelisting are configured in Auth0 tenant (not enforced in code alone).

## References
- OpenWeatherMap API: https://openweathermap.org/current
- Auth0 Next.js SDK: https://auth0.com/docs/quickstart/webapp/nextjs
- Next.js App Router: https://nextjs.org/docs/app
- React Query: https://tanstack.com/query/latest
- NodeCache: https://github.com/node-cache/node-cache

## License
MIT License. See LICENSE.
