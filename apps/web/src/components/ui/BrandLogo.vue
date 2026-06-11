<script setup lang="ts">
defineProps<{ size?: 'sm' | 'md' | 'lg' }>()
</script>

<template>
  <div :class="['logo', `logo--${size ?? 'md'}`]">
    <div class="logo__icon">
      <div class="logo__bar logo__bar--1" />
      <div class="logo__bar logo__bar--2" />
      <div class="logo__bar logo__bar--3" />
    </div>
    <span class="logo__wordmark">
      <span class="logo__bunder">bunder</span><span class="logo__log">log</span>
    </span>
  </div>
</template>

<style scoped>
.logo {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  letter-spacing: -1px;
  font-family: var(--font-ui);
  font-weight: 400;
  user-select: none;
  cursor: default;
}

.logo__icon {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 3px;
}

.logo__bar {
  background: var(--brand);
}

.logo__bunder { color: var(--text); }
.logo__log    { color: var(--brand); }

/* sm */
.logo--sm              { font-size: 16px; gap: 6px; }
.logo--sm .logo__bar   { height: 2px; }
.logo--sm .logo__bar--1 { width: 14px; }
.logo--sm .logo__bar--2 { width: 10px; }
.logo--sm .logo__bar--3 { width: 6px; }

/* md (default) */
.logo--md              { font-size: 20px; }
.logo--md .logo__bar   { height: 2px; }
.logo--md .logo__bar--1 { width: 18px; }
.logo--md .logo__bar--2 { width: 13px; }
.logo--md .logo__bar--3 { width: 8px; }

/* lg */
.logo--lg              { font-size: 28px; gap: 12px; }
.logo--lg .logo__icon  { gap: 4px; }
.logo--lg .logo__bar   { height: 3px; }
.logo--lg .logo__bar--1 { width: 24px; }
.logo--lg .logo__bar--2 { width: 18px; }
.logo--lg .logo__bar--3 { width: 10px; }
</style>
