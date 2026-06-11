<script setup lang="ts">
defineProps<{ level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL' }>()
</script>

<template>
  <span :class="['badge', `badge--${level.toLowerCase()}`]">{{ level }}</span>
</template>

<style scoped>
.badge {
  display: inline-block;
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.04em;
  padding: 2px 6px;
  border-radius: 3px;
  line-height: 1.6;
}

.badge--debug { color: var(--level-debug); background: rgba(136, 135, 128, 0.12); }
.badge--info  { color: var(--level-info);  background: rgba(93, 202, 165, 0.12);  }
.badge--warn  { color: var(--level-warn);  background: rgba(239, 159, 39, 0.12);  }
.badge--error { color: var(--level-error); background: rgba(226, 75, 74, 0.12);   }
.badge--fatal { color: var(--level-fatal); background: rgba(240, 149, 149, 0.15); }
</style>
