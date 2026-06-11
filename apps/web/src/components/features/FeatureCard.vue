<script setup lang="ts">
defineProps<{
  title: string
  description: string
}>()
</script>

<template>
  <div class="card">
    <div class="card__icon">
      <slot name="icon" />
    </div>
    <h3 class="card__title">{{ title }}</h3>
    <p class="card__desc">{{ description }}</p>
  </div>
</template>

<style scoped>
.card {
  padding: 28px;
  background: var(--surface);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.card__icon {
  width: 36px;
  height: 36px;
  color: var(--brand);
  margin-bottom: 4px;
}

.card__title {
  font-family: var(--font-ui);
  font-size: 15px;
  font-weight: 600;
  color: var(--text);
  letter-spacing: -0.02em;
}

.card__desc {
  font-size: 14px;
  color: var(--muted);
  line-height: 1.6;
}
</style>
