<script setup lang="ts">
import { BaseButton } from '@/components/ui'
</script>

<template>
  <div class="cta-buttons">
    <BaseButton size="lg" href="#pricing">Get started free</BaseButton>
    <BaseButton size="lg" variant="secondary" href="#dashboard">See it live</BaseButton>
  </div>
</template>

<style scoped>
.cta-buttons {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}
</style>
