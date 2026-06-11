# CLAUDE.md — apps/web

This app is the Bunderlog dashboard and landing page, built with Vue 3 (beta channel) and deployed to Cloudflare Pages.

---

## Commands

```bash
bun run dev          # dev server at http://localhost:5173 (bound to 0.0.0.0)
bun run build        # type-check + vite build
bun run type-check   # vue-tsc only
bun run lint         # oxlint --fix src
bun run test         # vitest with coverage (jsdom environment)
```

---

## Current State

Landing page is fully built. Dashboard is not started.

- `src/App.vue` — mounts `LandingLayout` with all sections
- `src/main.ts` — calls `useTheme().initTheme()` before mount
- `src/router/index.ts` — router with empty routes array (dashboard routes pending)
- `src/components/` — all landing page components exist (sections, ui, hero, features, pricing)
- `src/composables/useTheme.ts` — dark/light theme, module-level singleton
- `tests/main.test.ts` — smoke test for main entrypoint

No stores, no dashboard components, no `useLiveTail` / `useLogSearch` / `useScrollFade` yet.

---

## Structure

```
src/
├── components/
│   ├── layout/
│   │   └── LandingLayout.vue
│   ├── sections/             # one file per landing page section
│   │   ├── AppNavbar.vue
│   │   ├── HeroSection.vue
│   │   ├── SocialProofBar.vue
│   │   ├── FeaturesSection.vue
│   │   ├── HowItWorksSection.vue
│   │   ├── DashboardPreview.vue
│   │   ├── CodeSection.vue
│   │   ├── PricingSection.vue
│   │   ├── NameStorySection.vue
│   │   ├── CtaSection.vue
│   │   └── AppFooter.vue
│   ├── ui/                   # atomic, no business logic
│   │   ├── index.ts          # barrel export — mandatory
│   │   ├── BaseButton.vue
│   │   ├── BrandLogo.vue
│   │   ├── CompatTag.vue
│   │   ├── LogLevelBadge.vue
│   │   ├── SectionLabel.vue
│   │   ├── SectionTitle.vue
│   │   └── ThemeToggle.vue
│   ├── hero/
│   │   ├── TerminalPreview.vue
│   │   └── CtaButtons.vue
│   ├── pricing/
│   │   └── PricingCard.vue
│   └── features/
│       ├── FeatureCard.vue
│       ├── StepCard.vue
│       └── LogRow.vue
├── composables/              # filenames must start with 'use'
│   ├── useTheme.ts
│   ├── useLiveTail.ts        # [planned]
│   ├── useLogSearch.ts       # [planned]
│   └── useScrollFade.ts      # [planned]
├── stores/
│   └── logsStore.ts          # [planned]
└── App.vue
```

---

## Import Rules

- `@/components/ui` — always import from `@/components/ui` (barrel), **never** directly from the file (`@/components/ui/BaseButton.vue` is forbidden)
- Cross-folder imports — use `@/` alias
- Same-folder imports — use relative `./`

---

## SFC Order

```vue
<script setup lang="ts">
</script>

<template>
</template>

<style scoped>
</style>
```

`<script>` first, then `<template>`, then `<style>`. Always `lang="ts"` on script. Always `scoped` on style unless there is an explicit reason not to.

---

## Linting

- **oxlint** handles `.ts` / `.js` files (`bun run lint`)
- **ESLint** (via `eslint-plugin-vue-modular`) handles `.vue` files — config not yet created (see root `CLAUDE.md` for target config)
- **oxfmt** is the formatter — no Prettier

---

## Testing

- Framework: **Vitest** with **jsdom** environment
- Utils: `@vue/test-utils`
- Coverage: `lcovonly` + `text` reporters, output to `coverage/lcov.info`
- Run via `bun run test` — always runs with coverage

---

## Notes

- Vue 3 **beta channel** — all `@vue/*` packages pinned to `beta` via `overrides`
- `@` alias resolves to `src/`
- No Chart.js or VueUse yet — add when building the dashboard
- `stores/` and dashboard composables (`useLiveTail`, `useLogSearch`, `useScrollFade`) are next after backend is ready
