import { useEffect, useMemo, useRef } from 'react'
import { analyzeCard } from '@cuban-cards/core'
import CardVisual from './CardVisual.jsx'
import DetailSummary from './DetailSummary.jsx'
import Warning from './Warning.jsx'
import { useCubanCatalog } from './hooks.js'
import { useTheme } from './useTheme.js'

export default function CubanCardView({
  number = '',
  analysis: analysisProp,
  cdnBase,
  fallbackBase,
  theme = 'dark',
  size = 'compact',
  showDetails = false,
  showBranding = false,
  className = '',
  style,
  onResult,
}) {
  const {
    catalog,
    validators,
    issuersById,
    loading,
  } = useCubanCatalog({
    cdnBase,
    fallbackBase,
    enabled: !analysisProp && Boolean(number),
  })

  const loadedAnalysis = useMemo(() => {
    if (analysisProp || !number || !catalog || !validators) return null
    return analyzeCard(number, catalog, validators, issuersById)
  }, [analysisProp, number, catalog, validators, issuersById])

  const analysis = analysisProp || loadedAnalysis
  const { resolvedTheme } = useTheme(theme)
  const onResultRef = useRef(onResult)

  useEffect(() => {
    onResultRef.current = onResult
  }, [onResult])

  useEffect(() => {
    if (analysis) onResultRef.current?.(analysis)
  }, [analysis])

  return (
    <div
      className={['ccc-root', 'ccc-bare', className].filter(Boolean).join(' ')}
      data-theme={resolvedTheme}
      data-variant="bare"
      style={style}
      aria-busy={loading}
    >
      <CardVisual analysis={analysis} size={size} />

      {showDetails ? <DetailSummary analysis={analysis} /> : null}
      {analysis?.warning ? <Warning warning={analysis.warning} /> : null}

      {showBranding ? (
        <p className="ccc-powered">
          Datos:{' '}
          <a
            href="https://github.com/qvapay/cuban_cards_prefixes"
            target="_blank"
            rel="noopener noreferrer"
          >
            cuban_cards_prefixes
          </a>
        </p>
      ) : null}
    </div>
  )
}
