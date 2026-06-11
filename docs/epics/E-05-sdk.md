# E-05: TypeScript SDK

**Package:** `packages/sdk`
**Status:** planned
**Priority:** P2 — parallel with E-04
**Depends on:** E-01, E-02

## Goal

A zero-dependency TypeScript SDK that works in Node.js and the browser. Buffers log entries locally and flushes them in batches to the ingest worker.

## User Stories

- **US-05-1:** As a Node.js developer, I want `logger({ endpoint, token, service })` to return a leveled logger so I can start shipping logs in under a minute.
- **US-05-2:** As a developer, I want automatic batching so I don't have to manage HTTP calls manually.
- **US-05-3:** As a developer, I want `await log.flush()` on SIGTERM so no logs are lost on graceful shutdown.
- **US-05-4:** As a browser developer, I want the SDK to work without Node.js built-ins so I can use it in frontend apps.
- **US-05-5:** As a developer, I want typed metadata (`log.info('msg', { key: value })`) so I get autocomplete on the meta field.

## Tasks

- [ ] Scaffold `packages/sdk` — `package.json`, `tsconfig.json`, `src/index.ts`
- [ ] Implement `logger(config)` factory — returns `{ debug, info, warn, error, fatal, flush }`
- [ ] Internal buffer: queue entries up to `batchSize` (default 20)
- [ ] Flush on size threshold (`batchSize`) and time interval (`flushMs`, default 2000ms)
- [ ] `flush()`: drain buffer, POST to `/ingest`, await response
- [ ] Retry with exponential backoff on 5xx / network error (max 3 attempts)
- [ ] No-op gracefully if `endpoint` or `token` is missing (warn to console, don't throw)
- [ ] Build to ESM + CJS dual output
- [ ] Write unit tests (Vitest, jsdom for browser path)
- [ ] Add to Turborepo `build` pipeline
