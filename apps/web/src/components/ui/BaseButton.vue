<script setup lang="ts">
defineProps<{
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  href?: string
  disabled?: boolean
}>()
</script>

<template>
  <a
    v-if="href"
    :href="href"
    :class="['btn', `btn--${variant ?? 'primary'}`, `btn--${size ?? 'md'}`]"
  >
    <slot />
  </a>
  <button
    v-else
    :class="['btn', `btn--${variant ?? 'primary'}`, `btn--${size ?? 'md'}`]"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border-radius: 6px;
  font-family: var(--font-ui);
  font-weight: 500;
  letter-spacing: -0.01em;
  cursor: pointer;
  border: 1px solid transparent;
  text-decoration: none;
  transition: background 0.15s, border-color 0.15s, color 0.15s, opacity 0.15s;
  white-space: nowrap;
  line-height: 1;
}

.btn--sm  { padding: 7px 13px;  font-size: 13px; }
.btn--md  { padding: 9px 18px;  font-size: 14px; }
.btn--lg  { padding: 12px 24px; font-size: 15px; }

.btn--primary {
  background: var(--brand);
  color: #fff;
  border-color: var(--brand);
}
.btn--primary:hover { background: var(--brand-dark); border-color: var(--brand-dark); }

.btn--secondary {
  background: var(--elevated);
  color: var(--text);
  border-color: var(--border);
}
.btn--secondary:hover { border-color: #555; background: #2a2a2a; }

.btn--ghost {
  background: transparent;
  color: var(--muted);
  border-color: transparent;
}
.btn--ghost:hover { color: var(--text); }

.btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  pointer-events: none;
}
</style>
