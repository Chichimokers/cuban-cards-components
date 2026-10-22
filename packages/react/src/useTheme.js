import { useEffect, useState } from 'react'
import {
  initialTheme,
  readStoredTheme,
  writeStoredTheme,
} from './theme.js'

export function useTheme(theme = 'dark') {
  const [resolvedTheme, setResolvedTheme] = useState(() => initialTheme(theme))

  useEffect(() => {
    if (theme === 'light' || theme === 'dark') setResolvedTheme(theme)
  }, [theme])

  useEffect(() => {
    if (theme !== 'auto' || typeof window === 'undefined' || !window.matchMedia) {
      return undefined
    }

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (event) => {
      if (!readStoredTheme()) setResolvedTheme(event.matches ? 'dark' : 'light')
    }

    media.addEventListener?.('change', handleChange)
    return () => media.removeEventListener?.('change', handleChange)
  }, [theme])

  const toggleTheme = () => {
    const next = resolvedTheme === 'dark' ? 'light' : 'dark'
    setResolvedTheme(next)
    writeStoredTheme(next)
  }

  return { resolvedTheme, toggleTheme }
}
