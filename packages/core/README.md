# @cuban-cards/core

Lógica compartida por `cuban-cards-react` y `cuban-cards-vue`:

- carga del catálogo desde el CDN de `qvapay/cuban_cards_prefixes`,
- normalización y validación de números,
- resolución de red, producto, moneda, banco y variantes,
- temas, colores, ejemplos y avisos de datos incompletos.

Este paquete es interno del monorepo y se incluye en los bundles de React y Vue. No está pensado para publicarse por separado en esta etapa.

## API principal

```js
import {
  DEFAULT_CDN_BASE,
  DEFAULT_FALLBACK_BASE,
  analyzeCard,
  buildExamples,
  buildSummary,
  formatCardNumber,
  getCardLength,
  loadCatalog,
} from '@cuban-cards/core'
```

```js
const { catalog, validators, issuersById, version, source } = await loadCatalog()
const analysis = analyzeCard('9204 1299 0000 0003', catalog, validators, issuersById)
```

El catálogo se cachea en memoria y se comparte entre llamadas.

## Licencia

GPL-3.0-or-later. Atribuciones en el [NOTICE del repositorio](https://github.com/Chichimokers/cuban-cards-components/blob/main/NOTICE.md).
