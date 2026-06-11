<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import LogLevelBadge from '@/components/ui/LogLevelBadge.vue'

type Level = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL'

interface LogLine {
  ts: string
  level: Level
  service: string
  msg: string
  meta: string
}

const ALL_LINES: LogLine[] = [
  { ts: '10:23:41.204', level: 'INFO',  service: 'api',      msg: 'Server started',     meta: '{ port: 3000 }' },
  { ts: '10:23:41.891', level: 'INFO',  service: 'api',      msg: 'Database connected', meta: '{ host: "db.prod" }' },
  { ts: '10:23:43.112', level: 'DEBUG', service: 'api',      msg: 'Cache miss',          meta: '{ key: "user:42" }' },
  { ts: '10:23:44.001', level: 'WARN',  service: 'api',      msg: 'Rate limit at 80%',  meta: '{ token: "bnd_••••" }' },
  { ts: '10:23:45.332', level: 'INFO',  service: 'payments', msg: 'Payment processed',  meta: '{ amount: 4200 }' },
  { ts: '10:23:46.891', level: 'ERROR', service: 'api',      msg: 'DB timeout',         meta: '{ duration_ms: 5012 }' },
  { ts: '10:23:48.001', level: 'INFO',  service: 'auth',     msg: 'User login',         meta: '{ userId: "usr_abc1" }' },
  { ts: '10:23:49.445', level: 'FATAL', service: 'worker',   msg: 'Out of memory',      meta: '' },
]

const visibleLines = ref<LogLine[]>([])
let index = 0
let timer: ReturnType<typeof setInterval>

onMounted(() => {
  timer = setInterval(() => {
    const line = ALL_LINES.at(index)
    if (line !== undefined) {
      index++
      visibleLines.value = [...visibleLines.value, line]
    } else {
      index = 0
      visibleLines.value = []
    }
  }, 750)
})

onUnmounted(() => { clearInterval(timer) })
</script>

<template>
  <div class="bg-elevated border border-border rounded-[10px] overflow-hidden shadow-terminal font-mono text-[13px] w-full max-w-[640px]">
    <!-- chrome -->
    <div class="flex items-center gap-1.5 px-3.5 py-2.5 bg-surface border-b border-border">
      <span class="w-3 h-3 rounded-full bg-[#ff5f57]" />
      <span class="w-3 h-3 rounded-full bg-[#febc2e]" />
      <span class="w-3 h-3 rounded-full bg-[#28c840]" />
      <span class="flex-1 text-center font-ui text-[12px] text-muted mr-9">bunderlog — live tail</span>
    </div>
    <!-- body -->
    <div class="p-3.5 min-h-[200px] flex flex-col gap-[5px]">
      <div
        v-for="(line, i) in visibleLines"
        :key="i"
        class="flex items-baseline gap-2.5 animate-fade-in"
      >
        <span class="text-muted text-[12px] shrink-0">{{ line.ts }}</span>
        <LogLevelBadge :level="line.level" />
        <span class="text-brand min-w-[64px] text-[12px]">{{ line.service }}</span>
        <span class="text-fg">{{ line.msg }}</span>
        <span v-if="line.meta" class="text-muted text-[12px]">{{ line.meta }}</span>
      </div>
      <div class="w-2 h-3.5 bg-brand opacity-70 animate-blink mt-1" />
    </div>
  </div>
</template>
