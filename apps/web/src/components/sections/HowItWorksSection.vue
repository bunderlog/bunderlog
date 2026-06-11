<script setup lang="ts">
import { SectionLabel, SectionTitle } from '@/components/ui'
import StepCard from '@/components/features/StepCard.vue'
</script>

<template>
  <section id="how-it-works" class="py-24 px-6 bg-surface border-t border-b border-border">
    <div class="max-w-[760px] mx-auto flex flex-col gap-12">

      <div class="flex flex-col gap-3">
        <SectionLabel text="How it works" />
        <SectionTitle class="text-section">
          Up and running<br />in three minutes
        </SectionTitle>
      </div>

      <div class="flex flex-col">
        <StepCard
          :step="1"
          title="Install the SDK"
          description="One package, no transitive dependencies. Works in any JavaScript runtime."
          code="npm install bunderlog"
        />
        <div class="w-px h-8 bg-border ml-[17px]" />
        <StepCard
          :step="2"
          title="Send your first log"
          description="Initialize with your token and start logging. Batches automatically, flushes on timeout or threshold."
          code="const log = logger({ token: process.env.LOG_TOKEN, service: 'api' })
log.info('Server started', { port: 3000 })"
        />
        <div class="w-px h-8 bg-border ml-[17px]" />
        <StepCard
          :step="3"
          title="See it in the dashboard"
          description="Live tail, full-text search, and time-series charts. All in one place, no configuration required."
        />
      </div>

    </div>
  </section>
</template>
