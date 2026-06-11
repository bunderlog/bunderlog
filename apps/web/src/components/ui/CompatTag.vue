<script setup lang="ts">
defineProps<{ label: string }>()
</script>

<template>
  <span class="inline-flex items-center gap-1.5 font-ui text-[13px] font-medium text-muted bg-elevated border border-border rounded-full px-3 py-1 whitespace-nowrap">
    <span class="w-1.5 h-1.5 rounded-full bg-brand shrink-0" />
    {{ label }}
  </span>
</template>
