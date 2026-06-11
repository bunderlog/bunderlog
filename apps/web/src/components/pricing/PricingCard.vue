<script setup lang="ts">
import { computed } from 'vue'
import { BaseButton } from '@/components/ui'

const props = defineProps<{
  name: string
  price: string
  period?: string
  description: string
  features: string[]
  cta: string
  ctaHref?: string
  highlighted?: boolean
}>()

const cardCls = computed(() => [
  'bg-surface border rounded-[10px] p-7 flex flex-col gap-5',
  props.highlighted ? 'border-brand shadow-brand-ring' : 'border-border',
])
</script>

<template>
  <div :class="cardCls">
    <div class="flex flex-col gap-2">
      <p :class="['text-[12px] font-semibold tracking-[0.1em] uppercase', highlighted ? 'text-brand' : 'text-muted']">
        {{ name }}
      </p>
      <div class="flex items-baseline gap-1">
        <span class="font-ui text-[36px] font-bold tracking-[-0.04em] text-fg">{{ price }}</span>
        <span v-if="period" class="text-sm text-muted">{{ period }}</span>
      </div>
      <p class="text-sm text-muted leading-relaxed">{{ description }}</p>
    </div>

    <BaseButton
      :variant="highlighted ? 'primary' : 'secondary'"
      size="md"
      :href="ctaHref ?? '#'"
      class="w-full justify-center"
    >{{ cta }}</BaseButton>

    <ul class="flex flex-col gap-2.5 list-none">
      <li v-for="f in features" :key="f" class="flex items-start gap-2 text-sm text-fg leading-snug">
        <span class="text-brand shrink-0 text-[13px] mt-px">✓</span>
        {{ f }}
      </li>
    </ul>
  </div>
</template>
