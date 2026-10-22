# @cuban-cards/vue

Componentes Vue 3 para identificar tarjetas cubanas con el catálogo abierto [`qvapay/cuban_cards_prefixes`](https://github.com/qvapay/cuban_cards_prefixes), cargado desde su CDN.

## Instalación

```bash
npm install @cuban-cards/vue
```

Importa el CSS una vez:

```js
import '@cuban-cards/vue/style.css'
```

## Uso

```vue
<script setup>
import { ref } from 'vue'
import { CubanCard } from '@cuban-cards/vue'
import '@cuban-cards/vue/style.css'

const number = ref('')
const analysis = ref(null)
</script>

<template>
  <CubanCard v-model="number" @result="analysis = $event" />
</template>
```

`CubanCard` es el widget compacto: input, tarjeta visual y resumen de red, producto, moneda y banco. Es la opción recomendada para incrustar.

### Solo la tarjeta

```vue
<script setup>
import { CubanCardView } from '@cuban-cards/vue'
</script>

<template>
  <CubanCardView number="9204 1299 0000 0003" size="compact" show-details />
</template>
```

También puedes pasar un `analysis` ya calculado:

```vue
<CubanCardView :analysis="analysis" />
```

### Explorador completo

```vue
<script setup>
import { CubanCardExplorer } from '@cuban-cards/vue'
</script>

<template>
  <CubanCardExplorer @result="analysis = $event" />
</template>
```

## Props de `CubanCard`

| Prop | Tipo | Default | Descripción |
| --- | --- | --- | --- |
| `modelValue` | `string` | — | Número controlado con `v-model`. |
| `defaultValue` | `string` | `''` | Número inicial si no usas `v-model`. |
| `cdnBase` | `string` | jsDelivr | URL base alternativa del catálogo. |
| `fallbackBase` | `string` | raw GitHub | Respaldo si falla la fuente principal. |
| `theme` | `'dark' \| 'light' \| 'auto'` | `'dark'` | Tema visual. |
| `showThemeToggle` | `boolean` | `true` | Botón de tema. |
| `showDetails` | `boolean` | `true` | Resumen compacto. |
| `showExamples` | `boolean` | `false` | Ejemplos del catálogo. |
| `showBranding` | `boolean` | `false` | Enlaces de datos y licencia. |
| `inputId` | `string` | autogenerado | `id` del input. |
| `style` | `string \| object \| array` | — | Estilos del contenedor. |

Eventos:

- `update:modelValue(formatted)`
- `change(formatted, digits)`
- `result(analysis)`

`CubanCardView` acepta `number`, `analysis`, `size`, `showDetails`, `theme` y emite `result`. `CubanCardExplorer` acepta las mismas props que `CubanCard`, con `showExamples` y `showBranding` activados por defecto.

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
