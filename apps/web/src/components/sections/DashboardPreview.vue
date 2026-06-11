<script setup lang="ts">
import LogRow from '@/components/features/LogRow.vue'

const rows = [
  { ts: '2024-03-15 10:23:49', level: 'FATAL' as const, service: 'worker',   message: 'Out of memory',       meta: '' },
  { ts: '2024-03-15 10:23:46', level: 'ERROR' as const, service: 'api',      message: 'DB timeout',          meta: '{ duration_ms: 5012 }' },
  { ts: '2024-03-15 10:23:45', level: 'INFO'  as const, service: 'payments', message: 'Payment processed',   meta: '{ amount: 4200 }' },
  { ts: '2024-03-15 10:23:44', level: 'WARN'  as const, service: 'api',      message: 'Rate limit at 80%',   meta: '{ token: "bnd_••••" }' },
  { ts: '2024-03-15 10:23:43', level: 'DEBUG' as const, service: 'api',      message: 'Cache miss',          meta: '{ key: "user:42" }' },
  { ts: '2024-03-15 10:23:41', level: 'INFO'  as const, service: 'api',      message: 'Database connected',  meta: '{ host: "db.prod" }' },
  { ts: '2024-03-15 10:23:41', level: 'INFO'  as const, service: 'api',      message: 'Server started',      meta: '{ port: 3000 }' },
]
</script>

<template>
  <section id="dashboard" class="py-24 px-6 bg-page">
    <div class="max-w-[1200px] mx-auto flex flex-col gap-12">

      <div class="flex flex-col gap-3 max-w-[540px]">
        <p class="text-[11px] font-semibold tracking-[0.12em] uppercase text-brand">Dashboard preview</p>
        <h2 class="font-ui font-semibold text-section tracking-[-0.03em] leading-[1.15] text-fg">
          The whole picture, at a glance
        </h2>
        <p class="text-[15px] text-muted leading-[1.65]">
          Filter by service, level, or time range. Search across all fields.
          Click any row for a permalink.
        </p>
      </div>

      <div class="bg-surface border border-border rounded-xl overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.4)]">
        <!-- toolbar -->
        <div class="flex items-center justify-between px-4 py-3 border-b border-border gap-3 flex-wrap">
          <div class="flex items-center gap-2 flex-wrap">
            <div class="font-ui text-[13px] text-muted bg-elevated border border-border rounded-[5px] px-2.5 py-[5px]">All services</div>
            <div class="font-ui text-[13px] text-muted bg-elevated border border-border rounded-[5px] px-2.5 py-[5px]">All levels</div>
            <div class="flex items-center gap-1.5 bg-elevated border border-border rounded-[5px] px-2.5 py-[5px] min-w-[200px]">
              <span class="text-muted text-base">⌕</span>
              <span class="font-ui text-[13px] text-muted">Search logs…</span>
            </div>
          </div>
          <div class="flex items-center gap-1.5 text-[13px] font-medium text-brand">
            <span class="w-[7px] h-[7px] rounded-full bg-brand animate-pulse" />
            Live
          </div>
        </div>

        <!-- table head -->
        <div class="grid grid-log-cols gap-3 px-4 py-1.5 font-ui text-[11px] font-semibold tracking-[0.06em] uppercase text-muted border-b border-border bg-elevated">
          <span>Timestamp</span>
          <span>Level</span>
          <span>Service</span>
          <span>Message</span>
          <span>Meta</span>
        </div>

        <!-- rows -->
        <div class="bg-surface">
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
