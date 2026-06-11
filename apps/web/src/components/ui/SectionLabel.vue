<script setup lang="ts">
defineProps<{ text: string }>()
</script>

<template>
  <p class="inline-block font-ui text-[11px] font-semibold tracking-[0.12em] uppercase text-brand">
    {{ text }}
  </p>
</template>
