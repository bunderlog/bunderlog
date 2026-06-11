import { ref } from 'vue'

const isDark = ref(true)

function applyTheme(dark: boolean) {
  document.documentElement.classList.toggle('light', !dark)
}

export function useTheme() {
  function initTheme() {
    const saved = localStorage.getItem('theme')
    isDark.value = saved
      ? saved === 'dark'
      : window.matchMedia('(prefers-color-scheme: dark)').matches
    applyTheme(isDark.value)
  }

  function toggleTheme() {
    isDark.value = !isDark.value
    applyTheme(isDark.value)
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  }

  return { isDark, toggleTheme, initTheme }
}
