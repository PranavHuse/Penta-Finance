# Pento Finance — Backend

Node.js + Express + TypeScript API for the Pento financial dashboard. JWT auth, MongoDB (Mongoose), CSV export.

## Setup

1. `npm install`
2. Copy `.env.example` to `.env` and fill in your values (a local or Atlas `MONGODB_URI`, a real `JWT_SECRET`).
3. Seed the database: `npm run seed`
   - Loads `src/data/transactions.json` (300 sample records)
   - Synthesizes 4 demo users (Matheus Ferrero, Floyd Miles, Jerome Bell, Courtney Henry) mapped from `user_001`–`user_004`
   - All 4 share one password, set via `SEED_DEMO_PASSWORD` in `.env` (default `loopr1234`)
   - Safe to re-run — upserts by `legacyId`/`legacyUserId`, won't duplicate
4. `npm run dev` — starts the API on `http://localhost:5000` (or your configured `PORT`)

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start with hot-reload (nodemon + ts-node) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run the compiled build |
| `npm run seed` | Load sample data into MongoDB |
| `npm run typecheck` | Type-check without emitting |

## Demo login

| Email | Password |
|---|---|
| matheus@loopr.io | (value of `SEED_DEMO_PASSWORD`) |
| floyd@loopr.io | same |
| jerome@loopr.io | same |
| courtney@loopr.io | same |

See `docs/API.md` for the full endpoint reference.