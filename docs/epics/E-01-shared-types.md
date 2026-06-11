# E-01: Shared Types

**Package:** `packages/types`
**Status:** planned
**Priority:** P0 — blocks all other epics

## Goal

Define the canonical TypeScript types shared across `ingest`, `consumer`, `query-api`, and `sdk` so every package speaks the same schema.

## User Stories

- **US-01-1:** As a backend developer, I want a single `LogEntry` type so I don't duplicate or drift the schema across workers.
- **US-01-2:** As an SDK author, I want `IngestPayload` and `LogLevel` exported from one package so the SDK can reference them without copying.
- **US-01-3:** As a contributor, I want compile-time enforcement of valid log levels so invalid values are caught before runtime.

## Tasks

- [ ] Scaffold `packages/types` — `package.json`, `tsconfig.json`, `src/index.ts`
- [ ] Define `LogLevel` — `'debug' | 'info' | 'warn' | 'error' | 'fatal'`
- [ ] Define `LogEntry` — matches the D1 schema columns
- [ ] Define `IngestPayload` — the request body shape accepted by the ingest worker
- [ ] Define `LogsQueryParams` — filter params for `GET /logs`
- [ ] Define `StatsResponse` — shape returned by `GET /stats`
- [ ] Add to Turborepo `build` pipeline and workspace dependencies
- [ ] Write unit tests for type guards (if any runtime validators are included)
