# bunderlog

A positioning-experiment landing page: one page, three Variants (A/B/C) each carrying one Positioning, a waitlist and a token-protected `/stats` page that compares Signup conversion per Variant. The product itself is not built yet — this repo only answers "which positioning makes people sign up". Domain terms: `.about/glossary.md`.

## Layout

Runs entirely on Cloudflare's free plan: static assets serve the pages, a Worker with D1 serves the API.

- `index.html` (landing) and `stats.html` — the two Vite entries; `src/` holds their Vue code.
  - `src/shared/copy.ts` — **all landing copy** for the three variants, plus `BRAND`/`DOMAIN`.
  - `src/shared/experiment.ts` — variant assignment, visitor id, first-touch attribution, beacon tracking.
  - `src/shared/variants.ts` — the variant list, shared with the Worker (which has no DOM).
  - `src/landing/` — landing components; `src/stats/` — stats page and its math (Wilson interval, P(best), sample size).
- `worker/index.ts` — `/api/event`, `/api/waitlist`, `/api/profile`, `/api/stats`, `/api/export.csv`, `/healthz`, validation. `worker/store.ts` — D1 queries.
- `migrations/` — D1 schema. Change it with a new numbered file, never by editing an applied one.
- `wrangler.jsonc` — bindings (`DB`, `EVENT_LIMIT`, `JOIN_LIMIT`), the `STATS_TOKEN` secret, and which paths run the Worker. `public/_headers` — CSP and caching for pages and assets.

## Commands

```bash
npm run dev         # pages + Worker + local D1 with hot reload (needs .dev.vars and npm run db:migrate once)
npm test            # Worker tests in the Workers runtime
npm run build       # typecheck (app + worker) + vite build
```

After changing `worker/`, run `npm test`; after any change, run `npm run build`. After changing `wrangler.jsonc`, `npm run typecheck` regenerates `worker-configuration.d.ts`.

## Rules that keep the experiment valid

- Variants differ only in **copy**, never in layout or form — otherwise the test measures design, not positioning. New copy goes into `copy.ts`; components stay variant-agnostic.
- A Visitor keeps their first Variant (`localStorage`). `?v=` assigns only new Visitors (Forced) and switches only Internal browsers; Forced traffic is excluded from the default A/B view. Don't change assignment or counting in a way that mixes the two.
- `?notrack` makes a browser Internal: no events, Signups stored with `test = 1` and excluded from stats.
- Conversion = Signups ÷ Visitors, where a Visitor is a distinct `visitor` id with a `view` event and a Signup counts only if its Visitor was seen. If you add an event type, keep that definition.
- The Finish line (600 Visitors per Variant or 4 weeks) is fixed; don't move it or let `/stats` call a winner earlier.
- Changing copy mid-test starts a new Period — mention the `Since` filter to the user.

## Conventions

- Stay inside the free plan: pages and assets must not run the Worker (`run_worker_first` lists only the API), and each Worker request stays within 10 ms of CPU. Rate limits are per location and approximate.
- The frontend is self-contained: no third-party scripts, fonts or analytics (CSP in `public/_headers` is `default-src 'self'`).
- Colors come from CSS tokens in `src/shared/base.css`, with a dark-mode set; use tokens, not literal colors (only shadows and the dialog backdrop use `rgb()`).
- TypeScript is pinned to 5.9: `vue-tsc` does not run on TypeScript 7 yet.
- CSV export neutralises spreadsheet formulas; keep that when adding columns.
- Commits follow Conventional Commits; git hooks reject AI co-author trailers.
