import { buildSummary } from '@cuban-cards/core'

export default function DetailSummary({ analysis, className = '' }) {
  if (!analysis?.n) return null

  const { items, checks } = buildSummary(analysis)
  if (!items.length && !checks.length) return null

  return (
    <div className={['ccc-summary-wrap', className].filter(Boolean).join(' ')}>
      {items.length > 0 ? (
        <div className="ccc-summary">
          {items.map((item) => (
            <div className="ccc-summary-item" key={item.key}>
              <span>{item.label}</span>
              <b>{item.value}</b>
            </div>
          ))}
        </div>
      ) : null}

      {checks.length > 0 ? (
        <div className="ccc-checks">
          {checks.map((check) => (
            <span
              className={['ccc-check', check.tone ? `ccc-${check.tone}` : '']
                .filter(Boolean)
                .join(' ')}
              key={check.key}
            >
              {check.label}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  )
}
