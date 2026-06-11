<script setup lang="ts">
defineProps<{ title: string; description: string }>()
</script>

<template>
  <div class="p-7 bg-surface flex flex-col gap-2.5">
    <div class="w-9 h-9 text-brand mb-1">
      <slot name="icon" />
    </div>
    <h3 class="font-ui text-[15px] font-semibold text-fg tracking-[-0.02em]">{{ title }}</h3>
    <p class="text-sm text-muted leading-relaxed">{{ description }}</p>
  </div>
</template>
