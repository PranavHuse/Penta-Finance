# Pento — Financial Analytics Dashboard

Full-stack assignment: React/TS frontend + Node/TS backend + MongoDB, JWT auth, charts, filterable/sortable transaction table, configurable CSV export.

## Quick start

```bash
# Backend
cd backend
npm install
cp .env.example .env   # fill in MONGODB_URI, JWT_SECRET
npm run seed
npm run dev             # http://localhost:5000

# Frontend (separate terminal)
cd frontend
npm install
echo "VITE_API_BASE_URL=http://localhost:5000/api" > .env
npm run dev              # http://localhost:5173
```

Log in with any of the seeded demo accounts — see `backend/README.md`.

## Docs

- [`backend/README.md`](backend/README.md) — backend setup, scripts
- [`backend/docs/API.md`](backend/docs/API.md) — full endpoint reference
- [`frontend/README.md`](frontend/README.md) — frontend setup, structure



## Known limitations / assumptions

- "Savings" (KPI card) has no defined formula in the brief — currently `max(revenue - expenses, 0)`; documented as an assumption in the PRD.
- CSV export streams the full matching result set (not paginated) — PRD open question #4 resolved in favor of full export.
- Weekly trend granularity works but produces dense charts given the seed data's 1-year span — expected, not a bug.
- No refresh-token rotation — JWT is a single access token with a configurable expiry (`JWT_EXPIRES_IN`); acceptable for assignment scope per PRD non-goals.