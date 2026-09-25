<script setup lang="ts">
import { ref, watch } from 'vue'
import { TEAM_SIZES, type VariantCopy } from '../shared/copy'
import { state } from './state'

const props = defineProps<{ copy: VariantCopy }>()

const dialog = ref<HTMLDialogElement>()
const role = ref('')
const teamSize = ref('')
const pain = ref('')
const busy = ref(false)
const sent = ref(false)

watch(
  () => state.surveyToken,
  (token) => token && dialog.value?.showModal(),
)

function close() {
  dialog.value?.close()
  state.surveyToken = ''
}

async function submit() {
  busy.value = true
  try {
    await fetch('/api/profile', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ token: state.surveyToken, role: role.value, teamSize: teamSize.value, pain: pain.value }),
    })
  } catch {
    /* optional survey: never block the visitor on it */
  }
  busy.value = false
  sent.value = true
  setTimeout(close, 1400)
}
</script>

<template>
  <dialog ref="dialog" class="survey" aria-labelledby="survey-title" @close="state.surveyToken = ''">
    <div v-if="sent" class="sent" role="status">
      <h2 id="survey-title">Thank you!</h2>
      <p>That genuinely helps us decide what to build first.</p>
    </div>
    <form v-else @submit.prevent="submit">
      <p class="kicker mono">✓ you’re on the list</p>
      <h2 id="survey-title">Two quick questions?</h2>
      <p class="sub">Optional — it helps us decide who to invite first.</p>

      <fieldset>
        <legend>What best describes your role?</legend>
        <div class="chips">
          <label v-for="r in props.copy.roles" :key="r" class="chip">
            <input v-model="role" type="radio" name="role" :value="r" />
            <span>{{ r }}</span>
          </label>
        </div>
      </fieldset>

      <fieldset>
        <legend>How big is your engineering team?</legend>
        <div class="chips">
          <label v-for="s in TEAM_SIZES" :key="s" class="chip">
            <input v-model="teamSize" type="radio" name="team" :value="s" />
            <span>{{ s }}</span>
          </label>
        </div>
      </fieldset>

      <label class="q" for="pain">{{ props.copy.painQuestion }}</label>
      <textarea id="pain" v-model="pain" class="input" rows="3" maxlength="2000" placeholder="A sentence or two is plenty"></textarea>

      <div class="actions">
        <button type="button" class="btn btn-ghost" @click="close">Skip</button>
        <button type="submit" class="btn" :disabled="busy || (!role && !teamSize && !pain.trim())">
          {{ busy ? 'Sending…' : 'Send answers' }}
        </button>
      </div>
    </form>
  </dialog>
</template>

<style scoped>
.survey {
  width: min(560px, calc(100vw - 32px));
  max-height: calc(100dvh - 32px);
  padding: 32px;
  border: 1px solid var(--glass-line);
  border-radius: 24px;
  background: var(--bg-raised);
  color: var(--fg);
  box-shadow:
    inset 0 -40px 80px var(--glow),
    0 30px 80px -20px rgb(0 0 0 / 0.5);
}
.survey::backdrop {
  background: rgb(6 9 16 / 0.65);
  backdrop-filter: blur(4px);
}
.kicker {
  display: inline-block;
  padding: 5px 12px;
  border: 1px solid var(--glass-line);
  border-radius: 999px;
  background: var(--glass);
  color: var(--accent);
  font-size: 12.5px;
  margin-bottom: 14px;
}
h2 {
  font-size: 28px;
}
.sub {
  color: var(--fg-muted);
  margin-top: 6px;
  font-size: 15px;
}
fieldset {
  border: 0;
  margin: 22px 0 0;
  padding: 0;
}
legend,
.q {
  display: block;
  font-weight: 600;
  font-size: 15px;
  margin-bottom: 10px;
}
.q {
  margin-top: 22px;
}
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.chip input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}
.chip span {
  display: inline-block;
  padding: 8px 14px;
  border: 1px solid var(--glass-line);
  border-radius: 999px;
  background: var(--glass);
  font-size: 14px;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
}
.chip span:hover {
  border-color: var(--fg-faint);
}
.chip input:checked + span {
  border-color: var(--accent);
  background: var(--accent-soft);
  box-shadow: inset 0 -6px 14px var(--glow);
}
.chip input:focus-visible + span {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
textarea.input {
  width: 100%;
  height: auto;
  padding: 10px 14px;
  resize: vertical;
}
.actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 22px;
}
.sent {
  text-align: center;
  padding: 16px 0;
}
.sent p {
  color: var(--fg-muted);
  margin-top: 8px;
}
</style>
