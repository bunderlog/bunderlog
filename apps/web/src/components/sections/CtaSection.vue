<script setup lang="ts">
import { BaseButton } from '@/components/ui'
</script>

<template>
  <section class="relative py-[120px] px-6 bg-page text-center overflow-hidden">
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-brand-glow pointer-events-none" />

    <div class="relative max-w-[600px] mx-auto flex flex-col items-center gap-5">
      <h2 class="font-ui font-bold text-cta tracking-[-0.04em] leading-[1.1] text-fg">
        Start logging in<br />three minutes
      </h2>
      <p class="text-[17px] text-muted leading-[1.65] max-w-[440px]">
        Free forever for hobby projects. No credit card, no commitment.
        Just logs.
      </p>
      <div class="flex gap-3 flex-wrap justify-center mt-1">
        <BaseButton size="lg" href="#pricing">Get started free</BaseButton>
        <BaseButton size="lg" variant="secondary" href="#">Read the docs</BaseButton>
      </div>
      <p class="text-[13px] text-muted">500k logs/day · 30-day retention · 1 service · forever free</p>
    </div>
  </section>
</template>
