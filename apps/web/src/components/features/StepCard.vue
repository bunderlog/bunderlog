<script setup lang="ts">
defineProps<{ step: number; title: string; description: string; code?: string }>()
</script>

<template>
  <div class="flex gap-5 items-start">
    <div class="shrink-0 w-9 h-9 rounded-full bg-brand-deep border border-brand text-brand text-sm font-semibold flex items-center justify-center mt-0.5">
      {{ step }}
    </div>
    <div class="flex flex-col gap-2">
      <h3 class="font-ui text-base font-semibold text-fg tracking-[-0.02em]">{{ title }}</h3>
      <p class="text-sm text-muted leading-relaxed">{{ description }}</p>
      <pre v-if="code" class="bg-elevated border border-border rounded-md px-3.5 py-2.5 font-mono text-[13px] text-brand overflow-x-auto whitespace-pre"><code>{{ code }}</code></pre>
    </div>
  </div>
</template>
