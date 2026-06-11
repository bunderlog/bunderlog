<script setup lang="ts">
import { SectionLabel, SectionTitle } from '@/components/ui'
import FeatureCard from '@/components/features/FeatureCard.vue'
</script>

<template>
  <section id="features" class="features">
    <div class="features__inner">
      <div class="features__header">
        <SectionLabel text="Features" />
        <SectionTitle align="center" style="font-size: clamp(28px, 3vw, 40px);">
          Everything logs need.<br />Nothing they don't.
        </SectionTitle>
        <p class="features__sub">
          Built on primitives you already pay for — D1, R2, Queues, KV.
          No new vendors, no surprise bills.
        </p>
      </div>

      <div class="features__grid">
        <FeatureCard
          title="Live Tail"
          description="Watch logs stream in real time from any service, anywhere in the world. Sub-second latency via Server-Sent Events."
        >
          <template #icon>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          </template>
        </FeatureCard>

        <FeatureCard
          title="Edge Native"
          description="Ingests and queries your logs from 300+ Cloudflare PoPs. No cold starts, no centralised bottleneck."
        >
          <template #icon>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
          </template>
        </FeatureCard>

        <FeatureCard
          title="Fast Search"
          description="Query millions of structured logs in milliseconds. Filter by level, service, time range, or full-text. Cursor-based pagination."
        >
          <template #icon>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </template>
        </FeatureCard>

        <FeatureCard
          title="D1 + R2 Storage"
          description="Hot logs in Cloudflare D1 for 30 days. Raw NDJSON archived to R2 forever. No data loss, no lock-in."
        >
          <template #icon>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <ellipse cx="12" cy="5" rx="9" ry="3" />
              <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
              <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
            </svg>
          </template>
        </FeatureCard>

        <FeatureCard
          title="Simple SDK"
          description="One package, zero dependencies. Batches and flushes automatically. Works in Node.js, Bun, Deno, browsers, and Workers."
        >
          <template #icon>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <polyline points="16 18 22 12 16 6" />
              <polyline points="8 6 2 12 8 18" />
            </svg>
          </template>
        </FeatureCard>

        <FeatureCard
          title="Free Tier"
          description="500k logs per day with 30-day retention, included forever. No credit card, no time limit — just start logging."
        >
          <template #icon>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </template>
        </FeatureCard>
      </div>
    </div>
  </section>
</template>

<style scoped>
.features {
  padding: 96px 24px;
  background: var(--page);
}

.features__inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 48px;
}

.features__header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  text-align: center;
}

.features__sub {
  font-size: 16px;
  color: var(--muted);
  max-width: 480px;
  line-height: 1.65;
  text-align: center;
}

.features__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  background: var(--border);
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
}

@media (max-width: 900px) {
  .features__grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 540px) {
  .features__grid { grid-template-columns: 1fr; }
}
</style>
