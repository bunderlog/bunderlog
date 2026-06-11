<script setup lang="ts">
import LandingLayout from '@/components/layout/LandingLayout.vue'
import AppNavbar from '@/components/sections/AppNavbar.vue'
import HeroSection from '@/components/sections/HeroSection.vue'
import SocialProofBar from '@/components/sections/SocialProofBar.vue'
import FeaturesSection from '@/components/sections/FeaturesSection.vue'
import HowItWorksSection from '@/components/sections/HowItWorksSection.vue'
import DashboardPreview from '@/components/sections/DashboardPreview.vue'
import CodeSection from '@/components/sections/CodeSection.vue'
import PricingSection from '@/components/sections/PricingSection.vue'
import NameStorySection from '@/components/sections/NameStorySection.vue'
import CtaSection from '@/components/sections/CtaSection.vue'
import AppFooter from '@/components/sections/AppFooter.vue'
</script>

<template>
  <LandingLayout>
    <AppNavbar />
    <HeroSection />
    <SocialProofBar />
    <FeaturesSection />
    <HowItWorksSection />
    <DashboardPreview />
    <CodeSection />
    <PricingSection />
    <NameStorySection />
    <CtaSection />
    <AppFooter />
  </LandingLayout>
</template>
