<script setup lang="ts">
defineProps<{
  as?: 'h1' | 'h2' | 'h3'
  align?: 'left' | 'center'
}>()
</script>

<template>
  <component :is="as ?? 'h2'" :class="['title', `title--${align ?? 'left'}`]">
    <slot />
  </component>
</template>

<style scoped>
.title {
  font-family: var(--font-ui);
  font-weight: 600;
  letter-spacing: -0.03em;
  line-height: 1.15;
  color: var(--text);
}

.title--center { text-align: center; }
.title--left   { text-align: left; }
</style>
