# CLAUDE.md — Bunderlog

This file is read by Claude automatically at the start of every session.
Update it when architectural decisions or priorities change.

---

## What is Bunderlog

A centralized log management system built entirely on the Cloudflare edge platform.
No third-party paid services. The MVP fits within Cloudflare's free tier limits.

**Name:** `bunderlog` = `bundle + log` + bandarlog (Kipling's monkeys that see
everything and never forget) + `be under log`

**Reference:** Papertrail (https://betterstack.com/log-management) — simplicity, live tail, speed to value.
**Competitor to analyze:** LogStream (https://logstream.tech/).

---

## Monorepo — Structure

> Apps marked `[planned]` do not yet exist in the repository.

```
bunderlog/
├── apps/
│   ├── web/              # Vue 3 + Vite → deploy to CF Pages  (exists)
│   ├── ingest/           # CF Worker — log ingestion          [planned]
│   ├── consumer/         # CF Worker — write to storage       [planned]
│   └── query-api/        # CF Worker — REST API for dashboard [planned]
├── packages/
│   ├── types/            # Shared TypeScript types            [planned]
│   └── sdk/              # TypeScript SDK (Node.js + Browser) [planned]
├── tools/
│   └── merge-coverage.mjs
├── turbo.json
├── package.json          # root — Bun workspaces
└── CLAUDE.md
```

---

## Tech Stack

### Runtime and Deployment

- **Cloudflare Workers** — all server-side components (not Node.js runtime)
- **Cloudflare D1** — SQLite on the edge, hot log storage (30 days)
- **Cloudflare R2** — object storage, raw NDJSON archive (forever)
- **Cloudflare Queues** — buffer between ingest and consumer
- **Cloudflare KV** — aggregates and counters (TTL 60s)
- **Cloudflare Pages** — dashboard hosting

### Frontend

- **Vue 3** (beta channel) with `<script setup>` and Composition API
- **Vite 8** — bundler
- **Pinia** — state management
- **Vue Router 5** — navigation
- **VueUse** — composable utilities
- **Chart.js + vue-chartjs** — charts

### Dev Tools

- **Bun** — package manager and runtime for tooling
- **Turborepo** — monorepo orchestration
- **TypeScript 6** — everywhere, including Workers
- **oxlint** — linter for `.ts` / `.js` files
- **oxfmt** — formatter (replaces Prettier entirely)
- **ESLint** — only for `*.vue` via `eslint-plugin-vue-modular`
- **Vitest** — tests; Workers packages use `@cloudflare/vitest-pool-workers`
- **husky + lint-staged** — pre-commit hooks

### CI/CD and Quality

- **GitHub Actions** — lint → test → deploy
- **Codacy** — static analysis + coverage
- **wrangler** — deploy Workers and manage CF resources

---

## Data Flow Architecture

```
Source (backend / browser / CF Tail Worker)
  ↓  POST /ingest  (header: X-Log-Token)
Ingest Worker
  — auth via X-Log-Token (env secret)
  — schema validation (service, level, message required)
  — geo-enrichment: ip, country, colo, ray (from request.cf)
  — rate limiting (CF RateLimiter binding)
  — batch: up to 500 records per request
  ↓  Queue.sendBatch()
CF Queues  (at-least-once, retry, DLQ)
  ↓  batch consumer
Consumer Worker
  — batch parsing
  — INSERT into D1 (prepared statements)
  — write raw NDJSON to R2 (path: YYYY/MM/DD/HH.ndjson)
  — increment counters in KV
  ↓
Query API Worker
  — GET /logs  (filters: service, level, from, to, q, cursor, limit)
  — GET /logs/:id  (permalink)
  — GET /stats  (aggregates from KV)
  — cursor-based pagination (not offset)
  ↓
Dashboard (Vue 3 on CF Pages)
  — log table with infinite scroll
  — live tail via SSE (EventSource → GET /tail)
  — filters, search with debounce
  — Chart.js time-series widget
```

---

## D1 Schema

```sql
CREATE TABLE logs (
  id         TEXT     PRIMARY KEY,  -- UUID v4
  ts         INTEGER  NOT NULL,     -- Unix ms, from client
  level      TEXT     NOT NULL,     -- debug|info|warn|error|fatal
  service    TEXT     NOT NULL,     -- max 64 characters
  message    TEXT     NOT NULL,     -- max 4096 characters
  meta       TEXT,                  -- arbitrary JSON data
  ip         TEXT,                  -- CF-Connecting-IP
  country    TEXT,                  -- ISO 2-letter code
  ray        TEXT,                  -- CF-Ray ID
  ingest_ts  INTEGER  NOT NULL      -- Unix ms, time received by the system
);

CREATE INDEX idx_ts        ON logs(ts DESC);
CREATE INDEX idx_level     ON logs(level);
CREATE INDEX idx_service   ON logs(service);
CREATE INDEX idx_svc_level ON logs(service, level, ts DESC);

-- Phase 2: full-text search
CREATE VIRTUAL TABLE logs_fts USING fts5(message, service, content=logs);
```

---

## Node.js SDK — Interface

```typescript
import { logger } from 'bunderlog'

const log = logger({
  endpoint: 'https://ingest.bunderlog.dev',
  token: process.env.LOG_TOKEN,
  service: 'my-api',
  batchSize: 20, // flush on size threshold
  flushMs: 2000, // flush on timeout
})

log.debug('Cache miss', { key: 'user:42' })
log.info('Server started', { port: 3000 })
log.warn('Rate limit at 80%', { token: 'bnd_••••' })
log.error('DB timeout', { duration_ms: 5000 })
log.fatal('OOM — process terminating')

// Graceful shutdown — call on SIGTERM
await log.flush()
```

---

## Design System

### Brand

| Token              | Hex       |
| ------------------ | --------- |
| Primary green      | `#1D9E75` |
| Green dark         | `#0F6E56` |
| Green tint (light) | `#E1F5EE` |
| Green deep (dark)  | `#04342C` |

### Log Level Colors

| Level | Hex                                        |
| ----- | ------------------------------------------ |
| DEBUG | `#888780` (grey)                           |
| INFO  | `#5DCAA5` (green)                          |
| WARN  | `#EF9F27` (amber)                          |
| ERROR | `#E24B4A` (red)                            |
| FATAL | `#F09595` (light red + background overlay) |

### Dark Theme (default)

| Token        | Hex       |
| ------------ | --------- |
| Page         | `#0F1117` |
| Surface      | `#1A1A1A` |
| Elevated     | `#242424` |
| Border       | `#333333` |
| Text primary | `#EFEFEF` |
| Text muted   | `#888780` |
| Brand / link | `#1D9E75` |

### Light Theme

| Token        | Hex       |
| ------------ | --------- |
| Page         | `#FFFFFF` |
| Surface      | `#F7F7F5` |
| Elevated     | `#EFEFED` |
| Border       | `#D3D1C7` |
| Text primary | `#1A1A1A` |
| Text muted   | `#888780` |
| Brand / link | `#1D9E75` |

### Typography

- **UI:** Geist Sans — navigation, headings, descriptions, buttons
- **Data:** Geist Mono — timestamps, IP, Ray ID, log messages, code
- **Rule:** never mix sans and mono within a single semantic block

### Logo

- Three horizontal lines of decreasing length, sharp corners (no border-radius)
- Wordmark: `bunder` (weight 400, dark) + `log` (weight 400, `#1D9E75`)
- Font: Geist / Inter, letter-spacing: -1px
- No tagline

---

## Vue 3 — Modular Structure (dashboard + landing)

> Landing page components are fully built. Dashboard components (`stores/`, remaining composables) are next.

```
apps/web/src/
├── components/
│   ├── layout/
│   │   └── LandingLayout.vue
│   ├── sections/             # landing page sections (one file = one section)
│   │   ├── AppNavbar.vue
│   │   ├── HeroSection.vue
│   │   ├── SocialProofBar.vue
│   │   ├── FeaturesSection.vue
│   │   ├── HowItWorksSection.vue
│   │   ├── DashboardPreview.vue
│   │   ├── CodeSection.vue
│   │   ├── PricingSection.vue
│   │   ├── NameStorySection.vue
│   │   ├── CtaSection.vue
│   │   └── AppFooter.vue
│   ├── ui/                   # atomic components with no business logic
│   │   ├── index.ts          # mandatory barrel export
│   │   ├── BaseButton.vue
│   │   ├── BrandLogo.vue     # switches dark/light src based on useTheme
│   │   ├── CompatTag.vue
│   │   ├── LogLevelBadge.vue
│   │   ├── SectionLabel.vue
│   │   ├── SectionTitle.vue
│   │   └── ThemeToggle.vue
│   ├── hero/
│   │   ├── TerminalPreview.vue
│   │   └── CtaButtons.vue
│   ├── pricing/
│   │   └── PricingCard.vue
│   └── features/
│       ├── FeatureCard.vue
│       ├── StepCard.vue
│       └── LogRow.vue
├── composables/              # all files must start with 'use'
│   ├── useTheme.ts           # dark/light toggle, module-level singleton
│   ├── useLiveTail.ts        # [planned] SSE log tail
│   ├── useLogSearch.ts       # [planned] debounced search
│   └── useScrollFade.ts      # [planned] scroll animation
├── stores/
│   └── logsStore.ts          # [planned]
└── App.vue
```

**Import rules:**

- `@/components/ui` — always via `index.ts`, never directly (`@/components/ui/BaseButton.vue` — forbidden)
- Cross-section imports — always via `@/` alias
- Within the same folder — relative `./`

---

## ESLint Configuration

> `eslint.config.js` and `.oxlintrc.json` are not yet created. The configs below
> are the intended target configuration.

```javascript
// eslint.config.js
import vueModular from 'eslint-plugin-vue-modular'

export default [
  ...vueModular.configs.recommended,
  {
    files: ['**/*.vue'],
    rules: {
      'vue-modular/sfc-order': 'error',
      'vue-modular/sfc-required': 'error',
      'vue/component-tags-order': 'off', // conflicts with sfc-order
    },
  },
]
```

```json
// .oxlintrc.json
{
  "jsPlugins": ["eslint-plugin-vue-modular"],
  "rules": {
    "vue-modular/file-component-naming": "error",
    "vue-modular/file-ts-naming": "error",
    "vue-modular/folder-kebab-case": "error",
    "vue-modular/shared-imports": "error",
    "vue-modular/app-imports": "error",
    "vue-modular/cross-imports-alias": "error",
    "vue-modular/shared-ui-index-required": "error",
    "vue-modular/stores-location": "error",
    "vue-modular/views-suffix": "error",
    "vue-modular/composable-filename-prefix": "error"
  }
}
```

---

## Coverage

```bash
# Run tests with coverage across all packages
bun run test:coverage

# Merge lcov files into one (rewrites SF: paths to root-relative)
bun run coverage:merge

# Upload to Codacy
bash <(curl -Ls https://coverage.codacy.com/get.sh) report \
  -l JavaScript -r coverage/lcov.info
```

**Important:** CF Workers packages use `provider: 'istanbul'` (not `v8`).
`v8` is incompatible with the `workerd` runtime.

**Codacy:** `coverage.ignoreFiles` in `.codacy.yml` does not work for coverage.
Filtering is done only in `tools/merge-coverage.mjs` via the `COVERAGE_IGNORE` array.

---

## Related Repositories

| Repo                                                | Description                            |
| --------------------------------------------------- | -------------------------------------- |
| `github.com/bunderlog/bunderlog`                    | Main monorepo                          |
| `github.com/andrewmolyuk/eslint-plugin-vue-modular` | ESLint plugin (author — project owner) |

### eslint-plugin-vue-modular — Planned Improvements

| Task                                                              | Priority |
| ----------------------------------------------------------------- | -------- |
| `no-direct-ui-import` — new rule                                  | P1       |
| `allow` option for `service/store-filename-no-suffix`             | P2       |
| `only` option for `components-index-required`                     | P2       |
| Refactor `internal-imports-relative` → two rules                  | P2       |
| Docs: conflict between `sfc-order` and `vue/component-tags-order` | P3       |
| Docs: differences from FSD                                        | P3       |

---

## Pricing (Planned)

| Plan       | Price     | Limits                                                 |
| ---------- | --------- | ------------------------------------------------------ |
| Hobby      | Free      | 500k logs/day, 30d retention, 1 service                |
| Team       | $12/month | 5M logs/day, 90d retention, unlimited services, alerts |
| Enterprise | Contact   | Unlimited, custom SLA, SSO/RBAC                        |

---

## Current Status and Next Steps

### Done

- [x] Tech stack selected and justified
- [x] Data flow architecture designed
- [x] Design system (colors, typography, logo)
- [x] Coverage pipeline with Codacy
- [x] Devcontainer for monorepo
- [x] Landing page — all Vue 3 components built (sections, ui, hero, features, pricing)
- [x] Tailwind CSS v4 migration (`@tailwindcss/vite`, CSS-first `@theme`)
- [x] Dark/light theme system (`useTheme`, `ThemeToggle`, `html.light` CSS variable overrides)
- [x] `BrandLogo` switches between dark/light SVG assets based on active theme

### Next Steps (priority)

1. `packages/types` — shared TypeScript types (`LogEntry`, `LogLevel`, `IngestPayload`)
2. `apps/ingest` — CF Worker: auth, validation, geo-enrichment, rate limiting, queue
3. `apps/consumer` — CF Worker: D1 insert, R2 archive, KV counters
4. `apps/query-api` — CF Worker: REST API with cursor pagination and SSE tail
5. `packages/sdk` — TypeScript SDK (Node.js + Browser)
