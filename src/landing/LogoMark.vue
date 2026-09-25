<script setup lang="ts">
// The brand mark: two bars in the current text color and an ember bar in the sun color.
// public/favicon.svg is a static copy of it on a dark tile.
withDefaults(defineProps<{ size?: number }>(), { size: 24 })
</script>

<template>
  <svg viewBox="0 0 24 24" :width="size" :height="size" aria-hidden="true">
    <rect x="2" y="4" width="20" height="4" rx="2" fill="currentColor" />
    <rect x="2" y="10" width="15" height="4" rx="2" fill="currentColor" opacity=".45" />
    <rect x="2" y="16" width="10" height="4" rx="2" class="ember" />
  </svg>
</template>

<style scoped>
.ember {
  fill: var(--sun);
}
</style>
