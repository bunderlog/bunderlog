# E-06: Dashboard

**App:** `apps/web` (dashboard routes)
**Status:** planned
**Priority:** P3 — requires E-04
**Depends on:** E-01, E-04

## Goal

A Vue 3 dashboard served from Cloudflare Pages. Shows a filterable, searchable log table with infinite scroll, a live tail mode, and a time-series chart of log volume by level.

## User Stories

- **US-06-1:** As a user, I want to see a real-time log table so I can monitor my services without a terminal.
- **US-06-2:** As a user, I want to filter by service and level so I can focus on what matters.
- **US-06-3:** As a user, I want full-text search with debounce so I can find specific log messages quickly.
- **US-06-4:** As a user, I want infinite scroll so I can browse historical logs without pagination clicks.
- **US-06-5:** As a user, I want a live tail toggle so I can watch logs stream in real time.
- **US-06-6:** As a user, I want a time-series chart of log volume so I can spot spikes at a glance.
- **US-06-7:** As a user, I want to click a log row and get a permalink so I can share a specific entry.

## Tasks

- [ ] Add `/dashboard` route to Vue Router
- [ ] `stores/logsStore.ts` — Pinia store: fetch, paginate, filter state
- [ ] `composables/useLogSearch.ts` — debounced search input (300ms)
- [ ] `composables/useLiveTail.ts` — SSE client wrapping `EventSource`, auto-reconnect
- [ ] `composables/useScrollFade.ts` — IntersectionObserver for infinite scroll trigger
- [ ] `DashboardView.vue` — layout: filter bar + log table + chart
- [ ] `LogTable.vue` — virtualized list of `LogRow` components
- [ ] `FilterBar.vue` — service dropdown, level multi-select, date range, search input
- [ ] `StatsChart.vue` — Chart.js time-series widget (log volume per level, last 1h)
- [ ] `LogDetailPanel.vue` — slide-in panel with full entry + permalink copy button
- [ ] Add `Chart.js` + `vue-chartjs` dependencies
- [ ] Add `VueUse` for IntersectionObserver, debounce utilities
- [ ] Write component tests with `@vue/test-utils`
