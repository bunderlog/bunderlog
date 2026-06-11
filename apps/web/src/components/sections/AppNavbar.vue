<script setup lang="ts">
import { BrandLogo, BaseButton, ThemeToggle } from '@/components/ui'

const links = [
  { href: '#features',     label: 'Features' },
  { href: '#how-it-works', label: 'How it works' },
  { href: '#pricing',      label: 'Pricing' },
  { href: '#',             label: 'Docs' },
]
</script>

<template>
  <header class="sticky top-0 z-[100] bg-page/85 backdrop-blur-[12px] border-b border-border">
    <nav class="max-w-[1200px] mx-auto px-6 h-[60px] flex items-center gap-10">
      <BrandLogo size="md" />

      <ul class="hidden sm:flex items-center gap-1 list-none flex-1">
        <li v-for="link in links" :key="link.href">
          <a
            :href="link.href"
            class="text-sm text-muted px-2.5 py-1.5 rounded-[5px] transition-colors duration-150 hover:text-fg hover:bg-elevated"
          >{{ link.label }}</a>
        </li>
      </ul>

      <div class="flex items-center gap-1.5">
        <ThemeToggle />
        <BaseButton variant="ghost" size="sm" href="#">Sign in</BaseButton>
        <BaseButton variant="primary" size="sm" href="#pricing">Get started</BaseButton>
      </div>
    </nav>
  </header>
</template>
