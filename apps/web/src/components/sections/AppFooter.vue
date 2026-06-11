<script setup lang="ts">
import { BrandLogo } from '@/components/ui'

const year = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="footer__inner">
      <div class="footer__brand">
        <BrandLogo size="sm" />
        <p class="footer__tagline">Log management built for the edge.</p>
      </div>

      <nav class="footer__nav">
        <div class="footer__col">
          <p class="footer__col-title">Product</p>
          <ul class="footer__links">
            <li><a href="#features" class="footer__link">Features</a></li>
            <li><a href="#pricing" class="footer__link">Pricing</a></li>
            <li><a href="#" class="footer__link">Changelog</a></li>
          </ul>
        </div>
        <div class="footer__col">
          <p class="footer__col-title">Developers</p>
          <ul class="footer__links">
            <li><a href="#" class="footer__link">Documentation</a></li>
            <li><a href="#" class="footer__link">SDK Reference</a></li>
            <li><a href="#" class="footer__link">GitHub</a></li>
          </ul>
        </div>
        <div class="footer__col">
          <p class="footer__col-title">Company</p>
          <ul class="footer__links">
            <li><a href="#" class="footer__link">About</a></li>
            <li><a href="#" class="footer__link">Privacy</a></li>
            <li><a href="#" class="footer__link">Terms</a></li>
          </ul>
        </div>
      </nav>
    </div>

    <div class="footer__bottom">
      <p class="footer__copy">© {{ year }} Bunderlog. Built on Cloudflare.</p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: var(--surface);
  border-top: 1px solid var(--border);
}

.footer__inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 64px 24px 40px;
  display: flex;
  gap: 64px;
  flex-wrap: wrap;
}

.footer__brand {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
  min-width: 180px;
}

.footer__tagline {
  font-size: 14px;
  color: var(--muted);
  max-width: 220px;
  line-height: 1.5;
}

.footer__nav {
  display: flex;
  gap: 48px;
  flex-wrap: wrap;
}

.footer__col {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 120px;
}

.footer__col-title {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted);
}

.footer__links {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.footer__link {
  font-size: 14px;
  color: var(--muted);
  transition: color 0.15s;
}

.footer__link:hover { color: var(--text); }

.footer__bottom {
  border-top: 1px solid var(--border);
  padding: 20px 24px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.footer__copy {
  font-size: 13px;
  color: var(--muted);
}
</style>
