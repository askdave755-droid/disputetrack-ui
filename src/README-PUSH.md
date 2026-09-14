# DisputeTrack UI — CROA Compliance Push (2026-09-14)

Apply these 3 files to repo askdave755-droid/disputetrack-ui via GitHub MCP push_files.
Vercel auto-deploys ~75s after push. Then hard-refresh https://disputetrack-ui.vercel.app/

| File here              | Path in repo            | What changed |
|------------------------|-------------------------|--------------|
| index.html             | index.html              | Title: removed "Credit Repair Command Center" (V1 violation). Added CROA-safe meta description. |
| Landing.jsx            | src/pages/Landing.jsx   | Full copy rewrite: hero, comparison table (+ "you stay in control" row), gates (gate 3 & 7 sender/target framing), 4 tier cards renamed/reworded (D4Y = "Done-With-You Prep"), sender footnote on every card, NEW 6-question FAQ section, NEW full footer disclaimer. |
| README.md (this dir)   | README.md               | One line: "credit repair SaaS" -> "credit-report workflow SaaS". |

## push_files payload
[
  {"path": "index.html", "content": "<contents of index.html>"},
  {"path": "src/pages/Landing.jsx", "content": "<contents of Landing.jsx>"},
  {"path": "README.md", "content": "React + Vite + Tailwind frontend for DisputeTrack (multi-tenant credit-report workflow SaaS).\n\n## Pages\n\n- /login, /register — agency onboarding (creates tenant + owner)\n- / — Dashboard: client counts, dispute pipeline, plan status, compliance alerts\n- /clients — client list + add client\n- /disputes — dispute pipeline by status, generate letters\n- /billing — Stripe subscription checkout + plan status\n\n## Deploy (Vercel)\n\n1. Import repo, framework preset: Vite\n2. Env var: VITE_API_URL = your Railway disputetrack-api URL\n3. vercel.json handles SPA routing\n\n## Local dev\n\n```\nnpm install\ncp .env.example .env\nnpm run dev\n```\n"}
]

## Post-deploy verification
1. View source: title must NOT contain "Credit Repair".
2. Landing: FAQ section visible above final CTA; footer shows full disclaimer.
3. grep the built JS bundle for: "we run the process", "Credit Repair Command Center"
   → zero hits.
4. Site pages still work: /quiz, /login, /register.
