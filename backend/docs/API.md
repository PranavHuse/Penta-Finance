# Pento Finance API Reference

Base URL: `http://localhost:5000/api`

All responses use `Content-Type: application/json` unless noted. Errors always follow:
```json
{ "error": { "code": "SOME_CODE", "message": "Human-readable message" } }
```

All routes except `/auth/login` require:
Authorization: Bearer <jwt>
A missing/invalid/expired token returns `401` with code `UNAUTHORIZED` or `TOKEN_INVALID`.

---

## Auth

### `POST /auth/login`
Body: `{ "email": string, "password": string }`
→ `200`: `{ "token": string, "user": { id, name, email, avatarUrl } }`
→ `401 INVALID_CREDENTIALS` on bad email/password

### `POST /auth/logout`
→ `200 { "success": true }` (stateless JWT — client discards the token)

### `GET /auth/me`
→ `200`: current user object

---

## Dashboard

### `GET /dashboard/summary`
→ `200`: `{ "balance": number, "revenue": number, "expenses": number, "savings": number }`
All computed server-side via MongoDB aggregation.

### `GET /dashboard/trend?granularity=monthly|weekly`
Default `monthly`.
→ `200`: `{ "granularity": string, "data": [{ "period": string, "revenue": number, "expense": number }] }`

---

## Transactions

### `GET /transactions`
Query params (all optional except pagination defaults):

| Param | Type | Notes |
|---|---|---|
| `page` | number | default 1 |
| `limit` | number | default 10, max 100 |
| `search` | string | matches user name, category, status, or exact amount |
| `category` | `Revenue` \| `Expense` | |
| `status` | `Paid` \| `Pending` | |
| `userId` | string | Mongo ObjectId |
| `dateFrom` / `dateTo` | ISO date | inclusive range |
| `amountMin` / `amountMax` | number | inclusive range |
| `sortBy` | `date` \| `amount` \| `category` \| `status` | default `date` |
| `sortDir` | `asc` \| `desc` | default `desc` |

→ `200`: `{ "data": Transaction[], "pagination": { page, limit, total, totalPages } }`

### `GET /transactions/:id`
→ `200`: single transaction, or `404 NOT_FOUND`

---

## Reports

### `POST /reports/export`
Body:
```json
{
  "columns": ["id", "date", "amount", "category", "status", "user"],
  "filters": { "category": "Revenue", "sortBy": "date", "sortDir": "desc" }
}
```
`columns`: at least one of `id`, `date`, `amount`, `category`, `status`, `user`.
`filters`: same shape as the `/transactions` query params; omit/empty for the full dataset.

→ `200`: streamed `text/csv` with `Content-Disposition: attachment; filename="loopr-transactions-<date>.csv"`
→ `400 EXPORT_EMPTY_RESULT` if no rows match the filters