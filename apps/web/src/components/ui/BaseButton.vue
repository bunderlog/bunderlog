<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  href?: string
  disabled?: boolean
}>()

const SIZE: Record<string, string> = {
  sm: 'py-[7px] px-[13px] text-[13px]',
  md: 'py-[9px] px-[18px] text-sm',
  lg: 'py-3 px-6 text-[15px]',
}

const VARIANT: Record<string, string> = {
  primary:   'bg-brand text-white border-brand hover:bg-brand-dark hover:border-brand-dark',
  secondary: 'bg-elevated text-fg border-border hover:border-border-hover hover:bg-elevated-hover',
  ghost:     'bg-transparent text-muted border-transparent hover:text-fg',
}

const cls = computed(() => [
  'inline-flex items-center gap-1.5 rounded-md font-ui font-medium tracking-[-0.01em]',
  'cursor-pointer border transition-colors duration-150 whitespace-nowrap leading-none no-underline',
  SIZE[props.size ?? 'md'],
  VARIANT[props.variant ?? 'primary'],
  props.disabled && 'opacity-40 cursor-not-allowed pointer-events-none',
])
</script>

<template>
  <a v-if="href" :href="href" :class="cls"><slot /></a>
  <button v-else :class="cls" :disabled="disabled"><slot /></button>
</template>
