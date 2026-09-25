<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { BRAND, COPY } from '../shared/copy'
import { storage, VARIANTS, type Variant } from '../shared/experiment'
import { probabilityBest, sampleSizePerArm, wilson } from './math'

interface VariantStats {
  variant: Variant
  visitors: number
  engaged: number
  signups: number
  profiles: number
}
interface Stats {
  variants: VariantStats[]
  sources: { source: string; variant: Variant; visitors: number; signups: number }[] | null
  roles: { variant: Variant; value: string; n: number }[] | null
  teamSizes: { variant: Variant; value: string; n: number }[] | null
  notes: { ts: string; variant: Variant; source: string; role: string; teamSize: string; pain: string }[] | null
  allSources: string[] | null
  unseenSignups: number
}

// The finish line, fixed before the test starts: 600 visitors per variant or 4 weeks, whichever comes first.
// Reading a winner off earlier numbers is how peeking produces false winners.
const TARGET_VISITORS = 600

const token = ref(storage.get('bl_stats_token') || '')
const tokenInput = ref('')
const filters = reactive({ from: '', source: '', assign: 'random' })
const data = ref<Stats | null>(null)
const loading = ref(false)
const error = ref('')

const letter = (v: Variant) => v.toUpperCase()
const pct = (x: number, digits = 1) => `${(x * 100).toFixed(digits)}%`

async function authed(path: string) {
  const res = await fetch(path, { headers: { Authorization: `Bearer ${token.value}` } })
  if (res.status === 401) {
    token.value = ''
    storage.remove('bl_stats_token')
    throw new Error('Wrong token.')
  }
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`)
  return res
}

async function load() {
  if (!token.value) return
  loading.value = true
  error.value = ''
  try {
    const qs = new URLSearchParams({ assign: filters.assign })
    if (filters.from) qs.set('from', filters.from)
    if (filters.source) qs.set('source', filters.source)
    data.value = await (await authed(`/api/stats?${qs}`)).json()
  } catch (e) {
    error.value = (e as Error).message
  } finally {
    loading.value = false
  }
}

function saveToken() {
  token.value = tokenInput.value.trim()
  storage.set('bl_stats_token', token.value)
  load()
}

async function exportCsv() {
  try {
    const blob = await (await authed('/api/export.csv')).blob()
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `${BRAND}-waitlist-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(a.href)
  } catch (e) {
    error.value = (e as Error).message
  }
}

const rows = computed(() => {
  if (!data.value) return []
  const vs = data.value.variants
  const best = probabilityBest(vs.map((v) => ({ successes: v.signups, n: v.visitors })))
  return vs.map((v, i) => ({
    ...v,
    label: COPY[v.variant].label,
    ci: wilson(v.signups, v.visitors),
    engagedRate: v.visitors ? v.engaged / v.visitors : 0,
    pBest: best[i],
  }))
})

const scaleMax = computed(() => {
  const hi = Math.max(0, ...rows.value.map((r) => r.ci.hi))
  if (hi === 0) return 0.05
  const step = hi > 0.2 ? 0.1 : hi > 0.1 ? 0.05 : hi > 0.04 ? 0.02 : 0.01
  return Math.ceil(hi / step) * step
})
const ticks = computed(() => {
  const max = scaleMax.value
  return [0, 0.25, 0.5, 0.75, 1].map((f) => f * max)
})

const verdict = computed(() => {
  const r = rows.value
  if (!r.length) return null
  const minVisitors = Math.min(...r.map((x) => x.visitors))
  const sorted = [...r].sort((a, b) => b.ci.p - a.ci.p)
  const leader = [...r].sort((a, b) => b.pBest - a.pBest)[0]
  const lead = `${letter(leader.variant)} · ${leader.label} leads with ${pct(leader.pBest, 0)} probability of being best`
  if (minVisitors < TARGET_VISITORS) {
    const sofar = minVisitors >= 30 ? ` For now, ${lead}.` : ''
    return {
      tone: 'wait',
      text: `Collecting data — ${minVisitors} of ${TARGET_VISITORS} visitors per variant (or stop at 4 weeks). Don’t pick a winner before the finish line.${sofar}`,
    }
  }
  if (leader.pBest >= 0.95) return { tone: 'win', text: `Finish line reached: ${lead}.` }
  const [first, second] = sorted
  const need = sampleSizePerArm(first.ci.p, second.ci.p)
  const needText = Number.isFinite(need)
    ? ` Separating ${letter(first.variant)} from ${letter(second.variant)} at these rates would take about ${need.toLocaleString()} visitors per variant.`
    : ''
  return {
    tone: 'wait',
    text: `Finish line reached without a clear winner: ${lead}.${needText} Decide with the survey answers and interviews.`,
  }
})

const sourceRows = computed(() => {
  const map = new Map<string, Record<string, { visitors: number; signups: number }>>()
  for (const s of data.value?.sources ?? []) {
    if (!map.has(s.source)) map.set(s.source, {})
    map.get(s.source)![s.variant] = { visitors: s.visitors, signups: s.signups }
  }
  return [...map.entries()]
    .map(([source, byVariant]) => ({
      source,
      byVariant,
      total: Object.values(byVariant).reduce((n, x) => n + x.visitors, 0),
    }))
    .sort((a, b) => b.total - a.total)
})

function answers(list: { variant: Variant; value: string; n: number }[] | null, v: Variant) {
  return (list ?? []).filter((x) => x.variant === v)
}

const tip = reactive({ show: false, x: 0, y: 0, row: null as (typeof rows.value)[number] | null })
function showTip(e: MouseEvent | FocusEvent, row: (typeof rows.value)[number]) {
  const el = e.currentTarget as HTMLElement
  const box = el.getBoundingClientRect()
  const x = e instanceof MouseEvent ? e.clientX : box.left + box.width / 2
  tip.x = Math.min(x, window.innerWidth - 240)
  tip.y = box.top
  tip.row = row
  tip.show = true
}

onMounted(load)
</script>

<template>
  <div class="page">
    <header class="head">
      <div>
        <p class="kicker mono">{{ BRAND }} · positioning experiment</p>
        <h1>Which positioning makes people sign up?</h1>
      </div>
      <button v-if="token" class="btn btn-ghost" type="button" @click="exportCsv">Export waitlist CSV</button>
    </header>

    <form v-if="!token" class="token" @submit.prevent="saveToken">
      <label for="tok">Stats token (STATS_TOKEN on the server)</label>
      <div class="row">
        <input id="tok" v-model="tokenInput" class="input" type="password" autocomplete="current-password" />
        <button class="btn" type="submit">Open</button>
      </div>
      <p v-if="error" class="err">{{ error }}</p>
    </form>

    <template v-else>
      <form class="filters" @change="load" @submit.prevent="load">
        <label>
          <span>Since</span>
          <input v-model="filters.from" class="input" type="date" />
        </label>
        <label>
          <span>Traffic source</span>
          <select v-model="filters.source" class="input">
            <option value="">All sources</option>
            <option v-for="s in data?.allSources ?? []" :key="s" :value="s">{{ s }}</option>
          </select>
        </label>
        <label>
          <span>Assignment</span>
          <select v-model="filters.assign" class="input">
            <option value="random">Random split only (the A/B test)</option>
            <option value="forced">Forced via ?v= links</option>
            <option value="all">Everything</option>
          </select>
        </label>
        <button class="btn btn-ghost" type="submit" :disabled="loading">{{ loading ? 'Loading…' : 'Refresh' }}</button>
      </form>

      <p v-if="error" class="err">{{ error }}</p>

      <template v-if="data">
        <p v-if="verdict" class="verdict" :class="verdict.tone">{{ verdict.text }}</p>

        <section class="card">
          <h2>Waitlist conversion by variant</h2>
          <p class="sub">Signups ÷ unique visitors. Whiskers show the 95% interval — overlapping whiskers mean it’s too early to tell.</p>
          <div class="chart" role="img" :aria-label="rows.map((r) => `${r.label}: ${pct(r.ci.p)}`).join(', ')">
            <div class="axis" aria-hidden="true">
              <span v-for="t in ticks" :key="t" :style="{ left: `${(t / scaleMax) * 100}%` }">{{ pct(t, t && t < 0.1 ? 1 : 0) }}</span>
            </div>
            <div
              v-for="r in rows"
              :key="r.variant"
              class="bar-row"
              tabindex="0"
              @mouseenter="showTip($event, r)"
              @mousemove="showTip($event, r)"
              @mouseleave="tip.show = false"
              @focus="showTip($event, r)"
              @blur="tip.show = false"
            >
              <span class="bar-label"><b class="mono">{{ letter(r.variant) }}</b> {{ r.label }}</span>
              <div class="track">
                <i v-for="t in ticks" :key="t" class="grid" :style="{ left: `${(t / scaleMax) * 100}%` }"></i>
                <div class="bar" :style="{ width: `${(r.ci.p / scaleMax) * 100}%` }"></div>
                <div
                  class="whisker"
                  :style="{ left: `${(r.ci.lo / scaleMax) * 100}%`, width: `${((r.ci.hi - r.ci.lo) / scaleMax) * 100}%` }"
                ></div>
              </div>
              <span class="bar-value mono">{{ pct(r.ci.p) }}</span>
            </div>
          </div>
        </section>

        <section class="card">
          <h2>Funnel</h2>
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Variant</th>
                  <th class="num">Visitors</th>
                  <th class="num">Engaged</th>
                  <th class="num">Signups</th>
                  <th class="num">Conversion</th>
                  <th class="num">95% interval</th>
                  <th class="num">P(best)</th>
                  <th class="num">Answered survey</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="r in rows" :key="r.variant">
                  <td><b class="mono">{{ letter(r.variant) }}</b> {{ r.label }}</td>
                  <td class="num">{{ r.visitors.toLocaleString() }}</td>
                  <td class="num">{{ pct(r.engagedRate) }}</td>
                  <td class="num">{{ r.signups.toLocaleString() }}</td>
                  <td class="num"><b>{{ pct(r.ci.p) }}</b></td>
                  <td class="num muted">{{ pct(r.ci.lo) }} – {{ pct(r.ci.hi) }}</td>
                  <td class="num">{{ pct(r.pBest, 0) }}</td>
                  <td class="num">{{ r.profiles }} / {{ r.signups }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p class="sub foot">
            <b>Engaged</b> = focused the email field or clicked a CTA. High engagement with low signups points to friction in the
            form rather than weak positioning.
          </p>
          <p v-if="data.unseenSignups" class="sub foot">
            {{ data.unseenSignups }} signup{{ data.unseenSignups === 1 ? '' : 's' }} not counted: the visitor never sent a view (for example, a
            blocked script). Still on the waitlist and in the CSV.
          </p>
        </section>

        <section class="card">
          <h2>By traffic source</h2>
          <p class="sub">Visitors → signups per variant. Compare variants within a row; different sources convert very differently.</p>
          <div class="table-wrap">
            <table v-if="sourceRows.length">
              <thead>
                <tr>
                  <th>Source</th>
                  <th v-for="v in VARIANTS" :key="v" class="num">{{ letter(v) }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="s in sourceRows" :key="s.source">
                  <td class="mono">{{ s.source }}</td>
                  <td v-for="v in VARIANTS" :key="v" class="num">
                    <template v-if="s.byVariant[v]">
                      {{ s.byVariant[v].signups }} / {{ s.byVariant[v].visitors }}
                      <span class="muted">({{ pct(s.byVariant[v].visitors ? s.byVariant[v].signups / s.byVariant[v].visitors : 0) }})</span>
                    </template>
                    <span v-else class="muted">—</span>
                  </td>
                </tr>
              </tbody>
            </table>
            <p v-else class="muted">No traffic yet.</p>
          </div>
        </section>

        <section class="card">
          <h2>Who signed up</h2>
          <div class="who">
            <div v-for="v in VARIANTS" :key="v" class="who-col">
              <h3><b class="mono">{{ letter(v) }}</b> {{ COPY[v].label }}</h3>
              <p class="mini">Role</p>
              <ul>
                <li v-for="a in answers(data.roles, v)" :key="a.value"><span>{{ a.value }}</span><b class="mono">{{ a.n }}</b></li>
                <li v-if="!answers(data.roles, v).length" class="muted">No answers yet</li>
              </ul>
              <p class="mini">Team size</p>
              <ul>
                <li v-for="a in answers(data.teamSizes, v)" :key="a.value"><span>{{ a.value }}</span><b class="mono">{{ a.n }}</b></li>
                <li v-if="!answers(data.teamSizes, v).length" class="muted">No answers yet</li>
              </ul>
            </div>
          </div>
        </section>

        <section class="card">
          <h2>In their own words</h2>
          <p class="sub">Answers to each variant’s “how do you handle this today?” question — the best source for the next iteration of copy.</p>
          <ul v-if="data.notes?.length" class="notes">
            <li v-for="(n, i) in data.notes" :key="i">
              <p class="note-meta mono">
                {{ letter(n.variant) }} · {{ n.ts.slice(0, 10) }} · {{ n.source }}<template v-if="n.role"> · {{ n.role }}</template
                ><template v-if="n.teamSize"> · team {{ n.teamSize }}</template>
              </p>
              <p>{{ n.pain }}</p>
            </li>
          </ul>
          <p v-else class="muted">No answers yet.</p>
        </section>
      </template>
    </template>

    <div
      v-if="tip.show && tip.row"
      class="tooltip"
      role="tooltip"
      :style="{ left: `${tip.x}px`, top: `${tip.y}px` }"
    >
      <p class="tt-title">{{ letter(tip.row.variant) }} · {{ tip.row.label }}</p>
      <p><span>Conversion</span><b>{{ pct(tip.row.ci.p) }}</b></p>
      <p><span>95% interval</span><b>{{ pct(tip.row.ci.lo) }} – {{ pct(tip.row.ci.hi) }}</b></p>
      <p><span>Signups / visitors</span><b>{{ tip.row.signups }} / {{ tip.row.visitors }}</b></p>
      <p><span>P(best)</span><b>{{ pct(tip.row.pBest, 0) }}</b></p>
    </div>
  </div>
</template>

<style scoped>
.page {
  position: relative;
  max-width: 1120px;
  margin: 0 auto;
  padding: 56px 24px 96px;
}
.page::before {
  content: '';
  position: absolute;
  inset: 0 0 auto;
  height: 420px;
  background: radial-gradient(ellipse 60% 70% at 50% 0%, var(--glow), transparent 70%);
  pointer-events: none;
  z-index: -1;
}
.head {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 28px;
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
h1 {
  font-size: clamp(28px, 4vw, 40px);
}
h2 {
  font-size: 19px;
}
h3 {
  font-size: 15px;
  line-height: 1.35;
}
.token {
  max-width: 420px;
  display: grid;
  gap: 10px;
}
.row {
  display: flex;
  gap: 10px;
}
.row .input {
  flex: 1;
}
.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: flex-end;
  margin-bottom: 20px;
}
.filters label {
  display: grid;
  gap: 4px;
  font-size: 13px;
  color: var(--fg-muted);
}
.filters .input {
  height: 40px;
  color: var(--fg);
}
.filters .btn {
  height: 40px;
}
.err {
  color: var(--danger);
  margin: 8px 0;
}
.verdict {
  padding: 16px 20px;
  border-radius: 16px;
  border: 1px solid var(--glass-line);
  background: var(--glass);
  margin-bottom: 20px;
  font-weight: 600;
}
.verdict.win {
  border-color: var(--sun-rim);
  background: var(--accent-soft);
  box-shadow:
    inset 0 -20px 40px var(--glow),
    0 12px 40px var(--glow);
}
.card {
  padding: 28px;
  border: 1px solid var(--glass-line);
  border-radius: var(--radius);
  background: var(--glass);
  margin-bottom: 20px;
  min-width: 0;
}
.sub {
  color: var(--fg-muted);
  font-size: 14px;
  margin-top: 4px;
}
.sub.foot {
  margin-top: 14px;
}
.muted {
  color: var(--fg-faint);
}

/* chart */
.chart {
  margin-top: 24px;
  --label-w: 250px;
  --value-w: 64px;
}
.axis {
  position: relative;
  height: 18px;
  margin: 0 var(--value-w) 6px calc(var(--label-w) + 16px);
  font-size: 12px;
  color: var(--fg-faint);
}
.axis span {
  position: absolute;
  transform: translateX(-50%);
}
.bar-row {
  display: grid;
  grid-template-columns: var(--label-w) minmax(0, 1fr) var(--value-w);
  gap: 16px;
  align-items: center;
  padding: 10px 0;
  border-radius: 8px;
  outline-offset: 4px;
}
.bar-row:hover .bar,
.bar-row:focus-visible .bar {
  filter: brightness(1.12);
}
.bar-label {
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.track {
  position: relative;
  height: 22px;
}
.grid {
  position: absolute;
  top: -10px;
  bottom: -10px;
  width: 1px;
  background: var(--line);
}
.bar {
  position: absolute;
  left: 0;
  top: 3px;
  height: 16px;
  min-width: 2px;
  border-radius: 0 6px 6px 0;
  background: linear-gradient(90deg, var(--sun-mid), var(--sun));
  box-shadow: 0 0 18px var(--glow);
}
.whisker {
  position: absolute;
  top: 10px;
  height: 2px;
  background: var(--fg);
  opacity: 0.7;
}
.whisker::before,
.whisker::after {
  content: '';
  position: absolute;
  top: -5px;
  width: 2px;
  height: 12px;
  background: inherit;
}
.whisker::before {
  left: 0;
}
.whisker::after {
  right: 0;
}
.bar-value {
  font-size: 14px;
  font-weight: 600;
  text-align: right;
}
.tooltip {
  position: fixed;
  z-index: 20;
  transform: translate(12px, calc(-100% - 8px));
  min-width: 220px;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid var(--glass-line);
  background: var(--bg-raised);
  box-shadow: 0 12px 30px -12px rgb(0 0 0 / 0.35);
  font-size: 13px;
  pointer-events: none;
}
.tooltip p {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  color: var(--fg-muted);
}
.tooltip b {
  color: var(--fg);
  font-variant-numeric: tabular-nums;
}
.tt-title {
  font-weight: 600;
  color: var(--fg) !important;
  margin-bottom: 4px;
}

/* tables */
.table-wrap {
  overflow-x: auto;
  margin-top: 14px;
}
table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}
th,
td {
  padding: 10px 10px;
  border-bottom: 1px solid var(--line);
  text-align: left;
  white-space: nowrap;
}
th {
  font-weight: 600;
  color: var(--fg-muted);
  font-size: 12.5px;
}
.num {
  text-align: right;
  font-variant-numeric: tabular-nums;
}

.who {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
  margin-top: 16px;
}
.mini {
  margin: 14px 0 6px;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--fg-faint);
}
.who ul,
.notes {
  list-style: none;
  padding: 0;
  margin: 0;
}
.who li {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  font-size: 14px;
  padding: 4px 0;
}
.notes {
  margin-top: 14px;
  display: grid;
  gap: 12px;
}
.notes li {
  padding: 14px 16px;
  border: 1px solid var(--glass-line);
  border-radius: 14px;
  background: var(--bg);
}
.note-meta {
  font-size: 12px;
  color: var(--fg-faint);
  margin-bottom: 4px;
}

@media (max-width: 760px) {
  .chart {
    --label-w: 110px;
    --value-w: 52px;
  }
  .who {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
