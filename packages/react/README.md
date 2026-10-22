# cuban-cards-react

[![npm](https://img.shields.io/npm/v/cuban-cards-react.svg)](https://www.npmjs.com/package/cuban-cards-react)

Componentes React para identificar tarjetas cubanas con el catálogo abierto [`qvapay/cuban_cards_prefixes`](https://github.com/qvapay/cuban_cards_prefixes), cargado desde su CDN.

## Instalación

```bash
npm install cuban-cards-react
```

Importa el CSS una vez:

```js
import 'cuban-cards-react/style.css'
```

## Uso

```jsx
import { CubanCard } from 'cuban-cards-react'
import 'cuban-cards-react/style.css'

export default function App() {
  return (
    <CubanCard
      onResult={(analysis) => {
        console.log(analysis.prefix, analysis.network, analysis.banks)
      }}
    />
  )
}
```

`CubanCard` es el widget compacto: input, tarjeta visual y resumen de red, producto, moneda y banco. Es la opción recomendada para incrustar en una página.

### Solo la tarjeta

```jsx
import { CubanCardView } from 'cuban-cards-react'

<CubanCardView number="9204 1299 0000 0003" size="compact" showDetails />
```

También puedes pasar un `analysis` ya calculado para evitar cargar el catálogo:

```jsx
<CubanCardView analysis={analysis} />
```

### Explorador completo

```jsx
import { CubanCardExplorer } from 'cuban-cards-react'

<CubanCardExplorer onResult={setAnalysis} />
```

## Props de `CubanCard`

| Prop | Tipo | Default | Descripción |
| --- | --- | --- | --- |
| `cdnBase` | `string` | jsDelivr | URL base alternativa del catálogo. |
| `fallbackBase` | `string` | raw GitHub | Respaldo si falla la fuente principal. |
| `defaultValue` | `string` | `''` | Número inicial. |
| `theme` | `'dark' \| 'light' \| 'auto'` | `'dark'` | Tema visual. |
| `showThemeToggle` | `boolean` | `true` | Botón de tema. |
| `showDetails` | `boolean` | `true` | Resumen compacto. |
| `showExamples` | `boolean` | `false` | Ejemplos del catálogo. |
| `showBranding` | `boolean` | `false` | Enlaces de datos y licencia. |
| `inputId` | `string` | autogenerado | `id` del input. |
| `className` | `string` | `''` | Clase adicional. |
| `style` | `CSSProperties` | — | Estilos del contenedor. |
| `onChange` | `(formatted, digits) => void` | — | Cambios del input. |
| `onResult` | `(analysis) => void` | — | Resultado del análisis. |

`CubanCardView` acepta `number`, `analysis`, `size`, `showDetails`, `theme` y `onResult`. `CubanCardExplorer` acepta las mismas props que `CubanCard`, con `showExamples` y `showBranding` activados por defecto.

## CDN

```text
https://cdn.jsdelivr.net/gh/qvapay/cuban_cards_prefixes@main/
```

Respaldo:

```text
https://raw.githubusercontent.com/qvapay/cuban_cards_prefixes/main/
```

El catálogo se cachea en memoria y se comparte entre instancias.

## Privacidad

El número se analiza en el navegador. No se envía a ningún servidor. Los enlaces de reporte incluyen solo los 8 primeros dígitos.

## Licencia

GPL-3.0-or-later. Atribuciones en el [NOTICE del repositorio](https://github.com/Chichimokers/cuban-cards-components/blob/main/NOTICE.md).
