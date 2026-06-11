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

The app is a scaffold — only the bare minimum exists:

- `src/App.vue` — placeholder template, no real content
- `src/main.ts` — mounts the app
- `src/router/index.ts` — router with empty routes array
- `src/stores/counter.ts` — default Pinia example store (to be deleted)
- `tests/main.test.ts` — minimal smoke test

No components, no composables, no real pages yet. The target structure is defined in the root `CLAUDE.md`.

---

## Target Structure

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
│   │   ├── SectionLabel.vue
│   │   ├── SectionTitle.vue
│   │   ├── LogLevelBadge.vue
│   │   ├── CompatTag.vue
│   │   └── BrandLogo.vue
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
│   ├── useLiveTail.ts
│   ├── useLogSearch.ts
│   └── useScrollFade.ts
├── stores/
│   └── logsStore.ts
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
- No Chart.js or VueUse yet — add when building the dashboard, not before
- `counter.ts` store is scaffolding — delete it when building real stores
