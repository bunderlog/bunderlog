# E-02: Ingest Worker

**App:** `apps/ingest`
**Status:** planned
**Priority:** P1 — first backend component
**Depends on:** E-01

## Goal

A Cloudflare Worker that is the single HTTP entry point for log ingestion. It authenticates the caller, validates and enriches the payload, and sends it to CF Queues for async processing.

## User Stories

- **US-02-1:** As a developer, I want to POST log entries to `/ingest` with a token in `X-Log-Token` so my app can send logs without complex setup.
- **US-02-2:** As a developer, I want to send up to 500 log entries in one batch so I can reduce HTTP overhead.
- **US-02-3:** As an operator, I want invalid payloads rejected with a clear error so I can debug misconfigured clients quickly.
- **US-02-4:** As an operator, I want geo metadata (IP, country, ray ID) attached automatically so I don't need to send it from clients.
- **US-02-5:** As an operator, I want rate limiting enforced so a single misbehaving client can't flood the system.

## Tasks

- [ ] Scaffold `apps/ingest` — `wrangler.toml`, `package.json`, `tsconfig.json`
- [ ] Implement `POST /ingest` handler
- [ ] Auth: validate `X-Log-Token` header against env secret
- [ ] Schema validation: require `service`, `level`, `message` per entry; reject unknown levels
- [ ] Batch support: accept array of up to 500 entries
- [ ] Geo-enrichment: attach `ip`, `country`, `colo`, `ray` from `request.cf`
- [ ] Queue: call `env.QUEUE.sendBatch()` with validated entries
- [ ] Rate limiting: wire CF RateLimiter binding
- [ ] Error responses: structured JSON `{ error, code }` with correct HTTP status codes
- [ ] Add `@cloudflare/vitest-pool-workers` and write unit tests
- [ ] Configure CI pipeline step for `apps/ingest`
