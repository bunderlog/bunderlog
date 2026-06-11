<script setup lang="ts">
defineProps<{ size?: 'sm' | 'md' | 'lg' }>()
</script>

<template>
  <img
    src="/logo-full-dark.svg"
    alt="bunderlog"
    :class="['logo', `logo--${size ?? 'md'}`]"
  />
</template>

<style scoped>
.logo {
  display: block;
  width: auto;
}

.logo--sm { height: 22px; }
.logo--md { height: 28px; }
.logo--lg { height: 40px; }
</style>
