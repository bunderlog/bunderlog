# bunderlog — positioning-experiment landing page

One landing page, three positionings, a waitlist and a stats page.
The goal is to find out which positioning converts visitors into waitlist signups best, before building the product.

| Variant | Positioning | Audience |
|---|---|---|
| **A** | Flight recorder for AI agents — a tamper-evident record of what agents did | teams putting AI agents into production |
| **B** | Enterprise-ready audit logs API for SaaS | B2B SaaS selling to enterprise |
| **C** | All your logs, one bundle — a single log timeline | developers, DevOps |

Stack: **Vue 3 + TypeScript + Vite** (landing and `/stats`) and a **Cloudflare Worker + D1** (the API and its SQLite database). It runs entirely on Cloudflare's free plan.

## How the experiment works

- A new visitor is randomly assigned variant A, B or C. The variant is kept in `localStorage`, so a returning visitor sees the same one.
- Two events are recorded: `view` (a unique visitor) and `engage` (focusing the email field or clicking a CTA). Conversion is signups ÷ visitors, and a signup counts only if its visitor sent a `view`.
- The traffic source comes from the first touch: `utm_source`, `?ref=` or the referrer's domain.
- After signing up, visitors get an optional survey: role, team size and "how do you handle this today?". The question is different for each variant.
- Bots are filtered out of the events by User-Agent. The form is protected by a honeypot and a per-IP rate limit.

### Service URL parameters

| URL | What it does |
|---|---|
| `/?v=a` | assigns a new visitor to a variant (for targeted ads); a visitor who already has one keeps it. These visits are **excluded** from the A/B by default; `/stats` shows them under the "Forced" filter |
| `/?notrack` | marks your browser as internal: no events are sent, signups are kept but not counted. Undo with `/?track` |
| `/?notrack&v=b` | view a specific variant without polluting the stats; an internal browser can switch variants freely |

### Stats

`/stats` asks for the token (`STATS_TOKEN`) and shows:
- conversion per variant with a 95% confidence interval (Wilson) and the probability that each variant is best (Bayesian, Beta-Binomial);
- progress toward the finish line (600 visitors per variant or 4 weeks, whichever comes first) and, once it's reached, the verdict;
- a breakdown by traffic source, the survey answers and a CSV export of the waitlist.

## Running locally

Requires Node 24+.

```bash
npm install
echo STATS_TOKEN=dev > .dev.vars   # local secret for /stats
npm run db:migrate                 # create tables in the local D1 (.wrangler/)
npm run dev                        # pages + API with hot reload, http://localhost:5173
npm test                           # API tests, run inside the Workers runtime
npm run build                      # typecheck + build to dist/
```

## Deployment

Pages and assets are served by Cloudflare directly and are free and unlimited. Only `/api/*` and `/healthz` run the Worker, which the free plan allows 100,000 times a day (each visitor makes 2–4 API calls). D1's free plan allows 5M rows read and 100k rows written a day; past a limit, the API fails until the next day. Each `/stats` load reads every event a few times, so it's the heaviest query.

It is live at https://bunderlog.com (and `www.`), with the D1 database `bunderlog`. Both are set in `wrangler.jsonc`: the domains as the Worker's custom domains, the database by id.

`npm run deploy` ships a new version. A new migration in `migrations/` goes out with `npx wrangler d1 migrations apply bunderlog --remote` before the deploy. Logs: `npx wrangler tail` or the Worker's Observability tab. A backup: `npx wrangler d1 export bunderlog --remote --output backup.sql`. A new stats token: `openssl rand -hex 24 | npx wrangler secret put STATS_TOKEN`.

A deletion request (the footer promises one via `hello@`): erase the person's details but keep the anonymous row, so Conversion doesn't change after the fact:

```bash
npx wrangler d1 execute bunderlog --remote --command \
  "UPDATE waitlist SET email = 'erased-' || token, pain = NULL WHERE email = 'person@example.com'"
```

The rate limits (6 signups and 120 events a minute per IP) are counted per Cloudflare location and are approximate: enough to stop a script, not an exact count.

## Driving traffic so the comparison is fair

Where to post, tagged links per source, ready-to-use texts and the search test are in [TRAFFIC.md](TRAFFIC.md). The rules that keep the comparison fair:

1. **For the A/B test, link to the site root without `?v=`**, tagged per source (`/?utm_source=reddit&utm_campaign=r-devops`). Only then is every source split evenly between the variants.
2. **Keep post and ad texts neutral.** A text that pitches one positioning sends most of its readers to a page about another.
3. **Read the result only at the finish line.** 600 visitors per variant is enough to see a large difference (say 5% vs 2%); 5% vs 3% would need about 1,500 and 3% vs 2% about 3,800, so a close race ends in "no clear winner" and the survey and interviews decide.
4. **Test a variant on "its own" audience separately**, with `?v=a` links. Look at that data through the "Forced" filter and don't mix it into the A/B.
5. **Look beyond conversion.** Who signs up (roles, team size) and what they write in "how do you handle this today" is material for interviews. Reach out to the first 10–20 signups.

## Changing the name or the copy

All copy lives in [src/shared/copy.ts](src/shared/copy.ts). The name and domain are the `BRAND` and `DOMAIN` constants at the top of that file. The name is also hardcoded in `index.html` (placeholder title, description, link-preview tags and noscript text with the contact email) and in the link-preview image: edit `design/og.html` and re-render `public/og.png` with the command at its top. The icon is in `src/landing/LogoMark.vue`, with a static copy in `public/favicon.svg`. Internal names (Worker, D1 database, CSV file name) don't need to change.

If you change the copy of a test that is already running, start a new period: `/stats` has a "Since" filter.

## License

[MIT](LICENSE.md)
