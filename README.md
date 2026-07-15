# NeighbourIQ — AI Community Guardian

Council and resident dashboards for flood, traffic, incident hotspot, and budget-priority risk, driven by a transparent rules-based predictive engine.

- **`/dashboard` and `/resident`** — search any real UK postcode or place and see live conditions: real flood risk (Environment Agency), real crime/incident data (data.police.uk), real weather (Open-Meteo), and real traffic (TomTom, if configured). Vulnerable-resident and budget-priority panels blend in clearly-labeled illustrative sample data, since no public source exists for that.
- **`/demo/dashboard` and `/demo/resident`** — the original scripted pitch demo for the fictional town of Millhaven: a manually-advanced five-stage story (calm day → storm → flood → incidents → council response), unchanged. Reachable from a corner button on the front page.

## Stack

- Next.js 16 (App Router)
- React 19
- Tailwind CSS 4
- Recharts, react-leaflet (live map)

## Getting started

```bash
npm install
cp .env.example .env.local   # optional: add TOMTOM_API_KEY for live traffic data
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) locally, or the live demo at [https://cisco-livid.vercel.app](https://cisco-livid.vercel.app).

### Real data sources (live mode)

| Source | Provider | Key required? | Coverage |
|---|---|---|---|
| Flood risk | [Environment Agency flood-monitoring API](https://environment.data.gov.uk/flood-monitoring/doc/reference) | No | England only |
| Crime/incidents | [data.police.uk](https://data.police.uk/docs/) | No | England, Wales, Northern Ireland |
| Weather | [Open-Meteo](https://open-meteo.com/) | No | UK-wide |
| Traffic | [TomTom Traffic API](https://developer.tomtom.com/) | **Yes** — `TOMTOM_API_KEY` | UK-wide |
| Geocoding | [postcodes.io](https://postcodes.io/) + [Nominatim](https://nominatim.org/) | No | UK-wide |

Areas outside England (flood) or Scotland (crime) show a clear "not available" state instead of an error. Without `TOMTOM_API_KEY`, everything else still works; traffic just shows as unconfigured.

## Scripts

| Command        | Description              |
|----------------|--------------------------|
| `npm run dev`  | Start development server |
| `npm run build`| Production build         |
| `npm run start`| Serve production build   |
| `npm run lint` | Run ESLint               |

## Deployment

Hosted on [Vercel](https://vercel.com). Production URL: **https://cisco-livid.vercel.app**

Source of truth is [m1-k-k/neighbourIQ](https://github.com/m1-k-k/neighbourIQ). Deploys to production run automatically via GitHub Actions (`.github/workflows/deploy.yml`) on every push to `master`:

1. `npm ci`
2. `vercel pull` / `vercel build --prod` / `vercel deploy --prebuilt --prod`

This requires three repository secrets to be set under **Settings → Secrets and variables → Actions**:

| Secret | Where to get it |
|---|---|
| `VERCEL_TOKEN` | Create at [vercel.com/account/tokens](https://vercel.com/account/tokens) |
| `VERCEL_ORG_ID` | From `.vercel/project.json` after running `vercel link` locally, or Project Settings → General |
| `VERCEL_PROJECT_ID` | Same as above |

A separate workflow (`.github/workflows/ci.yml`) runs lint + build on every push and pull request as a merge gate.

For live traffic data in production, also add `TOMTOM_API_KEY` under the Vercel project's **Environment Variables** (Project Settings → Environment Variables) — this is a runtime secret read by the `/api/location-data` route on each request, separate from the GitHub Actions secrets above.

For a manual/local redeploy (team `m1wav`), you can still run:

```bash
npx vercel --prod --scope m1wav
```
