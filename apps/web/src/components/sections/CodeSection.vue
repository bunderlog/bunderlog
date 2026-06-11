<script setup lang="ts">
import { SectionLabel, SectionTitle } from '@/components/ui'

const code = `<span class="t-muted">import</span> <span class="t-fg">{ logger }</span> <span class="t-muted">from</span> <span class="t-green">'bunderlog'</span>

<span class="t-muted">const</span> <span class="t-fg">log</span> <span class="t-muted">=</span> <span class="t-blue">logger</span><span class="t-fg">({</span>
  <span class="t-fg">endpoint:</span> <span class="t-green">'https://ingest.bunderlog.dev'</span><span class="t-fg">,</span>
  <span class="t-fg">token:</span>    <span class="t-fg">process.env.</span><span class="t-green">LOG_TOKEN</span><span class="t-fg">,</span>
  <span class="t-fg">service:</span>  <span class="t-green">'my-api'</span><span class="t-fg">,</span>
  <span class="t-fg">batchSize:</span> <span class="t-yellow">20</span><span class="t-fg">,</span>
  <span class="t-fg">flushMs:</span>   <span class="t-yellow">2000</span><span class="t-fg">,</span>
<span class="t-fg">})</span>

<span class="t-fg">log.</span><span class="t-blue">debug</span><span class="t-fg">(</span><span class="t-green">'Cache miss'</span><span class="t-fg">,</span>        <span class="t-fg">{ key:</span> <span class="t-green">'user:42'</span> <span class="t-fg">})</span>
<span class="t-fg">log.</span><span class="t-blue">info</span><span class="t-fg">(</span><span class="t-green">'Server started'</span><span class="t-fg">,</span>     <span class="t-fg">{ port:</span> <span class="t-yellow">3000</span> <span class="t-fg">})</span>
<span class="t-fg">log.</span><span class="t-blue">warn</span><span class="t-fg">(</span><span class="t-green">'Rate limit at 80%'</span><span class="t-fg">,</span>  <span class="t-fg">{ token:</span> <span class="t-green">'bnd_••••'</span> <span class="t-fg">})</span>
<span class="t-fg">log.</span><span class="t-blue">error</span><span class="t-fg">(</span><span class="t-green">'DB timeout'</span><span class="t-fg">,</span>         <span class="t-fg">{ duration_ms:</span> <span class="t-yellow">5000</span> <span class="t-fg">})</span>
<span class="t-fg">log.</span><span class="t-blue">fatal</span><span class="t-fg">(</span><span class="t-green">'OOM — process terminating'</span><span class="t-fg">)</span>

<span class="t-muted">// graceful shutdown</span>
<span class="t-muted">await</span> <span class="t-fg">log.</span><span class="t-blue">flush</span><span class="t-fg">()</span>`
</script>

<template>
  <section class="py-24 px-6 bg-surface border-t border-b border-border">
    <div class="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-16 items-start">

      <div class="flex flex-col gap-4 md:sticky md:top-20">
        <SectionLabel text="SDK" />
        <SectionTitle class="text-section">
          Integrate in minutes,<br />not hours
        </SectionTitle>
        <p class="text-[15px] text-muted leading-[1.65]">
          Structured, type-safe, and framework-agnostic.
          Flushes automatically on threshold or timeout.
        </p>
      </div>

      <div class="bg-elevated border border-border rounded-[10px] overflow-hidden">
        <div class="flex border-b border-border px-1">
          <span class="font-ui text-[13px] text-fg px-3.5 py-2.5 border-b-2 border-brand -mb-px">Node.js / Bun</span>
          <span class="font-ui text-[13px] text-muted px-3.5 py-2.5 cursor-pointer">Browser</span>
          <span class="font-ui text-[13px] text-muted px-3.5 py-2.5 cursor-pointer">CF Workers</span>
        </div>

        <!-- eslint-disable vue/no-v-html -->
        <pre class="font-mono text-[13.5px] leading-[1.7] px-7 py-6 overflow-x-auto whitespace-pre text-fg" v-html="code" />
        <!-- eslint-enable vue/no-v-html -->
      </div>

    </div>
  </section>
</template>
