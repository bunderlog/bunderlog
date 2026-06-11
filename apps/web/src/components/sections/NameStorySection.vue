<script setup lang="ts">
import { SectionLabel } from '@/components/ui'
</script>

<template>
  <section class="story">
    <div class="story__inner">
      <SectionLabel text="The name" />
      <h2 class="story__title">Why bunderlog?</h2>
      <div class="story__grid">
        <div class="story__part">
          <span class="story__word">bundle</span>
          <p class="story__def">Logs are collected and shipped in batches — bundles of events from your services.</p>
        </div>
        <div class="story__separator">+</div>
        <div class="story__part">
          <span class="story__word">log</span>
          <p class="story__def">Because that's what it does. Structured log management, nothing more.</p>
        </div>
        <div class="story__separator">+</div>
        <div class="story__part">
          <span class="story__word story__word--accent">bandarlog</span>
          <p class="story__def">
            The chattering monkey clan from Kipling's <em>The Jungle Book</em>—
            they see everything and never forget. That's what your logs should do.
          </p>
        </div>
      </div>
      <p class="story__footer">
        Also: <em>be under log</em>. Everything your system does, captured.
      </p>
    </div>
  </section>
</template>

<style scoped>
.story {
  padding: 96px 24px;
  background: var(--surface);
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}

.story__inner {
  max-width: 860px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 36px;
}

.story__title {
  font-family: var(--font-ui);
  font-size: clamp(28px, 3vw, 40px);
  font-weight: 600;
  letter-spacing: -0.03em;
  color: var(--text);
}

.story__grid {
  display: flex;
  align-items: flex-start;
  gap: 24px;
  flex-wrap: wrap;
}

.story__part {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  min-width: 180px;
}

.story__word {
  font-family: var(--font-mono);
  font-size: 22px;
  font-weight: 500;
  color: var(--text);
  letter-spacing: -0.02em;
}

.story__word--accent { color: var(--brand); }

.story__def {
  font-size: 14px;
  color: var(--muted);
  line-height: 1.65;
}

.story__def em { color: var(--text); font-style: italic; }

.story__separator {
  font-size: 28px;
  color: var(--border);
  padding-top: 2px;
  align-self: flex-start;
  margin-top: 2px;
}

.story__footer {
  font-size: 15px;
  color: var(--muted);
  padding-top: 8px;
  border-top: 1px solid var(--border);
  line-height: 1.6;
}

.story__footer em { color: var(--text); }
</style>
