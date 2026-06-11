<script setup lang="ts">
import { SectionLabel, SectionTitle } from '@/components/ui'
</script>

<template>
  <section class="code-section">
    <div class="code-section__inner">
      <div class="code-section__header">
        <SectionLabel text="SDK" />
        <SectionTitle style="font-size: clamp(28px, 3vw, 40px);">
          Integrate in minutes,<br />not hours
        </SectionTitle>
        <p class="code-section__sub">
          Structured, type-safe, and framework-agnostic.
          Flushes automatically on threshold or timeout.
        </p>
      </div>

      <div class="code-section__window">
        <div class="code-section__tabs">
          <span class="code-section__tab code-section__tab--active">Node.js / Bun</span>
          <span class="code-section__tab">Browser</span>
          <span class="code-section__tab">CF Workers</span>
        </div>

        <pre class="code-section__code"><code><span class="t-muted">import</span> <span class="t-text">{ logger }</span> <span class="t-muted">from</span> <span class="t-green">'bunderlog'</span>

<span class="t-muted">const</span> <span class="t-text">log</span> <span class="t-muted">=</span> <span class="t-blue">logger</span><span class="t-text">({</span>
  <span class="t-text">endpoint:</span> <span class="t-green">'https://ingest.bunderlog.dev'</span><span class="t-text">,</span>
  <span class="t-text">token:</span>    <span class="t-text">process.env.</span><span class="t-green">LOG_TOKEN</span><span class="t-text">,</span>
  <span class="t-text">service:</span>  <span class="t-green">'my-api'</span><span class="t-text">,</span>
  <span class="t-text">batchSize:</span> <span class="t-yellow">20</span><span class="t-text">,</span>
  <span class="t-text">flushMs:</span>   <span class="t-yellow">2000</span><span class="t-text">,</span>
<span class="t-text">})</span>

<span class="t-text">log.</span><span class="t-blue">debug</span><span class="t-text">(</span><span class="t-green">'Cache miss'</span><span class="t-text">,</span>        <span class="t-text">{ key:</span> <span class="t-green">'user:42'</span> <span class="t-text">})</span>
<span class="t-text">log.</span><span class="t-blue">info</span><span class="t-text">(</span><span class="t-green">'Server started'</span><span class="t-text">,</span>     <span class="t-text">{ port:</span> <span class="t-yellow">3000</span> <span class="t-text">})</span>
<span class="t-text">log.</span><span class="t-blue">warn</span><span class="t-text">(</span><span class="t-green">'Rate limit at 80%'</span><span class="t-text">,</span>  <span class="t-text">{ token:</span> <span class="t-green">'bnd_••••'</span> <span class="t-text">})</span>
<span class="t-text">log.</span><span class="t-blue">error</span><span class="t-text">(</span><span class="t-green">'DB timeout'</span><span class="t-text">,</span>         <span class="t-text">{ duration_ms:</span> <span class="t-yellow">5000</span> <span class="t-text">})</span>
<span class="t-text">log.</span><span class="t-blue">fatal</span><span class="t-text">(</span><span class="t-green">'OOM — process terminating'</span><span class="t-text">)</span>

<span class="t-muted">// graceful shutdown</span>
<span class="t-muted">await</span> <span class="t-text">log.</span><span class="t-blue">flush</span><span class="t-text">()</span></code></pre>
      </div>
    </div>
  </section>
</template>

<style scoped>
.code-section {
  padding: 96px 24px;
  background: var(--surface);
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}

.code-section__inner {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 64px;
  align-items: start;
}

.code-section__header {
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: sticky;
  top: 80px;
}

.code-section__sub {
  font-size: 15px;
  color: var(--muted);
  line-height: 1.65;
}

.code-section__window {
  background: var(--elevated);
  border: 1px solid var(--border);
  border-radius: 10px;
  overflow: hidden;
}

.code-section__tabs {
  display: flex;
  border-bottom: 1px solid var(--border);
  padding: 0 4px;
}

.code-section__tab {
  font-family: var(--font-ui);
  font-size: 13px;
  color: var(--muted);
  padding: 10px 14px;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  transition: color 0.15s;
}

.code-section__tab--active {
  color: var(--text);
  border-bottom-color: var(--brand);
}

.code-section__code {
  font-family: var(--font-mono);
  font-size: 13.5px;
  line-height: 1.7;
  padding: 24px 28px;
  overflow-x: auto;
  white-space: pre;
  color: var(--text);
}

.t-muted  { color: var(--muted); }
.t-text   { color: var(--text); }
.t-green  { color: var(--level-info); }
.t-yellow { color: var(--level-warn); }
.t-blue   { color: #79c0ff; }

@media (max-width: 900px) {
  .code-section__inner { grid-template-columns: 1fr; gap: 36px; }
  .code-section__header { position: static; }
}
</style>
