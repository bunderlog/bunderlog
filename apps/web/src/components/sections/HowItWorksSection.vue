<script setup lang="ts">
import { SectionLabel, SectionTitle } from '@/components/ui'
import StepCard from '@/components/features/StepCard.vue'
</script>

<template>
  <section id="how-it-works" class="how">
    <div class="how__inner">
      <div class="how__header">
        <SectionLabel text="How it works" />
        <SectionTitle style="font-size: clamp(28px, 3vw, 40px);">
          Up and running<br />in three minutes
        </SectionTitle>
      </div>

      <div class="how__steps">
        <StepCard
          :step="1"
          title="Install the SDK"
          description="One package, no transitive dependencies. Works in any JavaScript runtime."
          code="npm install bunderlog"
        />
        <div class="how__divider" />
        <StepCard
          :step="2"
          title="Send your first log"
          description="Initialize with your token and start logging. Batches automatically, flushes on timeout or threshold."
          code="const log = logger({ token: process.env.LOG_TOKEN, service: 'api' })
log.info('Server started', { port: 3000 })"
        />
        <div class="how__divider" />
        <StepCard
          :step="3"
          title="See it in the dashboard"
          description="Live tail, full-text search, and time-series charts. All in one place, no configuration required."
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.how {
  padding: 96px 24px;
  background: var(--surface);
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}

.how__inner {
  max-width: 760px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 48px;
}

.how__header {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.how__steps {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.how__divider {
  width: 1px;
  height: 32px;
  background: var(--border);
  margin-left: 17px;
}
</style>
