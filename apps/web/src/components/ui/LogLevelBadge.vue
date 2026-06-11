<script setup lang="ts">
const props = defineProps<{ level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL' }>()

const CLASSES: Record<string, string> = {
  DEBUG: 'text-debug bg-debug/10',
  INFO:  'text-info  bg-info/10',
  WARN:  'text-warn  bg-warn/10',
  ERROR: 'text-error bg-error/10',
  FATAL: 'text-fatal bg-fatal/[.15]',
}
</script>

<template>
  <span
    :class="[
      'inline-block font-mono text-[10px] font-medium tracking-[0.04em] px-1.5 py-0.5 rounded-[3px] leading-[1.6]',
      CLASSES[props.level],
    ]"
  >{{ level }}</span>
</template>
