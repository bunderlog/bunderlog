<script setup lang="ts">
import { CompatTag } from '@/components/ui'

const platforms = ['Node.js', 'Cloudflare Workers', 'Browser', 'Bun', 'Deno', 'Next.js', 'Hono']
</script>

<template>
  <section class="border-t border-b border-border bg-surface py-7 px-6">
    <div class="max-w-[1200px] mx-auto flex items-center gap-6 flex-wrap">
      <p class="text-[13px] font-medium text-muted whitespace-nowrap shrink-0">Works everywhere you ship</p>
      <div class="flex gap-2 flex-wrap">
        <CompatTag v-for="p in platforms" :key="p" :label="p" />
      </div>
    </div>
  </section>
</template>
