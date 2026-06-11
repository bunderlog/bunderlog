<script setup lang="ts">
import { SectionLabel } from '@/components/ui'
import CtaButtons from '@/components/hero/CtaButtons.vue'
import TerminalPreview from '@/components/hero/TerminalPreview.vue'
</script>

<template>
  <section class="hero">
    <div class="hero__grid-bg" />
    <div class="hero__inner">
      <div class="hero__content">
        <SectionLabel text="Cloudflare-native log management" />
        <h1 class="hero__title">
          Log management<br />
          built for<br />
          <span class="hero__accent">the edge</span>
        </h1>
        <p class="hero__sub">
          Bunderlog streams, stores, and searches your logs on Cloudflare's
          global network — where your app already runs. Free tier, zero infra.
        </p>
        <CtaButtons />
        <p class="hero__note">No credit card required · 500k logs/day free</p>
      </div>
      <div class="hero__preview">
        <TerminalPreview />
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  padding: 100px 24px 80px;
  overflow: hidden;
}

.hero__grid-bg {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(var(--border) 1px, transparent 1px),
    linear-gradient(90deg, var(--border) 1px, transparent 1px);
  background-size: 48px 48px;
  opacity: 0.3;
  mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 100%);
}

.hero__inner {
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
}

.hero__content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.hero__title {
  font-family: var(--font-ui);
  font-size: clamp(40px, 5vw, 68px);
  font-weight: 700;
  letter-spacing: -0.04em;
  line-height: 1.05;
  color: var(--text);
}

.hero__accent {
  color: var(--brand);
}

.hero__sub {
  font-size: 17px;
  color: var(--muted);
  line-height: 1.65;
  max-width: 440px;
}

.hero__note {
  font-size: 13px;
  color: var(--muted);
  margin-top: -8px;
}

.hero__preview {
  display: flex;
  justify-content: flex-end;
}

@media (max-width: 900px) {
  .hero__inner {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  .hero__preview {
    justify-content: center;
  }
  .hero__title {
    font-size: clamp(36px, 8vw, 52px);
  }
}
</style>
