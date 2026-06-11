<script setup lang="ts">
import { BaseButton } from '@/components/ui'
</script>

<template>
  <section class="cta">
    <div class="cta__glow" />
    <div class="cta__inner">
      <h2 class="cta__title">
        Start logging in<br />three minutes
      </h2>
      <p class="cta__sub">
        Free forever for hobby projects. No credit card, no commitment.
        Just logs.
      </p>
      <div class="cta__actions">
        <BaseButton size="lg" href="#pricing">Get started free</BaseButton>
        <BaseButton size="lg" variant="secondary" href="#">Read the docs</BaseButton>
      </div>
      <p class="cta__note">500k logs/day · 30-day retention · 1 service · forever free</p>
    </div>
  </section>
</template>

<style scoped>
.cta {
  position: relative;
  padding: 120px 24px;
  background: var(--page);
  text-align: center;
  overflow: hidden;
}

.cta__glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  height: 300px;
  background: radial-gradient(ellipse, rgba(29, 158, 117, 0.12) 0%, transparent 70%);
  pointer-events: none;
}

.cta__inner {
  position: relative;
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.cta__title {
  font-family: var(--font-ui);
  font-size: clamp(36px, 4vw, 56px);
  font-weight: 700;
  letter-spacing: -0.04em;
  line-height: 1.1;
  color: var(--text);
}

.cta__sub {
  font-size: 17px;
  color: var(--muted);
  line-height: 1.65;
  max-width: 440px;
}

.cta__actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 4px;
}

.cta__note {
  font-size: 13px;
  color: var(--muted);
  margin-top: 4px;
}
</style>
