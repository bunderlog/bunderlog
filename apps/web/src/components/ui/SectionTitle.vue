<script setup lang="ts">
defineProps<{
  as?: 'h1' | 'h2' | 'h3'
  align?: 'left' | 'center'
}>()
</script>

<template>
  <component
    :is="as ?? 'h2'"
    :class="[
      'font-ui font-semibold tracking-[-0.03em] leading-[1.15] text-fg',
      align === 'center' ? 'text-center' : 'text-left',
    ]"
  >
    <slot />
  </component>
</template>
