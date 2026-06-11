<script setup lang="ts">
import { BrandLogo } from '@/components/ui'

const year = new Date().getFullYear()
</script>

<template>
  <footer class="bg-surface border-t border-border">
    <div class="max-w-[1200px] mx-auto px-6 pt-16 pb-10 flex gap-16 flex-wrap">
      <div class="flex flex-col gap-3 flex-1 min-w-[180px]">
        <BrandLogo size="sm" />
        <p class="text-sm text-muted max-w-[220px] leading-relaxed">Log management built for the edge.</p>
      </div>

      <nav class="flex gap-12 flex-wrap">
        <div class="flex flex-col gap-3 min-w-[120px]">
          <p class="text-[12px] font-semibold tracking-[0.08em] uppercase text-muted">Product</p>
          <ul class="flex flex-col gap-2 list-none">
            <li><a href="#features"  class="text-sm text-muted hover:text-fg transition-colors duration-150">Features</a></li>
            <li><a href="#pricing"   class="text-sm text-muted hover:text-fg transition-colors duration-150">Pricing</a></li>
            <li><a href="#"          class="text-sm text-muted hover:text-fg transition-colors duration-150">Changelog</a></li>
          </ul>
        </div>
        <div class="flex flex-col gap-3 min-w-[120px]">
          <p class="text-[12px] font-semibold tracking-[0.08em] uppercase text-muted">Developers</p>
          <ul class="flex flex-col gap-2 list-none">
            <li><a href="#" class="text-sm text-muted hover:text-fg transition-colors duration-150">Documentation</a></li>
            <li><a href="#" class="text-sm text-muted hover:text-fg transition-colors duration-150">SDK Reference</a></li>
            <li><a href="#" class="text-sm text-muted hover:text-fg transition-colors duration-150">GitHub</a></li>
          </ul>
        </div>
        <div class="flex flex-col gap-3 min-w-[120px]">
          <p class="text-[12px] font-semibold tracking-[0.08em] uppercase text-muted">Company</p>
          <ul class="flex flex-col gap-2 list-none">
            <li><a href="#" class="text-sm text-muted hover:text-fg transition-colors duration-150">About</a></li>
            <li><a href="#" class="text-sm text-muted hover:text-fg transition-colors duration-150">Privacy</a></li>
            <li><a href="#" class="text-sm text-muted hover:text-fg transition-colors duration-150">Terms</a></li>
          </ul>
        </div>
      </nav>
    </div>

    <div class="border-t border-border max-w-[1200px] mx-auto px-6 py-5">
      <p class="text-[13px] text-muted">© {{ year }} Bunderlog. Built on Cloudflare.</p>
    </div>
  </footer>
</template>
