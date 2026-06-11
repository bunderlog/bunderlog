<script setup lang="ts">
import LogLevelBadge from '@/components/ui/LogLevelBadge.vue'

defineProps<{
  ts: string
  level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL'
  service: string
  message: string
  meta?: string
}>()
</script>

<template>
  <div class="row">
    <span class="row__ts">{{ ts }}</span>
    <LogLevelBadge :level="level" />
    <span class="row__svc">{{ service }}</span>
    <span class="row__msg">{{ message }}</span>
    <span v-if="meta" class="row__meta">{{ meta }}</span>
  </div>
</template>

<style scoped>
.row {
  display: grid;
  grid-template-columns: 140px 60px 90px 1fr auto;
  gap: 12px;
  align-items: center;
  padding: 8px 16px;
  border-bottom: 1px solid var(--border);
  font-family: var(--font-mono);
  font-size: 12px;
  transition: background 0.1s;
}

.row:last-child { border-bottom: none; }
.row:hover { background: var(--elevated); }

.row__ts   { color: var(--muted); }
.row__svc  { color: var(--brand); }
.row__msg  { color: var(--text);  overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.row__meta { color: var(--muted); }
</style>
