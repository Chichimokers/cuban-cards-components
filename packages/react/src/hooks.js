import { useEffect, useMemo, useState } from 'react'
import { analyzeCard, loadCatalog } from '@cuban-cards/core'

const EMPTY_STATE = {
  catalog: null,
  validators: null,
  issuersById: {},
  source: null,
  version: null,
  loading: true,
  error: null,
}

export function useCubanCatalog({
  cdnBase,
  fallbackBase,
  enabled = true,
} = {}) {
  const [state, setState] = useState(
    enabled ? EMPTY_STATE : { ...EMPTY_STATE, loading: false },
  )
  const [reloadToken, setReloadToken] = useState(0)

  useEffect(() => {
    if (!enabled) {
      setState({ ...EMPTY_STATE, loading: false })
      return undefined
    }

    let cancelled = false
    setState((current) => ({ ...current, loading: true, error: null }))

    loadCatalog({ cdnBase, fallbackBase })
      .then((data) => {
        if (cancelled) return
        setState({ ...data, loading: false, error: null })
      })
      .catch((error) => {
        if (cancelled) return
        setState({ ...EMPTY_STATE, loading: false, error })
      })

    return () => {
      cancelled = true
    }
  }, [cdnBase, fallbackBase, reloadToken, enabled])

  return {
    ...state,
    reload: () => setReloadToken((token) => token + 1),
  }
}

export function useCubanCards(value, options = {}) {
  const catalogState = useCubanCatalog(options)
  const { catalog, validators, issuersById } = catalogState

  const analysis = useMemo(() => {
    if (!catalog || !validators) return null
    return analyzeCard(value, catalog, validators, issuersById)
  }, [value, catalog, validators, issuersById])

  return { ...catalogState, analysis }
}
