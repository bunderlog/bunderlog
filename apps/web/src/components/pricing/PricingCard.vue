<script setup lang="ts">
import { BaseButton } from '@/components/ui'

defineProps<{
  name: string
  price: string
  period?: string
  description: string
  features: string[]
  cta: string
  ctaHref?: string
  highlighted?: boolean
}>()
</script>

<template>
  <div :class="['card', { 'card--highlighted': highlighted }]">
    <div class="card__header">
      <p class="card__name">{{ name }}</p>
      <div class="card__price-row">
        <span class="card__price">{{ price }}</span>
        <span v-if="period" class="card__period">{{ period }}</span>
      </div>
      <p class="card__desc">{{ description }}</p>
    </div>

    <BaseButton
      :variant="highlighted ? 'primary' : 'secondary'"
      size="md"
      :href="ctaHref ?? '#'"
      style="width: 100%; justify-content: center;"
    >
      {{ cta }}
    </BaseButton>

    <ul class="card__features">
      <li v-for="f in features" :key="f" class="card__feature">
        <span class="card__check">✓</span>
        {{ f }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.card--highlighted {
  border-color: var(--brand);
  box-shadow: 0 0 0 1px var(--brand), 0 0 32px rgba(29, 158, 117, 0.1);
}

.card__header { display: flex; flex-direction: column; gap: 8px; }

.card__name {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--muted);
}

.card--highlighted .card__name { color: var(--brand); }

.card__price-row { display: flex; align-items: baseline; gap: 4px; }

.card__price {
  font-family: var(--font-ui);
  font-size: 36px;
  font-weight: 700;
  letter-spacing: -0.04em;
  color: var(--text);
}

.card__period {
  font-size: 14px;
  color: var(--muted);
}

.card__desc {
  font-size: 14px;
  color: var(--muted);
  line-height: 1.5;
}

.card__features {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.card__feature {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 14px;
  color: var(--text);
  line-height: 1.4;
}

.card__check {
  color: var(--brand);
  flex-shrink: 0;
  font-size: 13px;
  margin-top: 1px;
}
</style>
