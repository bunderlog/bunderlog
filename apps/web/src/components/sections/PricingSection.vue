<script setup lang="ts">
import { SectionLabel, SectionTitle } from '@/components/ui'
import PricingCard from '@/components/pricing/PricingCard.vue'
</script>

<template>
  <section id="pricing" class="pricing">
    <div class="pricing__inner">
      <div class="pricing__header">
        <SectionLabel text="Pricing" />
        <SectionTitle align="center" style="font-size: clamp(28px, 3vw, 40px);">
          Simple, honest pricing
        </SectionTitle>
        <p class="pricing__sub">Start free. Scale when you're ready.</p>
      </div>

      <div class="pricing__grid">
        <PricingCard
          name="Hobby"
          price="Free"
          description="Everything you need for side projects and small services."
          cta="Start for free"
          :features="[
            '500k logs / day',
            '30-day retention',
            '1 service',
            'Live tail',
            'Full-text search',
          ]"
        />
        <PricingCard
          name="Team"
          price="$12"
          period="/ month"
          description="For teams shipping production services that need more headroom."
          cta="Get started"
          :highlighted="true"
          :features="[
            '5M logs / day',
            '90-day retention',
            'Unlimited services',
            'Alerts & notifications',
            'Team members (up to 5)',
            'Priority support',
          ]"
        />
        <PricingCard
          name="Enterprise"
          price="Custom"
          description="Unlimited scale, custom SLA, and dedicated support for large organizations."
          cta="Contact us"
          :features="[
            'Unlimited logs',
            'Custom retention',
            'Unlimited services',
            'SSO / RBAC',
            'Custom SLA',
            'Dedicated support',
          ]"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.pricing {
  padding: 96px 24px;
  background: var(--page);
}

.pricing__inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 48px;
}

.pricing__header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.pricing__sub {
  font-size: 16px;
  color: var(--muted);
}

.pricing__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  align-items: start;
}

@media (max-width: 900px) {
  .pricing__grid { grid-template-columns: 1fr; max-width: 440px; margin: 0 auto; }
}
</style>
