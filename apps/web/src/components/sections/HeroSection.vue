<script setup lang="ts">
import { SectionLabel } from '@/components/ui'
import CtaButtons from '@/components/hero/CtaButtons.vue'
import TerminalPreview from '@/components/hero/TerminalPreview.vue'
</script>

<template>
  <section class="relative px-6 pt-[100px] pb-20 overflow-hidden">
    <div
      class="absolute inset-0 grid-bg opacity-30"
      style="mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 100%)"
    />

    <div class="relative max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-[60px] items-center">
      <div class="flex flex-col gap-5">
        <SectionLabel text="Cloudflare-native log management" />
        <h1 class="font-ui font-bold text-hero tracking-[-0.04em] leading-[1.05] text-fg">
          Log management<br />
          built for<br />
          <span class="text-brand">the edge</span>
        </h1>
        <p class="text-[17px] text-muted leading-[1.65] max-w-[440px]">
          Bunderlog streams, stores, and searches your logs on Cloudflare's
          global network — where your app already runs. Free tier, zero infra.
        </p>
        <CtaButtons />
        <p class="text-[13px] text-muted -mt-2">No credit card required · 500k logs/day free</p>
      </div>

      <div class="flex justify-end max-md:justify-center">
        <TerminalPreview />
      </div>
    </div>
  </section>
</template>
