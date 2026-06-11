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
  { ts: '10:23:41.204', level: 'INFO',  service: 'api',      msg: 'Server started',       meta: '{ port: 3000 }' },
  { ts: '10:23:41.891', level: 'INFO',  service: 'api',      msg: 'Database connected',   meta: '{ host: "db.prod" }' },
  { ts: '10:23:43.112', level: 'DEBUG', service: 'api',      msg: 'Cache miss',            meta: '{ key: "user:42" }' },
  { ts: '10:23:44.001', level: 'WARN',  service: 'api',      msg: 'Rate limit at 80%',    meta: '{ token: "bnd_••••" }' },
  { ts: '10:23:45.332', level: 'INFO',  service: 'payments', msg: 'Payment processed',    meta: '{ amount: 4200 }' },
  { ts: '10:23:46.891', level: 'ERROR', service: 'api',      msg: 'DB timeout',           meta: '{ duration_ms: 5012 }' },
  { ts: '10:23:48.001', level: 'INFO',  service: 'auth',     msg: 'User login',           meta: '{ userId: "usr_abc1" }' },
  { ts: '10:23:49.445', level: 'FATAL', service: 'worker',   msg: 'Out of memory',        meta: '' },
]

const visibleLines = ref<LogLine[]>([])
let index = 0
let timer: ReturnType<typeof setInterval>

onMounted(() => {
  timer = setInterval(() => {
    if (index < ALL_LINES.length) {
      visibleLines.value = [...visibleLines.value, ALL_LINES[index++]!]
    } else {
      index = 0
      visibleLines.value = []
    }
  }, 750)
})

onUnmounted(() => clearInterval(timer))
</script>

<template>
  <div class="terminal">
    <div class="terminal__chrome">
      <span class="terminal__dot terminal__dot--red" />
      <span class="terminal__dot terminal__dot--yellow" />
      <span class="terminal__dot terminal__dot--green" />
      <span class="terminal__title">bunderlog — live tail</span>
    </div>
    <div class="terminal__body">
      <div
        v-for="(line, i) in visibleLines"
        :key="i"
        class="terminal__line"
      >
        <span class="terminal__ts">{{ line.ts }}</span>
        <LogLevelBadge :level="line.level" />
        <span class="terminal__svc">{{ line.service }}</span>
        <span class="terminal__msg">{{ line.msg }}</span>
        <span v-if="line.meta" class="terminal__meta">{{ line.meta }}</span>
      </div>
      <div class="terminal__cursor" />
    </div>
  </div>
</template>

<style scoped>
.terminal {
  background: var(--elevated);
  border: 1px solid var(--border);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 0 0 1px rgba(29, 158, 117, 0.15), 0 24px 64px rgba(0, 0, 0, 0.5);
  font-family: var(--font-mono);
  font-size: 13px;
  width: 100%;
  max-width: 640px;
}

.terminal__chrome {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 14px;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
}

.terminal__dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}
.terminal__dot--red    { background: #ff5f57; }
.terminal__dot--yellow { background: #febc2e; }
.terminal__dot--green  { background: #28c840; }

.terminal__title {
  flex: 1;
  text-align: center;
  font-family: var(--font-ui);
  font-size: 12px;
  color: var(--muted);
  letter-spacing: 0;
  margin-right: 36px;
}

.terminal__body {
  padding: 14px 16px;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.terminal__line {
  display: flex;
  align-items: baseline;
  gap: 10px;
  animation: fade-in 0.2s ease;
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(4px); }
  to   { opacity: 1; transform: translateY(0); }
}

.terminal__ts   { color: var(--muted); font-size: 12px; flex-shrink: 0; }
.terminal__svc  { color: var(--brand); min-width: 64px; font-size: 12px; }
.terminal__msg  { color: var(--text); }
.terminal__meta { color: var(--muted); font-size: 12px; }

.terminal__cursor {
  width: 8px;
  height: 14px;
  background: var(--brand);
  opacity: 0.7;
  animation: blink 1s step-end infinite;
  margin-top: 4px;
}

@keyframes blink {
  0%, 100% { opacity: 0.7; }
  50%       { opacity: 0; }
}
</style>
