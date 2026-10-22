export const THEME_STORAGE_KEY = 'cuban-cards-components-theme'

export function getSystemTheme() {
  if (typeof window === 'undefined' || !window.matchMedia) return 'dark'
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

export function readStoredTheme() {
  if (typeof window === 'undefined') return null
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
    return stored === 'light' || stored === 'dark' ? stored : null
  } catch {
    return null
  }
}

export function writeStoredTheme(theme) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    // localStorage puede estar bloqueado; el tema sigue funcionando en memoria.
  }
}

export function initialTheme(theme) {
  if (theme === 'light' || theme === 'dark') return theme
  return readStoredTheme() || getSystemTheme()
}
