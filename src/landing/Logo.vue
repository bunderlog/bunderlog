<script setup lang="ts">
import { BRAND } from '../shared/copy'
import LogoMark from './LogoMark.vue'
</script>

<template>
  <span class="logo">
    <LogoMark />
    <span class="word">{{ BRAND }}</span>
  </span>
</template>

<style scoped>
.logo {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--fg);
}
.word {
  position: relative;
  font-weight: 700;
  font-size: 20px;
  letter-spacing: -0.02em;
}
/* the setting sun over the last letter */
.word::after {
  content: '';
  position: absolute;
  top: 1px;
  right: -9px;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--sun);
  box-shadow: 0 0 10px var(--glow-strong);
}
</style>
