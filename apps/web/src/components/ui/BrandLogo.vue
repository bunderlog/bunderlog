<script setup lang="ts">
import { computed } from 'vue'
import { useTheme } from '@/composables/useTheme'

const props = defineProps<{ size?: 'sm' | 'md' | 'lg'; icon?: boolean }>()

const { isDark } = useTheme()

const HEIGHT: Record<string, string> = { sm: 'h-[22px]', md: 'h-[28px]', lg: 'h-[40px]' }

const src = computed(() => {
  const variant = isDark.value ? 'dark' : 'light'
  return props.icon ? `/logo-icon-${variant}.svg` : `/logo-full-${variant}.svg`
})
</script>

<template>
  <img
    :src="src"
    alt="bunderlog"
    :class="['block w-auto', HEIGHT[props.size ?? 'md']]"
  />
</template>
