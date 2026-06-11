<script setup lang="ts">
import { SectionLabel, SectionTitle } from '@/components/ui'
import PricingCard from '@/components/pricing/PricingCard.vue'
</script>

<template>
  <section id="pricing" class="py-24 px-6 bg-page">
    <div class="max-w-[1200px] mx-auto flex flex-col gap-12">

      <div class="flex flex-col items-center gap-3">
        <SectionLabel text="Pricing" />
        <SectionTitle align="center" class="text-section">Simple, honest pricing</SectionTitle>
        <p class="text-base text-muted">Start free. Scale when you're ready.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-start max-md:max-w-[440px] max-md:mx-auto">
        <PricingCard
          name="Hobby"
          price="Free"
          description="Everything you need for side projects and small services."
          cta="Start for free"
          :features="['500k logs / day', '30-day retention', '1 service', 'Live tail', 'Full-text search']"
        />
        <PricingCard
          name="Team"
          price="$12"
          period="/ month"
          description="For teams shipping production services that need more headroom."
          cta="Get started"
          :highlighted="true"
          :features="['5M logs / day', '90-day retention', 'Unlimited services', 'Alerts & notifications', 'Team members (up to 5)', 'Priority support']"
        />
        <PricingCard
          name="Enterprise"
          price="Custom"
          description="Unlimited scale, custom SLA, and dedicated support for large organizations."
          cta="Contact us"
          :features="['Unlimited logs', 'Custom retention', 'Unlimited services', 'SSO / RBAC', 'Custom SLA', 'Dedicated support']"
        />
      </div>

    </div>
  </section>
</template>
