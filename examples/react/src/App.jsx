import { useState } from 'react'
import { CubanCard, CubanCardExplorer } from '@cuban-cards/react'

const cdnBase = import.meta.env.VITE_CUBAN_CARDS_CDN || undefined

function toSummary(result) {
  if (!result) return null
  return {
    prefix: result.prefix,
    network: result.network,
    product: result.product,
    currency: result.currency,
    banks: (result.banks || []).map((bank) => bank.id),
    digits: result.n.length,
    luhn: result.luhn,
    pattern: result.validPattern,
    warning: result.warning?.type || null,
  }
}

export default function App() {
  const [mode, setMode] = useState('compact')
  const [result, setResult] = useState(null)
  const summary = toSummary(result)

  return (
    <main className="demo">
      <div className="demo-head">
        <span className="demo-kicker">React · Vite</span>
        <a
          className="demo-link"
          href="https://github.com/Chichimokers/cuban-cards-components"
          target="_blank"
          rel="noopener noreferrer"
        >
          Ver repositorio
        </a>
      </div>

      <div className="demo-switch" role="tablist" aria-label="Tipo de componente">
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'compact'}
          className={mode === 'compact' ? 'demo-tab demo-tab-on' : 'demo-tab'}
          onClick={() => setMode('compact')}
        >
          Widget compacto
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'explorer'}
          className={mode === 'explorer' ? 'demo-tab demo-tab-on' : 'demo-tab'}
          onClick={() => setMode('explorer')}
        >
          Explorador completo
        </button>
      </div>

      {mode === 'compact' ? (
        <CubanCard
          cdnBase={cdnBase}
          onResult={setResult}
          showExamples
          showBranding
        />
      ) : (
        <CubanCardExplorer cdnBase={cdnBase} onResult={setResult} />
      )}

      <p className="demo-note">
        Ambos componentes consumen el catálogo desde el CDN de{' '}
        <code>qvapay/cuban_cards_prefixes</code>. La identificación ocurre en el
        navegador.
      </p>

      {summary ? (
        <aside className="demo-result" aria-live="polite">
          <h2>Resultado del callback</h2>
          <pre>{JSON.stringify(summary, null, 2)}</pre>
        </aside>
      ) : null}
    </main>
  )
}
