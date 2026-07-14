# NeighbourIQ — AI Community Guardian

Demo app for Millhaven council and resident views: flood, traffic, incident hotspot, and budget-priority panels driven by a transparent rules-based predictive engine.

## Stack

- Next.js 16 (App Router)
- React 19
- Tailwind CSS 4
- Recharts

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) locally, or the live demo at [https://cisco-livid.vercel.app](https://cisco-livid.vercel.app).

- **Council Dashboard** — `/dashboard`
- **Resident View** — `/resident`

Use the scenario controls in the header to advance through the five-stage demo (calm day → storm → flood → incidents → council response).

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

For a manual/local redeploy (team `m1wav`), you can still run:

```bash
npx vercel --prod --scope m1wav
```
