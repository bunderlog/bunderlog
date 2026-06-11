<script setup lang="ts">
import { SectionLabel } from '@/components/ui'
</script>

<template>
  <section class="py-24 px-6 bg-surface border-t border-b border-border">
    <div class="max-w-[860px] mx-auto flex flex-col gap-9">

      <SectionLabel text="The name" />
      <h2 class="font-ui font-semibold text-section tracking-[-0.03em] leading-[1.15] text-fg">Why bunderlog?</h2>

      <div class="flex items-start gap-6 flex-wrap">
        <div class="flex flex-col gap-2 flex-1 min-w-[180px]">
          <span class="font-mono text-[22px] font-medium text-fg tracking-[-0.02em]">bundle</span>
          <p class="text-sm text-muted leading-[1.65]">Logs are collected and shipped in batches — bundles of events from your services.</p>
        </div>
        <span class="text-[28px] text-border self-start mt-0.5">+</span>
        <div class="flex flex-col gap-2 flex-1 min-w-[180px]">
          <span class="font-mono text-[22px] font-medium text-fg tracking-[-0.02em]">log</span>
          <p class="text-sm text-muted leading-[1.65]">Because that's what it does. Structured log management, nothing more.</p>
        </div>
        <span class="text-[28px] text-border self-start mt-0.5">+</span>
        <div class="flex flex-col gap-2 flex-1 min-w-[180px]">
          <span class="font-mono text-[22px] font-medium text-brand tracking-[-0.02em]">bandarlog</span>
          <p class="text-sm text-muted leading-[1.65]">
            The chattering monkey clan from Kipling's <em class="text-fg not-italic">The Jungle Book</em> —
            they see everything and never forget. That's what your logs should do.
          </p>
        </div>
      </div>

      <p class="text-[15px] text-muted pt-2 border-t border-border leading-relaxed">
        Also: <em class="text-fg not-italic">be under log</em>. Everything your system does, captured.
      </p>

    </div>
  </section>
</template>
