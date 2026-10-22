import { useEffect, useId, useMemo, useRef, useState } from 'react'
import {
  REPORT_ORIGIN,
  TILE_COLORS,
  analyzeCard,
  buildExamples,
  formatCardNumber,
  getCardLength,
  getIcon,
} from '@cuban-cards/core'
import CardVisual from './CardVisual.jsx'
import Warning from './Warning.jsx'
import { useCubanCatalog } from './hooks.js'
import { useTheme } from './useTheme.js'

function splitSegments(n) {
  return [
    [n.slice(0, 2), 'red'],
    [n.slice(2, 4), 'producto'],
    [n.slice(4, 8), 'emisor'],
    [n.slice(8, 15), 'cuenta'],
    [n.slice(15, 16), 'control'],
  ]
}

export default function CubanCardExplorer({
  cdnBase,
  fallbackBase,
  defaultValue = '',
  theme = 'dark',
  showThemeToggle = true,
  showExamples = true,
  showBranding = true,
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
    () => (catalog ? buildExamples(catalog, issuersById) : []),
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

  const colors = analysis?.colors || ['#0071e3', '#42a5f5']
  const maxLength = cardLength + Math.floor((cardLength - 1) / 4)
  const versionLabel = loading
    ? 'cargando…'
    : error
      ? 'sin conexión'
      : catalog
        ? `v${version || '—'} · ${catalog.prefixes.length} prefijos`
        : 'sin datos'

  const rows = []
  if (analysis?.network) {
    rows.push({ icon: 'net', label: 'Red', value: analysis.network })
  }
  if (analysis?.product) {
    rows.push({ icon: 'prod', label: 'Producto', value: analysis.product })
  }
  if (analysis?.currency) {
    rows.push({
      icon: 'cur',
      label: 'Moneda',
      value: `${analysis.currency}${analysis.mlc ? ' con respaldo en MLC' : ''}`,
    })
  }
  if (analysis?.aliases?.length) {
    rows.push({
      icon: 'prod',
      label: 'Alias',
      value: analysis.aliases.join(', '),
    })
  }
  if (analysis?.banks?.length) {
    rows.push({
      icon: 'bank',
      label: 'Banco',
      value: analysis.banks.map((bank) => bank.name).join(', '),
    })
  }
  if (analysis?.n) {
    rows.push({
      icon: 'dig',
      label: 'Dígitos',
      value: `${analysis.n.length} de ${analysis.cardLength}`,
    })
  }
  if (analysis?.luhn != null) {
    rows.push({
      icon: 'shield',
      label: 'Dígito de control',
      value: analysis.luhn ? (
        <span className="ccc-ok">Válido</span>
      ) : (
        <span className="ccc-bad">No válido</span>
      ),
    })
  }
  if (analysis?.validPattern != null) {
    rows.push({
      icon: 'check',
      label: 'Patrón del catálogo',
      value: analysis.validPattern ? (
        <span className="ccc-ok">Coincide</span>
      ) : (
        <span className="ccc-bad">No coincide</span>
      ),
    })
  }
  if (!rows.length) {
    rows.push({
      icon: 'dig',
      label: 'Estado',
      value: loading ? 'Cargando…' : 'Escribe o pega un número.',
    })
  }

  const segments = splitSegments(analysis?.n || '')
  const rootStyle = {
    '--ccc-a1': colors[0],
    '--ccc-a2': colors[1],
    ...style,
  }

  return (
    <div
      className={['ccc-root', className].filter(Boolean).join(' ')}
      data-theme={resolvedTheme}
      data-variant="explorer"
      style={rootStyle}
      aria-busy={loading}
    >
      <div className="ccc-wrap">
        <div className="ccc-topbar">
          <span className="ccc-eyebrow">Catálogo abierto · Cuba</span>
          {showThemeToggle ? (
            <button
              className="ccc-themebtn"
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

        <h1 className="ccc-title">
          Explorador de tarjetas cubanas
          <span className="ccc-badge">{versionLabel}</span>
        </h1>
        <p className="ccc-sub">
          Pega un número y el catálogo lo identifica al instante: red, producto,
          moneda y banco. La tarjeta se dibuja como la original de cada banco,
          sin datos personales.
        </p>

        <CardVisual analysis={analysis} size="default" />

        <div className="ccc-panel">
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
            maxLength={maxLength}
            value={value}
            onChange={(event) => applyValue(event.target.value)}
            disabled={loading || !catalog}
          />

          <div className="ccc-anat">
            {segments.map(([text, label], index) => (
              <div
                key={label}
                className={[
                  'ccc-seg',
                  text ? 'ccc-on' : '',
                  index === 3 ? 'ccc-long' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <b>{text || '····'}</b>
                <span>{label}</span>
              </div>
            ))}
          </div>

          {loading ? (
            <div className="ccc-state" role="status">
              Cargando el catálogo desde el CDN…
            </div>
          ) : error ? (
            <div className="ccc-state" role="alert">
              No se pudo cargar el catálogo desde el CDN. Revisa tu conexión.{' '}
              <button type="button" className="ccc-retry" onClick={reload}>
                Reintentar
              </button>
            </div>
          ) : (
            <div className="ccc-rows">
              {rows.map((row) => (
                <div className="ccc-row" key={`${row.icon}-${row.label}`}>
                  <span className="ccc-k">
                    <span
                      className="ccc-tile"
                      style={{ background: TILE_COLORS[row.icon] }}
                      aria-hidden="true"
                      dangerouslySetInnerHTML={{ __html: getIcon(row.icon) }}
                    />
                    {row.label}
                  </span>
                  <b>{row.value}</b>
                </div>
              ))}
            </div>
          )}

          {analysis?.notes ? (
            <div className="ccc-notes">{analysis.notes}</div>
          ) : null}

          {analysis?.warning ? <Warning warning={analysis.warning} /> : null}

          {showExamples && examples.length > 0 ? (
            <div className="ccc-ex">
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
        </div>

        {showBranding ? (
          <p className="ccc-powered">
            Datos:{' '}
            <a
              href="https://github.com/qvapay/cuban_cards_prefixes"
              target="_blank"
              rel="noopener noreferrer"
            >
              cuban_cards_prefixes
            </a>{' '}
            (MIT) · Estilo basado en{' '}
            <a
              href="https://github.com/rblez/explorador-tarjetas-cubanas"
              target="_blank"
              rel="noopener noreferrer"
            >
              Explorador de tarjetas cubanas
            </a>{' '}
            ·{' '}
            <a href={REPORT_ORIGIN} target="_blank" rel="noopener noreferrer">
              Código GPL-3.0
            </a>
            <br />
            La identificación ocurre entera en tu navegador: el número no se
            envía a ningún servidor.
          </p>
        ) : null}
      </div>
    </div>
  )
}
