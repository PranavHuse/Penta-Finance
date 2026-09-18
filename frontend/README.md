# Pento finance — Frontend

React + TypeScript + Vite dashboard UI, styled with Tailwind + shadcn/ui in the dark "Penta" theme.

## Setup

1. `npm install`
2. Copy `.env.example` (or create `.env`) with:
VITE_API_BASE_URL=http://localhost:5000/api

3. `npm run dev` — starts on `http://localhost:5173`

Requires the backend running (see `../backend/README.md`) and seeded (`npm run seed` in `backend/`).

## Structure

- `src/context/AuthContext.tsx` — JWT auth state, persisted to `localStorage`
- `src/lib/api.ts` — Axios instance with Bearer token + 401-redirect interceptor
- `src/hooks/` — data-fetching hooks (dashboard summary/trend, transactions list, debounce)
- `src/components/layout/` — sidebar, topbar, app shell
- `src/components/dashboard/` — KPI cards, trend chart, recent transactions, dashboard table preview
- `src/components/transactions/` — full table, filter bar, pagination, CSV export dialog
- `src/pages/` — route-level pages (Login, Dashboard, Transactions)