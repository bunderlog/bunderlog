<script setup lang="ts">
defineProps<{
  step: number
  title: string
  description: string
  code?: string
}>()
</script>

<template>
  <div class="step">
    <div class="step__number">{{ step }}</div>
    <div class="step__body">
      <h3 class="step__title">{{ title }}</h3>
      <p class="step__desc">{{ description }}</p>
      <pre v-if="code" class="step__code"><code>{{ code }}</code></pre>
    </div>
  </div>
</template>

<style scoped>
.step {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.step__number {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--brand-deep);
  border: 1px solid var(--brand);
  color: var(--brand);
  font-family: var(--font-ui);
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2px;
}

.step__body {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.step__title {
  font-family: var(--font-ui);
  font-size: 16px;
  font-weight: 600;
  color: var(--text);
  letter-spacing: -0.02em;
}

.step__desc {
  font-size: 14px;
  color: var(--muted);
  line-height: 1.6;
}

.step__code {
  background: var(--elevated);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 10px 14px;
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--brand);
  overflow-x: auto;
  white-space: pre;
}
</style>
