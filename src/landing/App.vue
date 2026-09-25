<script setup lang="ts">
import { BRAND, CONTACT_EMAIL, CTA, type VariantCopy } from '../shared/copy'
import CodeBlock from './CodeBlock.vue'
import Logo from './Logo.vue'
import LogTerminal from './LogTerminal.vue'
import SurveyDialog from './SurveyDialog.vue'
import WaitlistForm from './WaitlistForm.vue'
import { markEngaged, state } from './state'

const props = defineProps<{ copy: VariantCopy }>()
const year = new Date().getFullYear()

function goToForm() {
  markEngaged()
  const input = document.getElementById('email-hero')
  if (input) {
    input.scrollIntoView({ block: 'center' })
    input.focus({ preventScroll: true })
  } else {
    window.scrollTo({ top: 0 })
  }
}
</script>

<template>
  <header class="nav">
    <div class="wrap nav-inner">
      <a href="/" aria-label="Home"><Logo /></a>
      <button v-if="!state.joined" class="btn btn-ghost nav-cta" type="button" @click="goToForm">
        {{ CTA }}
      </button>
    </div>
  </header>

  <main>
    <section class="hero">
      <div class="wrap hero-copy">
        <p class="pill eyebrow"><span class="dot" aria-hidden="true"></span>{{ props.copy.eyebrow }}</p>
        <h1>
          {{ props.copy.headline.pre }}<em>{{ props.copy.headline.em }}</em>{{ props.copy.headline.post }}
        </h1>
        <p class="lede">{{ props.copy.lede }}</p>
        <WaitlistForm id="email-hero" />
        <p class="fine">Free during early access · One email when your invite is ready. No spam.</p>
      </div>
      <div class="horizon" aria-hidden="true"><div class="sun"></div></div>
      <div class="wrap hero-visual">
        <LogTerminal :title="props.copy.termTitle" :lines="props.copy.term" />
      </div>
    </section>

    <section class="wrap problem">
      <p class="pill">The problem</p>
      <h2>{{ props.copy.problemTitle }}</h2>
      <p class="problem-body">{{ props.copy.problem }}</p>
    </section>

    <section class="wrap" aria-labelledby="features-title">
      <h2 id="features-title" class="sr-only">Features</h2>
      <div class="features">
        <article v-for="(f, i) in props.copy.features" :key="f.tag" class="feature">
          <span class="badge mono" aria-hidden="true">{{ String(i + 1).padStart(2, '0') }}</span>
          <p class="tag mono">{{ f.tag }}</p>
          <h3>{{ f.title }}</h3>
          <p>{{ f.body }}</p>
        </article>
      </div>
    </section>

    <section class="wrap how">
      <div>
        <p class="pill">How it works</p>
        <h2>{{ props.copy.howTitle }}</h2>
        <ol class="steps">
          <li v-for="(s, i) in props.copy.steps" :key="i">
            <span class="n mono" aria-hidden="true">{{ i + 1 }}</span>
            <span>{{ s }}</span>
          </li>
        </ol>
      </div>
      <CodeBlock v-bind="props.copy.code" />
    </section>

    <section class="wrap">
      <div class="final">
        <h2>{{ props.copy.finalTitle }}</h2>
        <p>{{ props.copy.finalBody }}</p>
        <WaitlistForm id="email-final" />
        <div class="sun final-sun" aria-hidden="true"></div>
      </div>
    </section>
  </main>

  <footer class="wrap footer">
    <div class="footer-row">
      <Logo />
      <p>
        © {{ year }} {{ BRAND }}. We use your email only to contact you about {{ BRAND }}. To have it deleted, write to
        <a :href="`mailto:${CONTACT_EMAIL}`">{{ CONTACT_EMAIL }}</a>.
      </p>
    </div>
    <p class="wordmark" aria-hidden="true">{{ BRAND }}</p>
  </footer>

  <SurveyDialog :copy="props.copy" />
</template>

<style scoped>
.nav {
  position: sticky;
  top: 0;
  z-index: 10;
  background: color-mix(in srgb, var(--bg) 80%, transparent);
  backdrop-filter: saturate(1.4) blur(12px);
  border-bottom: 1px solid var(--glass-line);
}
.nav-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72px;
}
.nav a {
  text-decoration: none;
}
.nav-cta {
  height: 44px;
  padding: 0 18px;
  font-size: 14px;
}

/* ── hero: centred copy, the sun rising behind the product visual ── */
.hero {
  position: relative;
  padding-top: 88px;
}
.hero::before {
  content: '';
  position: absolute;
  inset: -72px 0 auto;
  height: 900px;
  background:
    linear-gradient(118deg, var(--glass-line) 0%, transparent 34%),
    radial-gradient(ellipse 45% 30% at 50% 62%, var(--glow), transparent 70%);
  /* fade out, or the sheen ends in a hard edge on wide screens */
  mask-image: linear-gradient(to bottom, #000 50%, transparent);
  pointer-events: none;
  z-index: -1;
}
.hero-copy {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
.eyebrow {
  margin-bottom: 28px;
  color: var(--fg-muted);
  font-weight: 500;
}
.dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--sun);
  box-shadow: 0 0 10px var(--glow-strong);
}
h1 {
  max-width: 980px;
  font-size: clamp(40px, 6.6vw, 76px);
  line-height: 1.06;
}
h1 em {
  font-style: normal;
  color: var(--accent);
}
.lede {
  margin: 24px 0 34px;
  max-width: 640px;
  font-size: 19px;
  color: var(--fg-muted);
}
.hero-copy :deep(.wl),
.hero-copy :deep(.joined) {
  width: 100%;
  max-width: 540px;
}
.fine {
  margin-top: 14px;
  font-size: 13.5px;
  color: var(--fg-faint);
}
.horizon {
  position: relative;
  height: 330px;
  margin-top: 24px;
  overflow: hidden;
  /* fade the planet out so its edge never shows beside a narrower visual */
  mask-image: linear-gradient(to bottom, #000 55%, transparent);
}
.horizon .sun {
  top: 70px;
  width: min(1060px, 170vw);
}
.hero-visual {
  position: relative;
  z-index: 1;
  max-width: 1000px;
  margin-top: -190px;
}

/* ── problem ── */
.problem {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding-top: 128px;
  padding-bottom: 72px;
  text-align: center;
}
.problem h2 {
  max-width: 820px;
  font-size: clamp(30px, 4vw, 48px);
}
.problem-body {
  max-width: 720px;
  color: var(--fg-muted);
  font-size: 18px;
}

/* ── features ── */
.features {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}
.feature {
  padding: 30px;
  border: 1px solid var(--glass-line);
  border-radius: var(--radius);
  background: var(--glass);
}
.badge {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border: 1px solid var(--glass-line);
  border-radius: 12px;
  background: var(--glass);
  box-shadow: inset 0 -8px 18px var(--glow);
  color: var(--accent);
  font-size: 14px;
  font-weight: 700;
}
.feature .tag {
  margin-top: 22px;
  font-size: 12.5px;
  color: var(--fg-faint);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.feature h3 {
  font-size: 22px;
  margin: 8px 0 10px;
}
.feature p:not(.tag) {
  color: var(--fg-muted);
  font-size: 16px;
}

/* ── how it works ── */
.how {
  display: grid;
  grid-template-columns: minmax(0, 5fr) minmax(0, 6fr);
  gap: 72px;
  align-items: center;
  padding-top: 144px;
  padding-bottom: 144px;
}
.how h2 {
  font-size: clamp(30px, 3.6vw, 42px);
  margin-top: 20px;
}
.steps {
  list-style: none;
  padding: 0;
  margin: 32px 0 0;
  display: grid;
  gap: 18px;
}
.steps li {
  display: flex;
  gap: 14px;
  align-items: baseline;
  color: var(--fg-muted);
}
.steps .n {
  flex: 0 0 30px;
  height: 30px;
  display: grid;
  place-items: center;
  border: 1px solid var(--glass-line);
  border-radius: 9px;
  background: var(--glass);
  box-shadow: inset 0 -6px 14px var(--glow);
  color: var(--accent);
  font-size: 13px;
  font-weight: 700;
  transform: translateY(-2px);
}

/* ── final call to action: a second sunrise ── */
.final {
  position: relative;
  display: grid;
  justify-items: center;
  align-content: start;
  text-align: center;
  gap: 16px;
  min-height: 520px;
  padding: 88px 24px 0;
  border: 1px solid var(--glass-line);
  border-radius: 32px;
  background: var(--glass);
  overflow: hidden;
  isolation: isolate;
}
.final h2 {
  font-size: clamp(32px, 4.4vw, 54px);
}
.final p {
  color: var(--fg-muted);
  max-width: 520px;
  margin-bottom: 14px;
}
.final :deep(.wl),
.final :deep(.joined) {
  width: 100%;
  max-width: 540px;
  text-align: left;
}
.final-sun {
  top: 380px;
  width: min(1000px, 160vw);
  z-index: -1;
}

/* ── footer ── */
.footer {
  padding-top: 72px;
  overflow: hidden;
}
.footer-row {
  display: flex;
  gap: 24px;
  align-items: flex-start;
  justify-content: space-between;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--glass-line);
  color: var(--fg-faint);
  font-size: 13.5px;
}
.footer-row p {
  max-width: 560px;
  text-align: right;
}
.wordmark {
  margin-top: 8px;
  font-size: clamp(88px, 21vw, 260px);
  font-weight: 700;
  letter-spacing: -0.04em;
  line-height: 0.8;
  text-align: center;
  color: var(--glass-line);
  user-select: none;
  white-space: nowrap;
}

@media (max-width: 900px) {
  .how {
    grid-template-columns: minmax(0, 1fr);
    gap: 40px;
    padding-top: 96px;
    padding-bottom: 96px;
  }
  .hero {
    padding-top: 56px;
  }
  .horizon {
    height: 240px;
  }
  .hero-visual {
    margin-top: -130px;
  }
  .problem {
    padding-top: 96px;
  }
}
@media (max-width: 640px) {
  .wrap {
    padding: 0 16px;
  }
  .features {
    grid-template-columns: minmax(0, 1fr);
  }
  .lede {
    font-size: 17px;
  }
  .footer-row {
    flex-direction: column;
  }
  .footer-row p {
    text-align: left;
  }
  .final {
    min-height: 560px;
    padding-top: 64px;
  }
  .final-sun {
    top: 420px;
  }
}
</style>
