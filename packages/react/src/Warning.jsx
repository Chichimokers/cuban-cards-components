import { getIcon } from '@cuban-cards/core'

export default function Warning({ warning }) {
  if (!warning) return null

  return (
    <div className="ccc-warn">
      <div
        className="ccc-warn-ic"
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: getIcon('alert') }}
      />
      <div className="ccc-warn-tx">
        <b>{warning.title}</b>
        <p>{warning.text}</p>
        <a
          className="ccc-warnbtn"
          href={warning.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          Reportar dato en GitHub
        </a>
        <span className="ccc-warnpriv">
          Solo se comparten los 8 primeros dígitos de tu tarjeta.
        </span>
      </div>
    </div>
  )
}
