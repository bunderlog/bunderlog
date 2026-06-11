# E-03: Consumer Worker

**App:** `apps/consumer`
**Status:** planned
**Priority:** P1 — parallel with E-02
**Depends on:** E-01

## Goal

A Cloudflare Worker that consumes batches from CF Queues and persists them to D1 (hot storage), R2 (archive), and KV (counters). Runs automatically on queue delivery — no HTTP surface.

## User Stories

- **US-03-1:** As an operator, I want log entries written to D1 so the dashboard can query recent logs.
- **US-03-2:** As an operator, I want raw NDJSON archived to R2 so logs are retained beyond the 30-day D1 window.
- **US-03-3:** As an operator, I want per-service and per-level counters maintained in KV so the stats API is fast without hitting D1.
- **US-03-4:** As an operator, I want failed batches retried automatically so transient D1 errors don't lose data.

## Tasks

- [ ] Scaffold `apps/consumer` — `wrangler.toml`, `package.json`, `tsconfig.json`
- [ ] Implement queue batch handler (`queue` export)
- [ ] Parse and validate each message in the batch
- [ ] D1: bulk INSERT using prepared statements (batch of up to 100 per statement)
- [ ] R2: append entries to `YYYY/MM/DD/HH.ndjson` object
- [ ] KV: increment `count:{service}`, `count:{level}`, `count:total` with TTL 60s
- [ ] Dead-letter handling: log failed messages to console / separate R2 path
- [ ] Run D1 migration script: apply schema from `CLAUDE.md`
- [ ] Add `@cloudflare/vitest-pool-workers` and write unit tests
- [ ] Configure CI pipeline step for `apps/consumer`
