# CarMatch — Frontend (React + Vite)

Vite + React + TypeScript + Tailwind frontend for the CarMatch AI car-buying advisor.

## Quick start

```bash
cd frontend
npm install
cp .env.example .env.local          # set VITE_API_URL to your backend URL
npm run dev                          # http://localhost:5173
```

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `VITE_API_URL` | Yes | Base URL of the FastAPI backend (e.g. `http://localhost:8000` or your Render URL) |

## Tests & quality

```bash
npm run lint        # ESLint
npm run build       # type-check + production build
```

## Deploy on Vercel

1. Import the repo in [Vercel](https://vercel.com). Set **Root Directory = `frontend`**.
2. Add env var: `VITE_API_URL` = your Render backend URL (e.g. `https://cardekho-api.onrender.com`).
3. `vercel.json` is already configured for SPA routing — no extra setup needed.
