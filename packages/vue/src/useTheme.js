import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { initialTheme, readStoredTheme, writeStoredTheme } from './theme.js'

export function useTheme(getTheme) {
  const resolvedTheme = ref(initialTheme(getTheme()))
  let mediaQuery = null

  function handleSystemTheme(event) {
    if (getTheme() === 'auto' && !readStoredTheme()) {
      resolvedTheme.value = event.matches ? 'dark' : 'light'
    }
  }

  watch(getTheme, (next) => {
    if (next === 'light' || next === 'dark') resolvedTheme.value = next
  })

  onMounted(() => {
    if (
      getTheme() === 'auto' &&
      typeof window !== 'undefined' &&
      window.matchMedia
    ) {
      mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      mediaQuery.addEventListener?.('change', handleSystemTheme)
    }
  })

  onBeforeUnmount(() => {
    mediaQuery?.removeEventListener?.('change', handleSystemTheme)
  })

  function toggleTheme() {
    const next = resolvedTheme.value === 'dark' ? 'light' : 'dark'
    resolvedTheme.value = next
    writeStoredTheme(next)
  }

  return { resolvedTheme, toggleTheme }
}
