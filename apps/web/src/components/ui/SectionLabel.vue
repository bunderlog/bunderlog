<script setup lang="ts">
defineProps<{ text: string }>()
</script>

<template>
  <p class="label">{{ text }}</p>
</template>

<style scoped>
.label {
  display: inline-block;
  font-family: var(--font-ui);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--brand);
}
</style>
