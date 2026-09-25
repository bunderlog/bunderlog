<script setup lang="ts">
import { ref } from 'vue'
import { CONTACT_EMAIL, CTA } from '../shared/copy'
import { exp, markEngaged, markJoined, state } from './state'

const props = defineProps<{ id: string }>()

// When the API is down or past the free plan's daily limit, the email is the only way left to sign up.
const FALLBACK = `Something went wrong on our side. Email ${CONTACT_EMAIL} and we’ll add you by hand.`

const email = ref('')
const website = ref('') // honeypot
const busy = ref(false)
const error = ref('')

async function submit() {
  error.value = ''
  const value = email.value.trim()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    error.value = 'Please enter a valid email address.'
    return
  }
  busy.value = true
  try {
    const res = await fetch('/api/waitlist', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        email: value,
        website: website.value,
        variant: exp.variant,
        visitor: exp.visitor,
        forced: exp.forced,
        test: exp.noTrack,
        ...exp.attribution,
      }),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok || !data.ok) {
      // 4xx answers from our API explain themselves (bad email, too many attempts); anything else gets the fallback.
      error.value = res.status < 500 && data.error ? data.error : FALLBACK
      return
    }
    markJoined(data)
  } catch {
    error.value = `Network error. Check your connection and try again, or email ${CONTACT_EMAIL}.`
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <div v-if="state.joined" class="joined" role="status">
    <span class="check" aria-hidden="true">✓</span>
    <span>
      <strong>You’re on the list.</strong>
      {{ state.duplicate ? 'You’d already signed up — we’ll be in touch.' : 'We’ll email you when your invite is ready.' }}
    </span>
  </div>
  <form v-else class="wl" novalidate @submit.prevent="submit">
    <label :for="props.id" class="sr-only">Work email</label>
    <input
      :id="props.id"
      v-model="email"
      class="input"
      type="email"
      name="email"
      autocomplete="email"
      inputmode="email"
      placeholder="you@company.com"
      required
      :aria-invalid="!!error"
      :aria-describedby="error ? `${props.id}-err` : undefined"
      @focus="markEngaged"
    />
    <div class="hp" aria-hidden="true">
      <label>Website <input v-model="website" name="website" tabindex="-1" autocomplete="off" /></label>
    </div>
    <button class="btn" type="submit" :disabled="busy">{{ busy ? 'Joining…' : CTA }}</button>
    <p v-if="error" :id="`${props.id}-err`" class="err" role="alert">{{ error }}</p>
  </form>
</template>

<style scoped>
/* One glass pill holding the field and the button. */
.wl {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  max-width: 540px;
  padding: 6px;
  border: 1px solid var(--glass-line);
  border-radius: 18px;
  background: var(--glass);
  box-shadow: 0 18px 50px var(--glow);
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;
}
.wl:focus-within {
  border-color: var(--accent);
  box-shadow:
    0 0 0 3px var(--glow),
    0 18px 50px var(--glow);
}
.wl .input {
  flex: 1 1 220px;
  border: 0;
  background: transparent;
  box-shadow: none;
}
.wl .input:focus {
  box-shadow: none;
}
.wl .btn {
  flex: 0 0 auto;
}
.hp {
  position: absolute;
  left: -10000px;
  width: 1px;
  height: 1px;
  overflow: hidden;
}
.err {
  flex-basis: 100%;
  padding: 2px 12px 6px;
  color: var(--danger);
  font-size: 14px;
  text-align: left;
}
.joined {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  max-width: 540px;
  padding: 16px 18px;
  border: 1px solid var(--glass-line);
  border-radius: 18px;
  background: var(--glass);
  box-shadow: inset 0 -12px 30px var(--glow);
  font-size: 15px;
  text-align: left;
}
.check {
  display: grid;
  place-items: center;
  flex: 0 0 24px;
  height: 24px;
  border-radius: 50%;
  background: linear-gradient(180deg, var(--sun-light), var(--sun));
  color: var(--on-sun);
  font-size: 13px;
  font-weight: 700;
}
@media (max-width: 480px) {
  .wl .btn {
    flex: 1 1 100%;
  }
}
</style>
