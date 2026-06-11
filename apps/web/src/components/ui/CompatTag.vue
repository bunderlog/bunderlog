<script setup lang="ts">
defineProps<{ label: string }>()
</script>

<template>
  <span class="compat">
    <span class="compat__dot" />
    {{ label }}
  </span>
</template>

<style scoped>
.compat {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-ui);
  font-size: 13px;
  font-weight: 500;
  color: var(--muted);
  background: var(--elevated);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 4px 12px 4px 10px;
  white-space: nowrap;
}

.compat__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--brand);
  flex-shrink: 0;
}
</style>
