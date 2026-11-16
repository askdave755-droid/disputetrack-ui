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
3. Optional, baked in at build time (defaults shown):
   - `VITE_FREE_MODE=true` — hide prices, upgrade prompts, and Stripe checkout; pages say "Free for now"
   - `VITE_STRIKES_ENABLED=false` — do not show strike warnings or the account-paused screen
4. vercel.json handles SPA routing

To turn billing and strikes back on, set `VITE_FREE_MODE=false` and `VITE_STRIKES_ENABLED=true`, then redeploy. Unset variables keep the defaults above.

## Local dev

```bash
npm install
cp .env.example .env
npm run dev
```
