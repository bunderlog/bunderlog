<script setup lang="ts">
import { CompatTag } from '@/components/ui'

const platforms = ['Node.js', 'Cloudflare Workers', 'Browser', 'Bun', 'Deno', 'Next.js', 'Hono']
</script>

<template>
  <section class="proof">
    <div class="proof__inner">
      <p class="proof__label">Works everywhere you ship</p>
      <div class="proof__tags">
        <CompatTag v-for="p in platforms" :key="p" :label="p" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.proof {
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  background: var(--surface);
  padding: 28px 24px;
}

.proof__inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
}

.proof__label {
  font-size: 13px;
  font-weight: 500;
  color: var(--muted);
  white-space: nowrap;
  flex-shrink: 0;
}

.proof__tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
</style>
