<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { BRAND, type TermLine } from '../shared/copy'
import LogoMark from './LogoMark.vue'

const props = defineProps<{ title: string; lines: TermLine[] }>()

// All lines are always rendered (hidden ones are transparent) so the box never changes height.
const shown = ref(props.lines.length)
let timer: number | undefined

onMounted(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
  shown.value = 0
  const step = () => {
    const done = shown.value >= props.lines.length
    shown.value = done ? 0 : shown.value + 1
    timer = window.setTimeout(step, done ? 400 : shown.value === props.lines.length ? 4200 : 650)
  }
  timer = window.setTimeout(step, 500)
})
onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <figure class="frame term-frame" :aria-label="`Example of events captured by ${BRAND}`">
    <div class="term">
      <figcaption class="bar">
        <LogoMark class="mark" :size="16" />
        <span class="title mono">{{ props.title }}</span>
        <span class="live mono"><span class="pulse" aria-hidden="true"></span>live</span>
      </figcaption>
      <div class="body mono">
        <div class="grid">
          <template v-for="(l, i) in props.lines" :key="i">
            <span class="meta" :class="{ off: i >= shown }">{{ l.meta }}</span>
            <span class="tag" :class="[l.kind, { off: i >= shown }]">{{ l.tag }}</span>
            <span class="text" :class="{ off: i >= shown }">{{ l.text }}</span>
          </template>
        </div>
        <span class="cursor" aria-hidden="true"></span>
      </div>
    </div>
  </figure>
</template>

<style scoped>
.term-frame {
  margin: 0;
  box-shadow:
    0 -20px 80px var(--glow),
    0 40px 100px rgb(0 0 0 / 0.35);
}
.term {
  border-radius: 18px;
  background: var(--term-bg);
  color: var(--term-fg);
  border: 1px solid var(--term-line);
  overflow: hidden;
}
.bar {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 52px;
  padding: 0 18px;
  border-bottom: 1px solid var(--term-line);
  font-size: 13px;
  color: var(--term-muted);
}
.mark {
  flex: 0 0 auto;
  color: var(--term-fg);
}
.title {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--term-fg);
}
.live {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 5px 11px;
  border-radius: 999px;
  background: var(--glow);
  color: var(--sun-light);
  font-size: 12px;
  font-weight: 700;
}
.pulse {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--sun);
  animation: pulse 1.6s ease-in-out infinite;
}
.body {
  padding: 20px 22px 18px;
  font-size: 13px;
  line-height: 1.6;
}
.grid {
  display: grid;
  grid-template-columns: auto auto 1fr;
  column-gap: 16px;
  row-gap: 9px;
}
.meta,
.tag {
  white-space: nowrap;
}
.text {
  overflow-wrap: anywhere;
}
.meta {
  color: var(--term-muted);
}
.tag {
  justify-self: start;
  align-self: start;
  padding: 0 7px;
  border-radius: 6px;
  font-size: 11.5px;
  font-weight: 700;
  line-height: 20px;
}
.tag.ok {
  color: var(--term-ok);
  background: color-mix(in srgb, var(--term-ok) 14%, transparent);
}
.tag.info {
  color: var(--term-info);
  background: color-mix(in srgb, var(--term-info) 14%, transparent);
}
.tag.warn {
  color: var(--term-warn);
  background: color-mix(in srgb, var(--term-warn) 14%, transparent);
}
.tag.err {
  color: var(--term-err);
  background: color-mix(in srgb, var(--term-err) 14%, transparent);
}
.tag.seal {
  color: var(--term-seal);
  background: color-mix(in srgb, var(--sun) 18%, transparent);
}
.off {
  opacity: 0;
}
.meta,
.tag,
.text {
  transition: opacity 0.25s ease;
}
.cursor {
  display: inline-block;
  width: 8px;
  height: 15px;
  margin-top: 6px;
  background: var(--sun);
  animation: blink 1.1s steps(2, start) infinite;
}
@keyframes blink {
  to {
    visibility: hidden;
  }
}
@keyframes pulse {
  50% {
    opacity: 0.35;
  }
}
@media (max-width: 640px) {
  .body {
    padding: 16px 14px;
    font-size: 12px;
  }
  /* The first column (time, actor or service) gets its own line so the event text keeps the width. */
  .grid {
    grid-template-columns: auto 1fr;
    column-gap: 10px;
    row-gap: 2px;
  }
  .meta {
    grid-column: 1 / -1;
    margin-top: 8px;
  }
  .meta:first-child {
    margin-top: 0;
  }
}
@media (prefers-reduced-motion: reduce) {
  .pulse,
  .cursor {
    animation: none;
  }
}
</style>
