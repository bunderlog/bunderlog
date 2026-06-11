<script setup lang="ts">
const props = defineProps<{ size?: 'sm' | 'md' | 'lg' }>()

const height: Record<string, string> = { sm: 'h-[22px]', md: 'h-[28px]', lg: 'h-[40px]' }
</script>

<template>
  <img
    src="/logo-full-dark.svg"
    alt="bunderlog"
    :class="['block w-auto', height[props.size ?? 'md']]"
  />
</template>
