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
  <div class="grid grid-log-cols gap-3 items-center px-4 py-2 border-b border-border last:border-b-0 font-mono text-[12px] transition-colors duration-100 hover:bg-elevated">
    <span class="text-muted">{{ ts }}</span>
    <LogLevelBadge :level="level" />
    <span class="text-brand">{{ service }}</span>
    <span class="text-fg overflow-hidden text-ellipsis whitespace-nowrap">{{ message }}</span>
    <span v-if="meta" class="text-muted">{{ meta }}</span>
  </div>
</template>
