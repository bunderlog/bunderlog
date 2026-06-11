# E-04: Query API

**App:** `apps/query-api`
**Status:** planned
**Priority:** P2 — requires E-03 data to be useful
**Depends on:** E-01, E-03

## Goal

A Cloudflare Worker exposing the REST API consumed by the dashboard. Supports filtered log queries with cursor-based pagination, single-entry permalink, aggregated stats, and a live tail via SSE.

## User Stories

- **US-04-1:** As a dashboard user, I want to query logs filtered by service, level, and time range so I can investigate incidents.
- **US-04-2:** As a dashboard user, I want cursor-based pagination so infinite scroll works without offset drift.
- **US-04-3:** As a dashboard user, I want to deep-link to a single log entry so I can share it with teammates.
- **US-04-4:** As a dashboard user, I want aggregated stats (counts by level/service) so I can see health at a glance.
- **US-04-5:** As a dashboard user, I want a live tail that streams new entries in real time so I can watch logs as they arrive.

## Tasks

- [ ] Scaffold `apps/query-api` — `wrangler.toml`, `package.json`, `tsconfig.json`
- [ ] `GET /logs` — query D1 with filters: `service`, `level`, `from`, `to`, `q`, `cursor`, `limit`
- [ ] Cursor pagination: encode `(ts, id)` as opaque base64 cursor
- [ ] `GET /logs/:id` — single entry by UUID
- [ ] `GET /stats` — read aggregates from KV, fallback to D1 COUNT if KV miss
- [ ] `GET /tail` — SSE endpoint: poll D1 every second for entries newer than `lastSeenId`, stream as `data: {...}\n\n`
- [ ] CORS headers for `apps/web` origin
- [ ] Add `@cloudflare/vitest-pool-workers` and write unit tests
- [ ] Configure CI pipeline step for `apps/query-api`
