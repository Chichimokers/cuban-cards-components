import { useEffect, useId, useMemo, useRef, useState } from 'react'
import {
  REPORT_ORIGIN,
  analyzeCard,
  buildExamples,
  formatCardNumber,
  getCardLength,
  getIcon,
} from '@cuban-cards/core'
import CardVisual from './CardVisual.jsx'
import DetailSummary from './DetailSummary.jsx'
import Warning from './Warning.jsx'
import { useCubanCatalog } from './hooks.js'
import { useTheme } from './useTheme.js'

export default function CubanCard({
  cdnBase,
  fallbackBase,
  defaultValue = '',
  theme = 'dark',
  showThemeToggle = true,
  showDetails = true,
  showExamples = false,
  showBranding = false,
  className = '',
  style,
  onChange,
  onResult,
  inputId: inputIdProp,
}) {
  const {
    catalog,
    validators,
    issuersById,
    version,
    loading,
    error,
    reload,
  } = useCubanCatalog({ cdnBase, fallbackBase })

  const reactId = useId()
  const inputId = inputIdProp || `ccc-card-${reactId.replace(/:/g, '')}`
  const [value, setValue] = useState(() => formatCardNumber(defaultValue))
  const { resolvedTheme, toggleTheme } = useTheme(theme)
  const onResultRef = useRef(onResult)
  const cardLength = getCardLength(catalog)

  useEffect(() => {
    onResultRef.current = onResult
  }, [onResult])

  useEffect(() => {
    if (!catalog) return
    setValue((current) => {
      const digits = current.replace(/\D/g, '').slice(0, cardLength)
      const formatted = formatCardNumber(digits)
      return formatted === current ? current : formatted
    })
  }, [catalog, cardLength])

  const analysis = useMemo(() => {
    if (!catalog || !validators) return null
    return analyzeCard(value, catalog, validators, issuersById)
  }, [value, catalog, validators, issuersById])

  useEffect(() => {
    if (analysis) onResultRef.current?.(analysis)
  }, [analysis])

  const examples = useMemo(
    () => (catalog ? buildExamples(catalog, issuersById, 4) : []),
    [catalog, issuersById],
  )

  const applyValue = (raw) => {
    const digits = String(raw ?? '')
      .replace(/\D/g, '')
      .slice(0, cardLength)
    const formatted = formatCardNumber(digits)
    setValue(formatted)
    onChange?.(formatted, digits)
  }

  const versionLabel = loading
    ? 'cargando'
    : error
      ? 'sin conexión'
      : version
        ? `v${version}`
        : 'sin datos'

  return (
    <div
      className={['ccc-root', 'ccc-widget-root', className]
        .filter(Boolean)
        .join(' ')}
      data-theme={resolvedTheme}
      data-variant="widget"
      style={style}
      aria-busy={loading}
    >
      <div className="ccc-widget-panel">
        <div className="ccc-widget-head">
          <div>
            <div className="ccc-widget-title">Identificar tarjeta</div>
            <div className="ccc-widget-subtitle">Catálogo abierto de Cuba</div>
          </div>
          <div className="ccc-widget-actions">
            <span className="ccc-widget-badge">{versionLabel}</span>
            {showThemeToggle ? (
              <button
                className="ccc-themebtn ccc-themebtn-compact"
                type="button"
                onClick={toggleTheme}
                aria-label="Cambiar entre modo claro y oscuro"
                title="Cambiar entre modo claro y oscuro"
              >
                <span
                  className="ccc-ic-sun"
                  aria-hidden="true"
                  dangerouslySetInnerHTML={{ __html: getIcon('sun') }}
                />
                <span
                  className="ccc-ic-moon"
                  aria-hidden="true"
                  dangerouslySetInnerHTML={{ __html: getIcon('moon') }}
                />
              </button>
            ) : null}
          </div>
        </div>

        <div className="ccc-widget-field">
          <label className="ccc-label" htmlFor={inputId}>
            <span
              className="ccc-ic"
              aria-hidden="true"
              dangerouslySetInnerHTML={{ __html: getIcon('card') }}
            />
            Número de tarjeta
          </label>
          <input
            id={inputId}
            className="ccc-input"
            inputMode="numeric"
            autoComplete="off"
            placeholder="9205 0699 0000 0000"
            maxLength={cardLength + Math.floor((cardLength - 1) / 4)}
            value={value}
            onChange={(event) => applyValue(event.target.value)}
            disabled={loading || !catalog}
          />
          <span className="ccc-widget-hint">
            Se procesa en tu navegador. No se envía el número.
          </span>
        </div>

        <CardVisual
          analysis={analysis}
          size="compact"
          className="ccc-widget-card"
        />

        {loading ? (
          <div className="ccc-widget-status" role="status">
            Cargando el catálogo desde el CDN…
          </div>
        ) : error ? (
          <div className="ccc-widget-status" role="alert">
            No se pudo cargar el catálogo.{' '}
            <button type="button" className="ccc-retry" onClick={reload}>
              Reintentar
            </button>
          </div>
        ) : (
          <div aria-live="polite">
            {showDetails ? <DetailSummary analysis={analysis} /> : null}
          </div>
        )}

        {analysis?.warning ? <Warning warning={analysis.warning} /> : null}

        {analysis?.notes ? (
          <details className="ccc-widget-notes">
            <summary>Notas del catálogo</summary>
            <p>{analysis.notes}</p>
          </details>
        ) : null}

        {showExamples && examples.length > 0 ? (
          <div className="ccc-ex ccc-ex-compact">
            {examples.map((example) => (
              <button
                key={example.prefix + example.label}
                type="button"
                onClick={() => applyValue(example.value)}
              >
                <span
                  className="ccc-dot"
                  style={{ background: example.color }}
                />
                {example.label}
              </button>
            ))}
          </div>
        ) : null}

        {showBranding ? (
          <p className="ccc-powered ccc-powered-compact">
            Datos:{' '}
            <a
              href="https://github.com/qvapay/cuban_cards_prefixes"
              target="_blank"
              rel="noopener noreferrer"
            >
              cuban_cards_prefixes
            </a>{' '}
            ·{' '}
            <a href={REPORT_ORIGIN} target="_blank" rel="noopener noreferrer">
              GPL-3.0
            </a>
          </p>
        ) : null}
      </div>
    </div>
  )
}
