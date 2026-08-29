# DisputeTrack UI

React + Vite + Tailwind frontend for DisputeTrack (multi-tenant credit repair SaaS).

## Pages

- /login, /register — agency onboarding (creates tenant + owner)
- / — Dashboard: client counts, dispute pipeline, plan status, compliance alerts
- /clients — client list + add client
- /disputes — dispute pipeline by status, generate letters
- /billing — Stripe subscription checkout + plan status

## Deploy (Vercel)

1. Import repo, framework preset: Vite
2. Env var: VITE_API_URL = your Railway disputetrack-api URL
3. vercel.json handles SPA routing

## Local dev

```bash
npm install
cp .env.example .env
npm run dev
```
