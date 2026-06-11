<script setup lang="ts">
import { BrandLogo, BaseButton } from '@/components/ui'
</script>

<template>
  <header class="navbar">
    <nav class="navbar__inner">
      <BrandLogo size="md" />

      <ul class="navbar__links">
        <li><a href="#features" class="navbar__link">Features</a></li>
        <li><a href="#how-it-works" class="navbar__link">How it works</a></li>
        <li><a href="#pricing" class="navbar__link">Pricing</a></li>
        <li><a href="#" class="navbar__link">Docs</a></li>
      </ul>

      <div class="navbar__actions">
        <BaseButton variant="ghost" size="sm" href="#">Sign in</BaseButton>
        <BaseButton variant="primary" size="sm" href="#pricing">Get started</BaseButton>
      </div>
    </nav>
  </header>
</template>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(15, 17, 23, 0.85);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
}

.navbar__inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  height: 60px;
  display: flex;
  align-items: center;
  gap: 40px;
}

.navbar__links {
  display: flex;
  align-items: center;
  gap: 4px;
  list-style: none;
  flex: 1;
}

.navbar__link {
  font-size: 14px;
  font-weight: 400;
  color: var(--muted);
  padding: 6px 10px;
  border-radius: 5px;
  transition: color 0.15s, background 0.15s;
}

.navbar__link:hover {
  color: var(--text);
  background: var(--elevated);
}

.navbar__actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

@media (max-width: 640px) {
  .navbar__links { display: none; }
}
</style>
