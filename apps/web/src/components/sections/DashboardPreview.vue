<script setup lang="ts">
import LogRow from '@/components/features/LogRow.vue'

const rows = [
  { ts: '2024-03-15 10:23:49', level: 'FATAL' as const, service: 'worker',   message: 'Out of memory',          meta: '' },
  { ts: '2024-03-15 10:23:46', level: 'ERROR' as const, service: 'api',      message: 'DB timeout',             meta: '{ duration_ms: 5012 }' },
  { ts: '2024-03-15 10:23:45', level: 'INFO'  as const, service: 'payments', message: 'Payment processed',      meta: '{ amount: 4200 }' },
  { ts: '2024-03-15 10:23:44', level: 'WARN'  as const, service: 'api',      message: 'Rate limit at 80%',      meta: '{ token: "bnd_••••" }' },
  { ts: '2024-03-15 10:23:43', level: 'DEBUG' as const, service: 'api',      message: 'Cache miss',             meta: '{ key: "user:42" }' },
  { ts: '2024-03-15 10:23:41', level: 'INFO'  as const, service: 'api',      message: 'Database connected',     meta: '{ host: "db.prod" }' },
  { ts: '2024-03-15 10:23:41', level: 'INFO'  as const, service: 'api',      message: 'Server started',         meta: '{ port: 3000 }' },
]
</script>

<template>
  <section id="dashboard" class="preview">
    <div class="preview__inner">
      <div class="preview__header">
        <p class="preview__eyebrow">Dashboard preview</p>
        <h2 class="preview__title">The whole picture, at a glance</h2>
        <p class="preview__sub">
          Filter by service, level, or time range. Search across all fields.
          Click any row for a permalink.
        </p>
      </div>

      <div class="preview__window">
        <div class="preview__toolbar">
          <div class="preview__toolbar-left">
            <div class="preview__filter">All services</div>
            <div class="preview__filter">All levels</div>
            <div class="preview__search">
              <span class="preview__search-icon">⌕</span>
              <span class="preview__search-placeholder">Search logs…</span>
            </div>
          </div>
          <div class="preview__live">
            <span class="preview__live-dot" />
            Live
          </div>
        </div>

        <div class="preview__table-head">
          <span>Timestamp</span>
          <span>Level</span>
          <span>Service</span>
          <span>Message</span>
          <span>Meta</span>
        </div>

        <div class="preview__rows">
          <LogRow
            v-for="(row, i) in rows"
            :key="i"
            :ts="row.ts"
            :level="row.level"
            :service="row.service"
            :message="row.message"
            :meta="row.meta"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.preview {
  padding: 96px 24px;
  background: var(--page);
}

.preview__inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 48px;
}

.preview__header {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 540px;
}

.preview__eyebrow {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--brand);
}

.preview__title {
  font-family: var(--font-ui);
  font-size: clamp(28px, 3vw, 40px);
  font-weight: 600;
  letter-spacing: -0.03em;
  color: var(--text);
  line-height: 1.15;
}

.preview__sub {
  font-size: 15px;
  color: var(--muted);
  line-height: 1.65;
}

.preview__window {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 32px 80px rgba(0, 0, 0, 0.4);
}

.preview__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border);
  gap: 12px;
  flex-wrap: wrap;
}

.preview__toolbar-left {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.preview__filter {
  font-family: var(--font-ui);
  font-size: 13px;
  color: var(--muted);
  background: var(--elevated);
  border: 1px solid var(--border);
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
}

.preview__search {
  display: flex;
  align-items: center;
  gap: 6px;
  background: var(--elevated);
  border: 1px solid var(--border);
  border-radius: 5px;
  padding: 5px 10px;
  min-width: 200px;
}

.preview__search-icon { color: var(--muted); font-size: 16px; }

.preview__search-placeholder {
  font-family: var(--font-ui);
  font-size: 13px;
  color: var(--muted);
}

.preview__live {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 500;
  color: var(--brand);
}

.preview__live-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--brand);
  animation: pulse 2s ease infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.5; transform: scale(0.8); }
}

.preview__table-head {
  display: grid;
  grid-template-columns: 140px 60px 90px 1fr auto;
  gap: 12px;
  padding: 6px 16px;
  font-family: var(--font-ui);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--muted);
  border-bottom: 1px solid var(--border);
  background: var(--elevated);
}

.preview__rows { background: var(--surface); }
</style>
