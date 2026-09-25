<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ file: string; lang: 'python' | 'ts' | 'bash'; source: string }>()

type Token = { text: string; cls?: string }

const COMMENT = { python: '#[^\\n]*', bash: '#[^\\n]*', ts: '//[^\\n]*' }
const KEYWORDS = 'from|import|def|return|await|const|let|export|async|function'

// Tiny highlighter: comments, strings, keywords, decorators and ENV_VARS — enough for three snippets.
const tokens = computed<Token[]>(() => {
  const re = new RegExp(
    `(${COMMENT[props.lang]})|("(?:[^"\\\\\\n]|\\\\.)*")|\\b(${KEYWORDS})\\b|(@[\\w.]+)(?=\\()|^([A-Z][A-Z0-9_]+)(?==)`,
    'gm',
  )
  const out: Token[] = []
  let last = 0
  for (const m of props.source.matchAll(re)) {
    if (m.index > last) out.push({ text: props.source.slice(last, m.index) })
    const cls = m[1] ? 'c' : m[2] ? 's' : m[3] ? 'k' : m[4] ? 'd' : 'v'
    out.push({ text: m[0], cls })
    last = m.index + m[0].length
  }
  out.push({ text: props.source.slice(last) })
  return out
})
</script>

<template>
  <figure class="frame code">
    <div class="inner">
      <figcaption>
        <span class="file mono">{{ props.file }}</span>
      </figcaption>
      <pre class="mono"><code><span v-for="(t, i) in tokens" :key="i" :class="t.cls">{{ t.text }}</span></code></pre>
    </div>
  </figure>
</template>

<style scoped>
.code {
  margin: 0;
}
.inner {
  border-radius: 18px;
  background: var(--term-bg);
  border: 1px solid var(--term-line);
  overflow: hidden;
}
figcaption {
  display: flex;
  padding: 8px;
  border-bottom: 1px solid var(--term-line);
}
.file {
  padding: 8px 14px;
  border-radius: 10px;
  background: color-mix(in srgb, var(--term-fg) 8%, transparent);
  color: var(--term-fg);
  font-size: 13px;
  font-weight: 600;
}
pre {
  margin: 0;
  padding: 22px 24px;
  color: var(--term-fg);
  font-size: 13.5px;
  line-height: 1.8;
  overflow-x: auto;
}
.c {
  color: var(--term-muted);
  font-style: italic;
}
.s {
  color: var(--term-seal);
}
.k {
  color: var(--term-info);
}
.d,
.v {
  color: var(--term-warn);
}
</style>
